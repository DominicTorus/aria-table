import 'package:flutter/material.dart';

class Taxipay extends StatefulWidget {
  const Taxipay({super.key});

  @override
  State<Taxipay> createState() => _TaxipayState();
}

class _TaxipayState extends State<Taxipay> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Taxi Pay"),
      ),
      body: Text("Taxi Pay"),
    );
  }
}
