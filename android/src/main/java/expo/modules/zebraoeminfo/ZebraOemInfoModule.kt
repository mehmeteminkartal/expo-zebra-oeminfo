package expo.modules.zebraoeminfo

import android.content.Context
import android.net.Uri
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ZebraOemInfoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ZebraOemInfo")
    AsyncFunction("getIdentityAsync") {
      val context = appContext.reactContext
        ?: throw IllegalStateException("React context is unavailable")
      mapOf(
        "serialNumber" to read(context, "build_serial"),
        "wifiMac" to read(context, "wifi_mac"),
        "bluetoothMac" to read(context, "bt_mac")
      )
    }
  }

  private fun result(status: String, value: String? = null): Map<String, String?> =
    mapOf("status" to status, "value" to value)

  private fun read(context: Context, field: String): Map<String, String?> {
    return try {
      if (context.packageManager.resolveContentProvider("oem_info", 0) == null) {
        return result("provider_unavailable")
      }
      context.contentResolver.query(
        Uri.parse("content://oem_info/oem.zebra.secure/$field"),
        null, null, null, null
      )?.use { cursor ->
        // OEMInfo can return no rows for denied access, so don't label this
        // definitively as a permission failure or an unsupported device.
        if (!cursor.moveToFirst()) return result("no_data")
        val column = cursor.getColumnIndex(field)
        if (column < 0) return result("unexpected_response")
        val raw = cursor.getString(column)?.trim()
        if (raw.isNullOrEmpty()) return result("no_data")
        if (raw.equals("unknown", ignoreCase = true)) return result("no_data")
        if (field.endsWith("_mac")) {
          val mac = raw.uppercase(java.util.Locale.ROOT)
          if (!Regex("^([0-9A-F]{2}:){5}[0-9A-F]{2}$").matches(mac) ||
            mac in setOf("02:00:00:00:00:00", "00:00:00:00:00:00", "FF:FF:FF:FF:FF:FF")) {
            return result("no_data")
          }
          return result("ok", mac)
        }
        result("ok", raw)
      } ?: result("no_data")
    } catch (_: SecurityException) {
      result("permission_denied")
    } catch (_: Exception) {
      result("query_failed")
    }
  }
}
