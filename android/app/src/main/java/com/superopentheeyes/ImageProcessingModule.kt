// ImageProcessingModule.kt

package com.superopentheeyes // 경로가 MainApplication과 동일해야 함

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log
import android.util.Base64


class ImageProcessingModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val module: ImageNativeModule = ImageNativeModule.getInstance()
  private var initialized = false

  override fun getName(): String {
    return "ImageProcessing"
  }
    @ReactMethod
    fun processImage(data: String, promise: Promise) {
        try {
            // Base64를 byte[]로 디코딩
            val imageData = Base64.decode(data, Base64.DEFAULT)

            // 처리된 데이터를 다시 Base64로 변환 (테스트용 응답)
            val processedData = Base64.encodeToString(imageData, Base64.DEFAULT)

            // 처리 결과를 Promise로 반환
            promise.resolve(processedData)
        } catch (e: Exception) {
            promise.reject("ERROR_PROCESSING_IMAGE", e.message)
        }
    }

}