import 'package:flutter/material.dart';

class Bankvalue extends StatefulWidget {
  final List<String> banks;

  const Bankvalue({super.key, required this.banks});

  @override
  State<Bankvalue> createState() => _BankvalueState();
}

class _BankvalueState extends State<Bankvalue> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Bank Value"),
      ),
      body: ListView.builder(
        itemCount: widget.banks.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text('Account'),
            subtitle: Text(widget.banks[index]),
          );
        },
      ),
    );
  }
}
