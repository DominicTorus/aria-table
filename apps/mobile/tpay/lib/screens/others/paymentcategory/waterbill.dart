import 'package:flutter/material.dart';

class Waterbill extends StatefulWidget {
  const Waterbill({super.key});

  @override
  State<Waterbill> createState() => _WaterbillState();
}

class _WaterbillState extends State<Waterbill> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Water Bill"),
      ),
      body: Text("Water Bill"),
    );
  }
}
