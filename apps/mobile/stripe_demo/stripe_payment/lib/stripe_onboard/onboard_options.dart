import 'package:flutter/material.dart';
import 'package:stripe_payment/stripe_onboard/hosted_onboarding.dart';
import 'package:stripe_payment/stripe_onboard/onboarding_form.dart';

class OnboardOptions extends StatefulWidget {
  const OnboardOptions({super.key});

  @override
  State<OnboardOptions> createState() => _OnboardOptionsState();
}

class _OnboardOptionsState extends State<OnboardOptions> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal,
                foregroundColor: Colors.white,
              ),
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const OnboardingForm()));
              },
              child: const Text('Custom onboarding'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal,
                foregroundColor: Colors.white,
              ),
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const HostedOnboarding()));
              },
              child: const Text('Hosted onboarding'),
            ),
          ],
        ),
      ),
    );
  }
}
