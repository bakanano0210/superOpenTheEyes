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
import java.nio.ByteBuffer
import kotlin.math.max
import kotlin.math.min



class ImageProcessing2Plugin(
  proxy: VisionCameraProxy, 
  options: Map<String, Any>?
  ): FrameProcessorPlugin() {
    private var eyeDetector: CascadeClassifier? = null
    private var faceDetector: CascadeClassifier? = null

    init {
        try {
            // Load pre-trained OpenCV Haar Cascade for eye detection
            val cascadeFile = File(proxy.context.cacheDir, "haarcascade_eye.xml")
            proxy.context.assets.open("haarcascade_eye.xml").use { input ->
                FileOutputStream(cascadeFile).use { output ->
                    input.copyTo(output)
                }
            }
            eyeDetector = CascadeClassifier(cascadeFile.absolutePath)


            // Load Haar Cascade for face
            val faceCascadeFile = File(proxy.context.cacheDir, "haarcascade_frontalface_alt.xml")
            proxy.context.assets.open("haarcascade_frontalface_alt.xml").use { input ->
                FileOutputStream(faceCascadeFile).use { output ->
                    input.copyTo(output)
                }
            }
            faceDetector = CascadeClassifier(faceCascadeFile.absolutePath)

            if (eyeDetector?.empty() == true || faceDetector?.empty() == true) {
                Log.e("ImageProcessingPlugin", "Failed to load Haar Cascades")
                eyeDetector = null
                faceDetector = null
            } else {
                Log.d("ImageProcessingPlugin", "Haar Cascades loaded successfully")
            }
        } catch (e: Exception) {
            Log.e("ImageProcessingPlugin", "Error initializing CascadeClassifier", e)
        }
    }
  override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
      return try {
            Log.d("ImageProcessingPlugin", "Processing frame started.")

            // 프레임의 YUV 데이터 추출 
            val yBuffer: ByteBuffer = frame.image.planes[0].buffer
            val ySize = yBuffer.remaining()
            val nv21 = ByteArray(ySize)
            yBuffer.get(nv21, 0, ySize)


            Log.d("ImageProcessingPlugin", "Frame converted to NV21 format.")

            // NV21 데이터를 OpenCV Mat 객체로 변환
            val mat = Mat(frame.image.height, frame.image.width, CvType.CV_8UC1)
            mat.put(0, 0, nv21)
            Log.d("ImageProcessingPlugin", "Mat created with size: ${mat.size()}, type: ${mat.type()}")

            // Preprocess image: Equalize histogram
            Imgproc.cvtColor(mat, mat, Imgproc.COLOR_YUV2GRAY_420)  // YUV -> Grayscale 변환
            Imgproc.equalizeHist(mat, mat)
            Log.d("ImageProcessingPlugin", "Histogram equalized.")

            
            // Detect faces
            val faceRects = MatOfRect()
            faceDetector?.detectMultiScale(
                mat,
                faceRects,
                1.05,
                2,
                0,
                Size(20.0, 20.0),
                Size()
            )
            Log.d("ImageProcessingPlugin", "Detected faces: ${faceRects.toArray().size}")

            // 얼굴 ROI에서 눈 탐지
            var eyesDetected = false
            for (face in faceRects.toArray()) {
                val expandedFace = Rect(
                    max(0, face.x - face.width / 4),
                    max(0, face.y - face.height / 4),
                    min(mat.cols() - face.x, face.width * 3 / 2),
                    min(mat.rows() - face.y, face.height * 3 / 2)
                )
                val faceROI  = Mat(mat, expandedFace)

                // Detect eyes within the face region
                val eyeRects = MatOfRect()
                eyeDetector?.detectMultiScale(
                    faceROI,
                    eyeRects,
                    1.05,
                    2,
                    0,
                    Size(10.0, 10.0),
                    Size()
                )
                Log.d("ImageProcessingPlugin", "Eyes detected: ${eyeRects.toArray().size} in face: ${face}")

                if (eyeRects.toArray().isNotEmpty()) {
                    eyesDetected = true
                    break
                }
            }

            eyesDetected
        } catch (e: Exception) {
            Log.e("ImageProcessingPlugin", "Error processing frame", e)
            false
        }
    }
  
}