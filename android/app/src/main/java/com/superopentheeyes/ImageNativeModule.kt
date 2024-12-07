package com.superopentheeyes // 경로가 MainApplication과 동일해야 함

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ImageNativeModule private constructor() {
    companion object {
        @Volatile
        private var instance: ImageNativeModule? = null

        fun getInstance(): ImageNativeModule {
            return instance ?: synchronized(this) {
                instance ?: ImageNativeModule().also { instance = it }
            }
        }
    }

    // 이미지 처리 관련 메서드 추가
    fun processImage(data: ByteArray): String {
        // 이미지 처리 로직 작성
        return "Processed Image Successfully"
    }
}
