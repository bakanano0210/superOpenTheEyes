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
            val modelFile = proxy.context.assets.open("drowsiness_detection.tflite").use { input ->
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

            // Retrieve RGB data from arguments
            val rgbData = (arguments?.get("resized") as? List<Double>)
                ?.map{ it.toFloat() }
                ?.toFloatArray()
                ?: throw IllegalArgumentException("Missing or invalid 'resized' RGB data.")
            Log.d("ImageProcessingPlugin", "Resized Data: ${rgbData.asIterable().take(10)}")

            // Validate input size
            if (rgbData.size != 26 * 34 * 3) {
                throw IllegalArgumentException("Invalid RGB data size: ${rgbData.size}, expected: 640*480*3.")
            }
            val grayscaleData = FloatArray(26 * 34) { i ->
                val r = rgbData[i * 3]       // Red
                val g = rgbData[i * 3 + 1]   // Green
                val b = rgbData[i * 3 + 2]   // Blue
                // Grayscale 변환 공식: 0.299*R + 0.587*G + 0.114*B
                0.299f * r + 0.587f * g + 0.114f * b
            }

            // Prepare TFLite input buffer (640x480x3)
            val inputBuffer = ByteBuffer.allocateDirect(26 * 34 * 4).apply {
                order(ByteOrder.nativeOrder())
                grayscaleData.forEach { pixel ->
                    putFloat(pixel) // Normalize pixel values to [0, 1]
                }
            }

            // inputBuffer.rewind()
            // val inputTensor = tflite?.getInputTensor(0)
            // Log.d("TFLiteModel", "Input Tensor Shape: ${inputTensor?.shape()?.contentToString()}")
            // Log.d("TFLiteModel", "Input Tensor Data Type: ${inputTensor?.dataType()}")
            // Prepare TFLite output buffer
            val outputBuffer = Array(1) { FloatArray(1) }

            // Run inference
            tflite?.run(inputBuffer, outputBuffer)
            Log.d("ImageProcessingPlugin", "Raw Output: ${outputBuffer.contentDeepToString()}")

            // Format result as requested
            val detectionResult = mapOf("0" to outputBuffer[0][0].toDouble())
            Log.d("ImageProcessingPlugin", "Formatted Result: $detectionResult")

            // Return JSON-compatible result
            detectionResult
        } catch (e: Exception) {
            Log.e("ImageProcessingPlugin", "Unexpected error: ${e.message}")
            null
        }
    }

    private fun convertYUVtoRGB(yuvBuffer: ByteBuffer, width: Int, height: Int): ByteArray {
        val yuvMat = Mat(height + height / 2, width, CvType.CV_8UC1)
        val yuvBytes = ByteArray(yuvBuffer.remaining())
        yuvBuffer.get(yuvBytes)
        yuvMat.put(0, 0, yuvBytes)

        val rgbMat = Mat()
        Imgproc.cvtColor(yuvMat, rgbMat, Imgproc.COLOR_YUV2RGB_NV21)

        val rgbBuffer = ByteArray(width * height * 3)
        rgbMat.get(0, 0, rgbBuffer)

        yuvMat.release()
        rgbMat.release()

        return rgbBuffer
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