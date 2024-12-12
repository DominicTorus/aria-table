import 'package:get/get.dart';
import 'package:tpay/controller/networkContoller.dart';

class DependencyInjection {
  static void init() {
    Get.put<NetworkController>(NetworkController(), permanent: true);
  }
}
