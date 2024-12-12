import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class NetworkController extends GetxController {
  final Connectivity _connectivity = Connectivity();

  @override
  void onInit() {
    super.onInit();
    _connectivity.onConnectivityChanged.listen(_updateConnectionStatus);
  }

  void _updateConnectionStatus(List<ConnectivityResult> results) {
    try {
      var result = results.isNotEmpty ? results[0] : ConnectivityResult.none;

      if (result == ConnectivityResult.none) {
        Get.showSnackbar(const GetSnackBar(
          title: 'No Internet Connection',
          message: 'Please check your internet connection.',
          shouldIconPulse: true,
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          icon: Icon(Icons.wifi_off, color: Colors.white),
          borderRadius: 0,
          duration: Duration(days: 1),
          isDismissible: false,
        ));
      } else {
        if (Get.isSnackbarOpen) {
          Get.closeCurrentSnackbar();
        }
      }
    } catch (e) {
      throw Exception(e);
    }
  }
}
