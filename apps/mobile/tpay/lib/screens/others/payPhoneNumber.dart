import 'package:flutter/material.dart';
import 'package:tpay/screens/others/payments/pay.dart';

class PayPhoneNumber extends StatefulWidget {
  const PayPhoneNumber({super.key});

  @override
  State<PayPhoneNumber> createState() => _PayPhoneNumberState();
}

class _PayPhoneNumberState extends State<PayPhoneNumber> {
  final TextEditingController controller = TextEditingController();
  bool validForm = false;
  void _updateFormState(String text) {
    setState(() {
      validForm = text.length == 10 ? true : false;
    });
  }

  void _clearTextField() {
    controller.clear();
    _updateFormState('');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Enter a phone number',
                        style: TextStyle(fontSize: 25),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const Text(
                            'Pay any',
                            style: TextStyle(fontSize: 15),
                          ),
                          const SizedBox(width: 5),
                          Image.asset(
                            'assets/images/png/upi_logo.png',
                            width: 50,
                          ),
                          const SizedBox(width: 5),
                          const Text(
                            'app using phone number',
                            style: TextStyle(fontSize: 15),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: controller,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Enter phone number',
                        border: const OutlineInputBorder(),
                        suffixIcon: controller.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear),
                                color: Colors.black,
                                onPressed: _clearTextField,
                              )
                            : null,
                      ),
                      autofocus: true,
                      onChanged: _updateFormState,
                    ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: ElevatedButton(
              onPressed: validForm
                  ? () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const PaymentScreen(),
                        ),
                      );
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                shadowColor: Colors.transparent,
                backgroundColor: validForm
                    ? Theme.of(context).primaryColor
                    : Colors.grey.shade200,
                foregroundColor: validForm
                    ? Theme.of(context).primaryColorLight
                    : Colors.grey.shade500,
                padding: EdgeInsets.zero,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Continue'),
            ),
          ),
        ],
      ),
    );
  }
}