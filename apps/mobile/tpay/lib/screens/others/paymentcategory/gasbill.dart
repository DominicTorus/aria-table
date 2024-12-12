import 'package:flutter/material.dart';

class Gasbill extends StatefulWidget {
  const Gasbill({super.key});

  @override
  State<Gasbill> createState() => _GasbillState();
}

class _GasbillState extends State<Gasbill> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Gas Bill"),
      ),
      body: Text("Gas Bill"),
    );
  }
}
