import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CreateSubscription extends StatefulWidget {
  const CreateSubscription({super.key});

  @override
  State<CreateSubscription> createState() => _CreateSubscriptionState();
}

class _CreateSubscriptionState extends State<CreateSubscription> {
  String _responseMessage = '';
  double? _selectedAmount;

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> _createSubscription() async {
    try {
      final response = await http.post(
        Uri.parse('http://192.168.2.32:3000/create-subscription'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, dynamic>{
          'email': 'test@gmail.com',
          'productName': 'Monthly Plan',
          'amount': _selectedAmount! * 100,
        }),
      );
      if (response.statusCode == 201) {
        setState(() {
          _responseMessage = 'Subscription created successfully!';
        });
      } else {
        setState(() {
          _responseMessage = 'Failed to create subscription: ${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        _responseMessage = 'Something went wrong: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            Image.asset('assets/icons/torus.ico', width: 80, height: 80),
          ],
        ),
        foregroundColor: Colors.black,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Choose Your Subscription Plan',
                      style: Theme.of(context)
                          .textTheme
                          .bodyLarge
                          ?.copyWith(color: Colors.black),
                    ),
                    const SizedBox(height: 10),
                    _buildPlanCard('Monthly Plan', 5),
                    const SizedBox(height: 10),
                    _buildPlanCard('Yearly Plan', 20),
                    const SizedBox(height: 20),
                    if (_responseMessage.isNotEmpty) ...[
                      Text(
                        _responseMessage,
                        style: TextStyle(
                          color: _responseMessage.contains('successfully')
                              ? Colors.green
                              : Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ],
                ),
              ),
            ),
            Container(
              color: Color(0xFFE0E0E0),
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  SizedBox(
                    width: 120,
                    child: ElevatedButton(
                      style: ButtonStyle(
                        backgroundColor:
                            WidgetStateProperty.all<Color>(Colors.teal),
                        foregroundColor:
                            WidgetStateProperty.all<Color>(Colors.white),
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: Text('Continue'),
                    ),
                  ),
                  SizedBox(
                    width: 200,
                    child: ElevatedButton(
                      onPressed: _createSubscription,
                      child: Text(
                        'Subscribe for \$${_selectedAmount?.toStringAsFixed(2) ?? '0.00'}',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard(String title, double amount) {
    return Card(
      color: Colors.teal,
      elevation: 4,
      child: ListTile(
        contentPadding: EdgeInsets.all(16),
        title: Text(
          title,
          style: Theme.of(context)
              .textTheme
              .bodyLarge
              ?.copyWith(color: Colors.white),
        ),
        subtitle: Text(
          '\$$amount ${title.contains('Monthly') ? 'per month' : 'per year'}',
          style: TextStyle(color: Colors.white),
        ),
        leading: Radio<double>(
          value: amount,
          groupValue: _selectedAmount,
          onChanged: (value) {
            setState(() {
              _selectedAmount = value!;
            });
          },
        ),
        trailing: Icon(
          Icons.check_circle,
          color: _selectedAmount == amount ? Colors.white : Colors.grey,
        ),
      ),
    );
  }
}
