import 'package:flutter/material.dart';

class CustomeOnboarding extends StatefulWidget {
  const CustomeOnboarding({super.key});

  @override
  State<CustomeOnboarding> createState() => _CustomeOnboardingState();
}

class _CustomeOnboardingState extends State<CustomeOnboarding> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Custom onboard'),
      ),
      body: Center(),
    );
  }
}
