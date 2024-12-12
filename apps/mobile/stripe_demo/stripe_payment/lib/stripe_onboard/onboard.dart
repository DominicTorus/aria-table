import 'package:flutter/material.dart';
import 'package:stripe_payment/stripe_onboard/onboard_options.dart';

class Onboard extends StatefulWidget {
  const Onboard({super.key});

  @override
  State<Onboard> createState() => _OnboardState();
}

class _OnboardState extends State<Onboard> {
  bool _isAcknowledged = false;

  void _toggleCheckbox(bool? value) {
    setState(() {
      _isAcknowledged = value ?? false;
    });
  }

  void _onboardSeller() async {
    Navigator.push(context,
        MaterialPageRoute(builder: (context) => const OnboardOptions()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(),
      body: Column(
        children: <Widget>[
          const Text(
            "Let's collaborate with us",
            style: TextStyle(fontSize: 24),
          ),
          Expanded(
            child: Center(
              child: Image.asset(
                'assets/images/onboard.jpg',
                width: 250,
                height: 400,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Row(
              children: [
                Checkbox(
                  value: _isAcknowledged,
                  onChanged: _toggleCheckbox,
                ),
                const Expanded(
                  child: Text(
                    'By accepting the terms and conditions of Torus Pay.',
                    style: TextStyle(fontSize: 10),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: SizedBox(
              width: double.infinity,
              height: 40,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.teal,
                  foregroundColor: Colors.white,
                ),
                onPressed: _isAcknowledged
                    ? () {
                        _onboardSeller();
                      }
                    : null,
                child: const Text('Continue'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
