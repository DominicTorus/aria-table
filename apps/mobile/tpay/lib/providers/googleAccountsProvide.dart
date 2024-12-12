import 'package:flutter/services.dart';

class GoogleAccountProvider {
  static const platform = MethodChannel('com.example/account');

  Future<List<String>> getGoogleAccounts() async {
    try {
      final List<dynamic> accounts =
          await platform.invokeMethod('getGoogleAccounts');
      return accounts.cast<String>();
    } on PlatformException {
      print("Failed to get Google accounts:");
      return [];
    } catch (e) {
      print(e);
      return [];
    } catch (e) {
      print(e);
      return [];
    }
  }
}
