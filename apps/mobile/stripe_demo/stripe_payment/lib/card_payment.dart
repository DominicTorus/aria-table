import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:http/http.dart' as http;

class CardPayment extends StatefulWidget {
  const CardPayment({super.key});

  @override
  State<CardPayment> createState() => _CardPaymentState();
}

class _CardPaymentState extends State<CardPayment> {
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  Map<String, dynamic>? paymentIntentData;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Card Payment'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextField(
                controller: _amountController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Amount'),
              ),
              TextField(
                controller: _descriptionController,
                keyboardType: TextInputType.name,
                decoration: const InputDecoration(labelText: 'Description'),
              ),
              const SizedBox(
                height: 50,
              ),
              ElevatedButton(
                style: const ButtonStyle(
                    backgroundColor: MaterialStatePropertyAll(Colors.teal),
                    foregroundColor: MaterialStatePropertyAll(Colors.white)),
                onPressed: () {
                  if (_amountController.text.isNotEmpty &&
                      _descriptionController.text.isNotEmpty) {
                    payment();
                  }
                },
                child: const Text('Proceed to Pay'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> payment() async {
    try {
      Map<String, dynamic> body = {
        'amount': "500",
        'currency': 'usd',
      };

      var response = await http.post(
        Uri.parse('https://api.stripe.com/v1/payment_intents'),
        headers: {
          'Authorization':
              'Bearer sk_test_51Ps0JiP2TaXjU555MmyEWnSKYbcrpGjb3a5YT0Q70Q3CF2EQdMvb8yNF3qSqcb18OctmX4oUfDjIcvLYk7Mbwr6B00NO7exf03',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body,
      );

      if (response.statusCode == 200) {
        paymentIntentData = json.decode(response.body);

        await Stripe.instance.initPaymentSheet(
          paymentSheetParameters: SetupPaymentSheetParameters(
            paymentIntentClientSecret: paymentIntentData!['client_secret'],
            style: ThemeMode.light,
            merchantDisplayName: 'Test Pvt Ltd',
          ),
        );

        await Stripe.instance.presentPaymentSheet().then((value) {
          print('Payment successful');
        }).catchError((error) {
          print('Payment failed: $error');
        });
      } else {
        print('Failed to create PaymentIntent: ${response.body}');
      }
    } catch (e) {
      print('Exception caught: $e');
    }
  }
}
