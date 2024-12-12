import 'package:flutter/material.dart';
import 'package:stripe_payment/scannerpay/scanner.dart';

class Scanbtn extends StatelessWidget {
  const Scanbtn({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Scan Payment')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const MyScanner()),
            );
          },
          child: Text('Scan Payment'),
        ),
      ),
    );
  }
}
