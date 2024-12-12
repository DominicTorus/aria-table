import 'package:flutter/material.dart';

class Subcription extends StatefulWidget {
  const Subcription({super.key});

  @override
  State<Subcription> createState() => _SubcriptionState();
}

class _SubcriptionState extends State<Subcription> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscription'),
      ),
      body: const Center(
        child: Text('Subscription'),
      ),
    );
  }
}
