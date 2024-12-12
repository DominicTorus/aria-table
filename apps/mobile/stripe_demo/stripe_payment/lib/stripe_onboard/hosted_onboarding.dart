import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:stripe_payment/payment_webview.dart';

class HostedOnboarding extends StatefulWidget {
  const HostedOnboarding({super.key});

  @override
  State<HostedOnboarding> createState() => _HostedOnboardingState();
}

class _HostedOnboardingState extends State<HostedOnboarding> {
  String? _selectedValue;

  Future<void> _fetchAndLaunchUrl() async {
    try {
      final response = await http.post(
          Uri.parse('http://192.168.2.32:3000/create-onboarding-link'),
          body: jsonEncode({'business_type': _selectedValue.toString()}));
      print(response.body);
      if (response.statusCode == 201) {
        final onboardingUrl = jsonDecode(response.body)['url'];
        Navigator.pushReplacement(
          // ignore: use_build_context_synchronously
          context,
          MaterialPageRoute(
            builder: (context) => PaymentWebview(
              url: onboardingUrl.toString(),
            ),
          ),
        );
      } else {
        throw 'Failed to load URL';
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hosted Onboarding'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  DropdownButton<String>(
                    value: _selectedValue,
                    hint: const Text('Select a business type'),
                    items:
                        <String>['Individual', 'Company'].map((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      setState(() {
                        _selectedValue = newValue;
                      });
                    },
                  ),
                ],
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 40,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.teal,
                    foregroundColor: Colors.white,
                  ),
                  onPressed: () {
                    if (_selectedValue != null) {
                      _fetchAndLaunchUrl();
                    }
                  },
                  child: const Text('Continue'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
