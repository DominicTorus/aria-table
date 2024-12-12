import 'package:adyen_payment/payment_webview.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PayByLink extends StatelessWidget {
  const PayByLink({super.key});

  Future<void> _handlePayment(BuildContext context) async {
    // try {
    //   final response = await http.post(
    //     Uri.parse('http://192.168.2.85:3000/create-payment-link'),
    //     headers: <String, String>{
    //       'Content-Type': 'application/json',
    //     },
    //     body: jsonEncode({'amount': '100', 'refID': 'test_ref_1234567'}),
    //   );
    //   if (response.statusCode == 201) {
    //     final data = json.decode(response.body);
    //     final paymentUrl = data['url'];

    //     if (paymentUrl != null) {
    //       // ignore: use_build_context_synchronously

    //     } else {
    //       print('Payment URL not found');
    //     }
    //   } else {
    //     print('Failed to create payment link');
    //   }
    // } catch (e) {
    //   print('Error occured during payment: $e');
    // }
    Navigator.pushReplacement(
      // ignore: use_build_context_synchronously
      context,
      MaterialPageRoute(
        builder: (context) => const PaymentWebview(
          url: 'https://test.adyen.link/PL8C1250BCAF4CD02C1',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pay by Link'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Center(
          child: SizedBox(
            width: double.infinity,
            height: 40,
            child: ElevatedButton(
                style: const ButtonStyle(
                    backgroundColor: WidgetStatePropertyAll(Colors.blue),
                    foregroundColor: WidgetStatePropertyAll(Colors.white)),
                onPressed: () {
                  _handlePayment(context);
                },
                child: const Text('Pay through link')),
          ),
        ),
      ),
    );
  }
}
