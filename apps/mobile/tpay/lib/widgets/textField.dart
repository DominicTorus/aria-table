import 'package:flutter/material.dart';

class MoneyTextField extends StatefulWidget {
  final TextEditingController controller;
  const MoneyTextField({super.key, required this.controller});

  @override
  State<MoneyTextField> createState() => _MoneyTextFieldState();
}

class _MoneyTextFieldState extends State<MoneyTextField> {
  final TextEditingController controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    controller.text = '0';
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 150,
      child: TextField(
        controller: controller,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        cursorHeight: 10,
        cursorColor: Colors.transparent,
        decoration: const InputDecoration(
          prefix: Text(
            '₹',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          border: UnderlineInputBorder(borderSide: BorderSide.none),
        ),
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 50.0,
          fontWeight: FontWeight.bold,
        ),
        onTap: () {
          setState(() {
            controller.text = '';
          });
        },
        onChanged: (value) {
          if (controller.text == '') {
            setState(() {
              controller.text = '0';
            });
          }
        },
      ),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
