import 'package:flutter/services.dart';

class AccountService {
  static const platform = MethodChannel('com.example/account');

  Future<List<String>> getGoogleAccounts() async {
    try {
      final List<dynamic> accounts =
          await platform.invokeMethod('getGoogleAccounts');
      return accounts.cast<String>();
    } on PlatformException catch (e) {
      print("Failed to get Google accounts: '${e.message}'.");
      return [];
    }
  }
}
