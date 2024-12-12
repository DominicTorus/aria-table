package com.example.tpay
 
import android.accounts.Account
import android.accounts.AccountManager
import android.os.Bundle
import io.flutter.embedding.android.FlutterFragmentActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
 
class MainActivity: FlutterFragmentActivity() {
    private val CHANNEL = "com.example/account"
 
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
            .setMethodCallHandler { call, result ->
                if (call.method == "getGoogleAccounts") {
                    result.success(getGoogleAccounts())
                } else {
                    result.notImplemented()
                }
            }
    }
 
    private fun getGoogleAccounts(): List<String> {
        val accountManager = AccountManager.get(this)
        val accounts = accountManager.getAccountsByType("com.google")
        return accounts.map { it.name }
    }
}