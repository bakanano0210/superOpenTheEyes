package com.superopentheeyes.imageprocessing2

import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

import org.json.JSONObject

class ImageProcessing2Plugin(proxy: VisionCameraProxy, options: Map<String, Any>?): FrameProcessorPlugin() {
  override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
            return try {
            // Extract metadata from frame
            val frameInfo = JSONObject()
            frameInfo.put("width", frame.width)
            frameInfo.put("height", frame.height)
            frameInfo.put("timestamp", frame.timestamp)
            frameInfo.put("planesCount", frame.planesCount)
            frameInfo.put("bytesPerRow", frame.bytesPerRow)

            // Return the JSON data as a string
            frameInfo.toString()
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
  
}