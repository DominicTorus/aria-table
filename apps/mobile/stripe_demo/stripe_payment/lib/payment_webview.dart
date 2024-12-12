import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class PaymentWebview extends StatefulWidget {
  final String url;
  const PaymentWebview({super.key, required this.url});

  @override
  State<PaymentWebview> createState() => _PaymentWebviewState();
}

class _PaymentWebviewState extends State<PaymentWebview> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    print(widget.url);
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(NavigationDelegate(
        onUrlChange: (url) {
          // Navigator.of(context).pushReplacement(
          //   MaterialPageRoute(
          //     builder: (context) => const OnboardOptions(),
          //   ),
          // );
          print('ProcessDone');
        },
        // onPageStarted: (url) {
        //   print('startedT');
        //   print(url);
        // },
        // onPageFinished: (url) {
        //   if (url.startsWith('http://localhost:3000/')) {
        //     print('successT');
        //     print(url);
        //   } else {
        //     // Navigator.of(context).pushReplacement(
        //     //   MaterialPageRoute(
        //     //     builder: (context) => CardPayment(),
        //     //   ),
        //     // );
        //     print('failT');
        //     print(url);
        //   }
        // },
        // onProgress: (progress) {
        //   print('progressT');
        //   print(progress);
        // },
      ))
      ..loadRequest(
        Uri.parse(widget.url),
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(
        controller: controller,
      ),
    );
  }
}
