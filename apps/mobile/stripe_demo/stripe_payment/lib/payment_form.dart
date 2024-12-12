import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:http/http.dart' as http;
import 'package:stripe_payment/payment_options.dart';
import 'dart:convert';

import 'package:url_launcher/url_launcher.dart';

class PaymentForm extends StatefulWidget {
  const PaymentForm({super.key});

  @override
  State<PaymentForm> createState() => _PaymentFormState();
}

class _PaymentFormState extends State<PaymentForm> {
  final _accountNumberController = TextEditingController();
  final _routingNumberController = TextEditingController();
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _nameController = TextEditingController();
  bool _enablePayment = false;

  @override
  void initState() {
    super.initState();
    _accountNumberController.addListener(_updateButtonState);
    _routingNumberController.addListener(_updateButtonState);
    _nameController.addListener(_updateButtonState);
    _amountController.addListener(_updateButtonState);
    _descriptionController.addListener(_updateButtonState);
  }

  void _updateButtonState() {
    final amount = _amountController.text;
    final description = _descriptionController.text;

    setState(() {
      _enablePayment = _accountNumberController.text.isNotEmpty &&
          _routingNumberController.text.isNotEmpty &&
          _nameController.text.isNotEmpty &&
          amount.isNotEmpty &&
          description.isNotEmpty;
    });
  }

  Future<void> _handleSubmit() async {
    Stripe.publishableKey =
        "pk_test_51Ps0JiP2TaXjU5558xzmnfIvC0NZ71bCoBD92oM7Kju1TQAxVOB4hGQpzw3WZ09XqpOSxiihybQdheaHMiifHcrd00UBC26Dgi";
    final accountNumber = _accountNumberController.text;
    final routingNumber = _routingNumberController.text;
    final amount = int.parse(_amountController.text) * 100;

    try {
      // Create PaymentMethod
      final paymentMethodResponse = await http.post(
        Uri.parse('http://192.168.2.32:3000/create-payment-method'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'accountNumber': accountNumber,
          'routingNumber': routingNumber,
          'name': _nameController.text
        }),
      );

      final paymentMethod = jsonDecode(paymentMethodResponse.body);
      print("paymentMethod ID -> ${paymentMethod['id']}");

      //Create a Payment Intent
      final paymentIntentResponse = await http.post(
        Uri.parse('http://192.168.2.32:3000/create-payment-intent'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'amount': amount,
          'currency': 'usd',
          'paymentMethodId': paymentMethod['id'].toString(),
          'description': _descriptionController.text
        }),
      );

      final paymentIntent = jsonDecode(paymentIntentResponse.body);
      print('Payment Intent ID -> ${paymentIntent['client_secret']}');

      final result = await Stripe.instance.confirmPayment(
        paymentIntentClientSecret: paymentIntent['client_secret'],
        data: PaymentMethodParams.usBankAccount(
          paymentMethodData: PaymentMethodDataUsBank(
              accountNumber: accountNumber,
              routingNumber: routingNumber,
              billingDetails: BillingDetails(
                name: _nameController.text,
              )),
        ),
      );

      if (result.status == PaymentIntentsStatus.Succeeded) {
        print(result);
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Payment succeeded')),
        );
      } else if (result.status == PaymentIntentsStatus.RequiresAction) {
        final jsonResult = jsonEncode(result);
        final verifyUrl = jsonDecode(jsonResult);
        if (verifyUrl['nextAction']['redirectUrl'] != null &&
            verifyUrl['nextAction']['redirectUrl'] != '') {
          _showVerificationDialog(verifyUrl['nextAction']['redirectUrl']);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Action required to verify account')),
          );
        }
        print('URL -> ${jsonEncode(result)}');
        print('verify URL -> ${verifyUrl['nextAction']['redirectUrl']}');
      } else {
        print(result);
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Payment failed, try later...')),
        );
      }
    } catch (e) {
      print('Error : $e');
    }
  }

  void _showVerificationDialog(String url) {
    showDialog(
      context: context,
      barrierDismissible: false, // User must interact with the dialog
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Action Required'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                  'Please complete the action by visiting the following link:'),
              const SizedBox(height: 10),
              SelectableText(url),
            ],
          ),
          actions: [
            TextButton(
              child: const Text('Open Link'),
              onPressed: () async {
                // ignore: deprecated_member_use
                if (await canLaunch(url)) {
                  // ignore: deprecated_member_use
                  await launch(url);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Could not launch URL')),
                  );
                }
              },
            ),
            TextButton(
              child: const Text('Close'),
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const PaymentOptions()));
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bank transfer'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            // Align(
            //   alignment: Alignment.topLeft,
            //   child: const Text(
            //     'Enter Credentials',
            //     style: TextStyle(fontSize: 18),
            //   ),
            // ),
            TextField(
              controller: _accountNumberController,
              decoration: const InputDecoration(labelText: 'Account Number'),
            ),
            TextField(
              controller: _routingNumberController,
              decoration: const InputDecoration(labelText: 'Routing Number'),
            ),
            TextField(
              controller: _nameController,
              keyboardType: TextInputType.name,
              decoration: const InputDecoration(labelText: 'Legal Name'),
            ),
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
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal,
                foregroundColor: Colors.white,
              ),
              onPressed: _enablePayment ? _handleSubmit : null,
              child: const Text('Proceed to Pay'),
            ),
          ],
        ),
      ),
    );
  }
}
