import 'package:flutter/material.dart';
import 'package:stripe_payment/card_payment.dart';
import 'package:stripe_payment/payment_form.dart';
import 'package:stripe_payment/scannerpay/scanner.dart';

class PaymentOptions extends StatefulWidget {
  const PaymentOptions({super.key});

  @override
  State<PaymentOptions> createState() => _PaymentOptionsState();
}

class _PaymentOptionsState extends State<PaymentOptions> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Payment Options'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          Image.asset(
            'assets/images/Payment-option.png',
            width: 200,
            height: 300.0,
            fit: BoxFit.cover,
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildPaymentTile(Icons.account_balance, 'Bank transfer', () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const PaymentForm()));
                }),
                const SizedBox(width: 16.0),
                _buildPaymentTile(Icons.qr_code, 'Scan and Pay', () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const MyScanner(),
                    ),
                  );
                }),
                const SizedBox(width: 16.0),
                _buildPaymentTile(Icons.credit_card, 'Debit / Credit Card', () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const CardPayment()));
                }),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildPaymentTile(
      IconData icon, String text, GestureTapCallback onTap) {
    return Container(
      width: 110.0,
      height: 110.0,
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: GestureDetector(
        onTap: onTap,
        child: Card(
          elevation: 8.0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8.0),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: <Widget>[
              Icon(
                icon,
                size: 40,
                color: Colors.teal,
              ),
              const SizedBox(height: 8.0),
              Text(
                text,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16.0),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
