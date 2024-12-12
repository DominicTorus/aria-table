import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:stripe_payment/payment_options.dart';

class PaymentPage extends StatefulWidget {
  final String accId;

  const PaymentPage({super.key, required this.accId});

  @override
  State<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final String username =
      'sk_test_51Ps0JiP2TaXjU555MmyEWnSKYbcrpGjb3a5YT0Q70Q3CF2EQdMvb8yNF3qSqcb18OctmX4oUfDjIcvLYk7Mbwr6B00NO7exf03';
  final String password = "WELcome@\$&12#";
  bool _isPayButtonEnabled = false;

  @override
  void initState() {
    super.initState();
    _amountController.addListener(_updateButtonState);
    _descriptionController.addListener(_updateButtonState);
  }

  void _updateButtonState() {
    final amount = _amountController.text;
    final description = _descriptionController.text;

    setState(() {
      _isPayButtonEnabled = amount.isNotEmpty && description.isNotEmpty;
    });
  }

  Future<void> _makePayment() async {
    final amount = _amountController.text;
    final description = _descriptionController.text;
    final String basicAuth =
        'Basic ' + base64Encode(utf8.encode('$username:$password'));
    print(widget.accId);
    final response = await http
        .post(Uri.parse('https://api.stripe.com/v1/transfers'), headers: {
      'Authorization': basicAuth,
      'Content-Type': 'application/x-www-form-urlencoded',
    }, body: {
      'amount': '100',
      'destination': widget.accId,
      'currency': 'usd'
    });
    print(response.body);
    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Payment Successful')),
      );
      Navigator.push(context,
          MaterialPageRoute(builder: (context) => const PaymentOptions()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Payment Failed')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Text('UPI ID: ${widget.accId}',
            //     style:
            //         const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Amount',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'description',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isPayButtonEnabled ? _makePayment : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal,
                foregroundColor: Colors.white,
              ),
              child: const Text('Pay'),
            ),
          ],
        ),
      ),
    );
  }
}
