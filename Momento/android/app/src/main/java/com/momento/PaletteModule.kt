package com.momento

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.palette.graphics.Palette
import com.facebook.react.bridge.*

class PaletteModule(private val appContext: ReactApplicationContext) : ReactContextBaseJavaModule(appContext) {

    override fun getName(): String = "PaletteModule"

    @ReactMethod
    fun getDominantColor(uriString: String, promise: Promise) {
        try {
            val bitmap = decodeBitmap(uriString)
            if (bitmap == null) {
                promise.resolve(DEFAULT_COLOR)
                return
            }

            val palette = Palette.from(bitmap)
                .maximumColorCount(8)
                .resizeBitmapArea(128)
                .generate()

            val swatch = palette.dominantSwatch
                ?: palette.vibrantSwatch
                ?: palette.darkVibrantSwatch
                ?: palette.mutedSwatch
                ?: palette.darkMutedSwatch
                ?: palette.lightVibrantSwatch
                ?: palette.lightMutedSwatch

            val color = swatch?.let {
                String.format("#%06X", 0xFFFFFF and it.rgb)
            } ?: DEFAULT_COLOR

            bitmap.recycle()
            promise.resolve(color)
        } catch (e: Exception) {
            promise.resolve(DEFAULT_COLOR)
        }
    }

    @ReactMethod
    fun getFilesDir(promise: Promise) {
        promise.resolve(appContext.filesDir.absolutePath)
    }

    @ReactMethod
    fun getCacheDir(promise: Promise) {
        promise.resolve(appContext.cacheDir.absolutePath)
    }

    private fun decodeBitmap(uriString: String): Bitmap? {
        val uri = Uri.parse(uriString)

        return try {
            appContext.contentResolver.openInputStream(uri)?.use { input ->
                val options = BitmapFactory.Options().apply {
                    inSampleSize = 4
                }
                BitmapFactory.decodeStream(input, null, options)
            }
        } catch (_: Exception) {
            try {
                val path = uri.path ?: uriString.removePrefix("file://")
                val options = BitmapFactory.Options().apply {
                    inSampleSize = 4
                }
                BitmapFactory.decodeFile(path, options)
            } catch (_: Exception) {
                null
            }
        }
    }

    companion object {
        private const val DEFAULT_COLOR = "#6750A4"
    }
}
