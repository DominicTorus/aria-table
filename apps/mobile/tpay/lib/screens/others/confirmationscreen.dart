import 'package:flutter/material.dart';

class Confirmationscreen extends StatefulWidget {
  const Confirmationscreen({super.key});

  @override
  _ConfirmationscreenState createState() => _ConfirmationscreenState();
}

class _ConfirmationscreenState extends State<Confirmationscreen> {
  double amount = 0;

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          const Text(
            "Confirmations",
            style: TextStyle(color: Colors.white, fontSize: 40),
          ),
          SizedBox(height: 20),
          const Icon(
            Icons.person,
            color: Colors.white,
            size: 30,
          ),
          SizedBox(height: 20),
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: TextField(
                textAlign: TextAlign.center,
                keyboardType: TextInputType.number,
                style: TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: "\₹ ${amount.toStringAsFixed(2)}",
                  hintStyle: TextStyle(color: Colors.white),
                  border: InputBorder.none,
                ),
                controller: TextEditingController(
                    text: "\₹ ${amount.toStringAsFixed(2)}"),
              ),
            ),
          ),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              _buildElevatedButton("+100", 100.0),
              _buildElevatedButton("+500", 500.0),
              _buildElevatedButton("+1000", 1000.0),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildElevatedButton(String label, double incrementAmount) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
        shape: const BeveledRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(7.0)),
        ),
      ),
      onPressed: () {
        updateAmount(amount + incrementAmount);
      },
      child: Text(label),
    );
  }

  void updateAmount(double newAmount) {
    setState(() {
      amount = newAmount;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.blue.shade800,
              Colors.blue.shade500,
              Colors.blue.shade100,
            ],
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            _buildHeader(context),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Container(
                width: 200,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10.0),
                ),
                // Add any additional widgets here as needed.
              ),
            ),
          ],
        ),
      ),
    );
  }
}
