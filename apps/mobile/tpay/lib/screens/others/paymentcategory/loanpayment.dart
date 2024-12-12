import 'package:flutter/material.dart';

class Loanpayment extends StatefulWidget {
  const Loanpayment({super.key});

  @override
  State<Loanpayment> createState() => _LoanpaymentState();
}

class _LoanpaymentState extends State<Loanpayment> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Loan Payment"),
      ),
      body: Text("Loan Payment"),
    );
  }
}
