import 'package:flutter/material.dart';

class Paymentstatus extends StatefulWidget {
  final bool paymentStatus;
  const Paymentstatus({super.key, required this.paymentStatus});

  @override
  State<Paymentstatus> createState() => _PaymentstatusState();
}

class _PaymentstatusState extends State<Paymentstatus> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text('Failed'),
      ),
    );
  }
}
