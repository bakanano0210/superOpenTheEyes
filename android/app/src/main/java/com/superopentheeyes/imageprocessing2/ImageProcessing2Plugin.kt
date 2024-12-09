package com.superopentheeyes.imageprocessing2

import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import org.opencv.android.Utils
import org.opencv.objdetect.CascadeClassifier
import org.opencv.core.*
import org.opencv.imgproc.Imgproc

import java.io.File
import java.io.FileOutputStream
import android.util.Log
import kotlin.math.max
import kotlin.math.min

import org.tensorflow.lite.Interpreter
import java.nio.ByteBuffer
import java.nio.ByteOrder


class ImageProcessing2Plugin(
  proxy: VisionCameraProxy, 
  options: Map<String, Any>?
  ): FrameProcessorPlugin() {
    private var tflite: Interpreter? = null
    init {
        try {
            // TFLite 모델 파일 로드
            val modelFile = proxy.context.assets.open("face_detection_short_range.tflite").use { input ->
                val modelBytes = input.readBytes()
                ByteBuffer.allocateDirect(modelBytes.size).apply {
                    order(ByteOrder.nativeOrder())
                    put(modelBytes)
                }
            }
            tflite = Interpreter(modelFile)
            Log.d("ImageProcessingPlugin", "TFLite model loaded successfully")
        } catch (e: Exception) {
            Log.e("ImageProcessingPlugin", "Error loading TFLite model", e)
        }
    }
    override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
        return try {
            Log.d("ImageProcessingPlugin", "Processing frame started.")

            // 프레임의 RGB 데이터 추출
            val yuvBuffer = frame.image.planes[0].buffer
            val width = frame.image.width
            val height = frame.image.height

            // Mediapipe TFLite 모델에 맞게 프레임을 128x128 크기로 변환
            val resizedBuffer = resizeYUVtoRGB(yuvBuffer, width, height, 128, 128)
            
            Log.d("ImageProcessingPlugin", "Resized RGB Sample: ${resizedBuffer.sliceArray(0..9).joinToString()}")

            // TFLite 모델 입력 및 출력 준비
            val inputBuffer = ByteBuffer.allocateDirect(1 * 128 * 128 * 3 * 4).apply {
                order(ByteOrder.nativeOrder())
                put(resizedBuffer)
            }
            inputBuffer.rewind()

            val outputBuffer = Array(1) { Array(896) { FloatArray(16) } }
            val inputShape = tflite?.getInputTensor(0)?.shape()
            Log.d("ImageProcessingPlugin", "Expected Input Shape: ${inputShape?.contentToString()}")

            val outputShape = tflite?.getOutputTensor(0)?.shape()
            Log.d("ImageProcessingPlugin", "Expected Output Shape: ${outputShape?.contentToString()}")

            Log.d("ImageProcessingPlugin", "Input Buffer Capacity: ${inputBuffer.capacity()}")

            // 모델 실행
            tflite?.run(inputBuffer, outputBuffer)
            Log.d("ImageProcessingPlugin", "Raw Output: ${outputBuffer.contentDeepToString()}")

            // 결과 파싱
            val detections = parseDetectionOutput(outputBuffer[0], width, height).take(1)
            Log.d("ImageProcessingPlugin", "Detections: $detections")
            Log.d("ImageProcessingPlugin", "Input Buffer Size: ${inputBuffer.capacity()}")
            Log.d("ImageProcessingPlugin", "Output Shape: ${outputBuffer.size}")

            // JSON-호환 데이터만 반환
            detections.map { detection ->
                mapOf(
                    "x" to detection["x"],
                    "y" to detection["y"],
                    "width" to detection["width"],
                    "height" to detection["height"],
                    "score" to detection["score"]
                )
            }
        }catch (e: IllegalArgumentException) {
            Log.e("ImageProcessingPlugin", "IllegalArgumentException: ${e.message}")
            null // 예외가 발생해도 JS로 전달하지 않고 안전하게 처리
        } catch (e: Exception) {
            Log.e("ImageProcessingPlugin", "Unexpected error: ${e.message}")
            null
        }
    }
    private fun resizeYUVtoRGB(
        yuvBuffer: ByteBuffer,
        originalWidth: Int,
        originalHeight: Int,
        targetWidth: Int,
        targetHeight: Int
    ): ByteArray {
        val yuvMat = Mat(originalHeight + originalHeight / 2, originalWidth, CvType.CV_8UC1)
        val yuvBytes = ByteArray(yuvBuffer.remaining())
        yuvBuffer.get(yuvBytes)
        yuvMat.put(0, 0, yuvBytes)

        // YUV -> RGB 변환
        val rgbMat = Mat()
        Imgproc.cvtColor(yuvMat, rgbMat, Imgproc.COLOR_YUV2RGB_NV21)

        // 각 채널별 데이터 범위 확인
        val channels = mutableListOf<Mat>()
        Core.split(rgbMat, channels)

        channels.forEachIndexed { index, channel ->
            if (channel.empty()) {
                throw Exception("Channel $index is empty!")
            }
            val minMaxLoc = Core.minMaxLoc(channel)
            Log.d(
                "ImageProcessingPlugin",
                "Channel $index - Min: ${minMaxLoc.minVal}, Max: ${minMaxLoc.maxVal}, Rows: ${channel.rows()}, Cols: ${channel.cols()}"
            )
            channel.release() // 메모리 해제
        }

        // 크기 조정
        val resizedMat = Mat()
        Imgproc.resize(rgbMat, resizedMat, Size(targetWidth.toDouble(), targetHeight.toDouble()))
        
        // RGB 데이터를 ByteArray로 변환
        val rgbBuffer = ByteArray(targetWidth * targetHeight * 3)
        resizedMat.get(0, 0, rgbBuffer)

        // 결과 확인 (샘플 데이터 출력)
        Log.d(
            "ImageProcessingPlugin",
            "Resized RGB Sample: ${rgbBuffer.take(10).joinToString(", ")}"
        )

        // 메모리 해제
        rgbMat.release()
        resizedMat.release()
        yuvMat.release()

        return rgbBuffer
    }

    private fun parseDetectionOutput(
        output:  Array<FloatArray>,
        originalWidth: Int,
        originalHeight: Int
    ): List<Map<String, Any>> {
        val results = mutableListOf<Map<String, Any>>()
        val scoreThreshold = 0.5f

        for (i in output.indices) {
            val bbox = output[i]
            val score = bbox[4] // Confidence score for the detection
            if (score >= scoreThreshold) {
                val x = bbox[0].coerceIn(0f, 1f)
                val y = bbox[1].coerceIn(0f, 1f)
                val w = bbox[2].coerceIn(0f, 1f)
                val h = bbox[3].coerceIn(0f, 1f)
                
                // Add bounding box result
                results.add(
                    mapOf(
                        "x" to x.toDouble(),
                        "y" to y.toDouble(),
                        "width" to w.toDouble(),
                        "height" to h.toDouble(),
                        "score" to score.toDouble()
                    )
                )
            }
        }

        Log.d("ImageProcessingPlugin", "Parsed Results: $results")
        return results
    }
}