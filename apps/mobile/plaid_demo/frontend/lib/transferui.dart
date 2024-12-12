import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:frontend/payment.dart';

class TransferUI extends StatefulWidget {
  final String accessToken;
  final String institutionId;
  final String accountId;

  const TransferUI({
    super.key,
    required this.accessToken,
    required this.institutionId,
    required this.accountId,
  });

  @override
  State<TransferUI> createState() => _TransferUIState();
}

class _TransferUIState extends State<TransferUI> {
  final TextEditingController _firstController = TextEditingController();
  final TextEditingController _lastController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _accountNumberController =
      TextEditingController();
  final TextEditingController _routingNumberController =
      TextEditingController();
  final TextEditingController _businessNameController = TextEditingController();

  final Map<String, String> _accountNumberToId = {};
  String? _selectedAccountNumber;
  final _formKey = GlobalKey<FormState>();
  String? _accountType;

  @override
  void initState() {
    super.initState();
    getCapabilities();
  }

// GET ACCOUNT CAPABILITIES
  void getCapabilities() async {
    try {
      final response = await http.post(
          Uri.parse('http://localhost:3000/api/get-capabilities'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            "access_token": widget.accessToken,
            "account_id": widget.accountId
          }));
      if (response.statusCode == 200) {
        print(jsonDecode(response.body)['institution_supported_networks']['rtp']
            ['credit']);
      } else {
        print('Failed to get account capability');
      }
    } catch (e) {
      print('Error $e');
    }
  }

  void _navigateToNextScreen() {
    final accountId = _accountNumberToId[_selectedAccountNumber];
    final recipientName = '${_firstController.text} ${_lastController.text}';

    if (_firstController.text.isNotEmpty &&
        _lastController.text.isNotEmpty &&
        _emailController.text.isNotEmpty &&
        _accountNumberController.text.isNotEmpty &&
        _routingNumberController.text.isNotEmpty &&
        _accountType!.isNotEmpty &&
        _businessNameController.text.isNotEmpty) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => Payment(
            accountId: accountId ?? '',
            recipientName: recipientName,
            accessToken: widget.accessToken,
            firstName: _firstController.text,
            lastName: _lastController.text,
            email: _emailController.text,
            businessName: _businessNameController.text,
            routingNumber: _routingNumberController.text,
            accountNumber: _accountNumberController.text,
            accountType: _accountType ?? '',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Transfer'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                margin: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'First Name',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _firstController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Enter first name',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a first name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Last Name',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _lastController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Enter last name',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a last name';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Email',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Enter email',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter an email address';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Bank Account Number',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _accountNumberController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Enter account number',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter an account number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Routing Number',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _routingNumberController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Enter routing number',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter a routing number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Account Type',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    SizedBox(height: 10),
                    DropdownButtonFormField<String>(
                      value: _accountType,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Select account type',
                      ),
                      items: ['Saving', 'Checking']
                          .map((type) => DropdownMenuItem<String>(
                                value: type,
                                child: Text(type),
                              ))
                          .toList(),
                      onChanged: (value) {
                        setState(() {
                          _accountType = value;
                        });
                      },
                      validator: (value) {
                        if (value == null) {
                          return 'Please select an account type';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Business Name',
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    SizedBox(height: 10),
                    TextFormField(
                      controller: _businessNameController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Enter business name',
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ButtonStyle(
                    backgroundColor: MaterialStateProperty.all(Colors.blue),
                    foregroundColor: MaterialStateProperty.all(Colors.white),
                  ),
                  onPressed: () {
                    if (_formKey.currentState?.validate() ?? false) {
                      _navigateToNextScreen();
                    }
                  },
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        const Text('Proceed'),
                      ],
                    ),
                  ),
                ),
              ),
              SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
