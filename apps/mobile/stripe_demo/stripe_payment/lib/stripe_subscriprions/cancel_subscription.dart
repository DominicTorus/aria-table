import 'package:flutter/material.dart';

class CancelSubscription extends StatefulWidget {
  const CancelSubscription({super.key});

  @override
  State<CancelSubscription> createState() => _CancelSubscriptionState();
}

class _CancelSubscriptionState extends State<CancelSubscription> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cancel subscription'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Center(),
    );
  }
}
