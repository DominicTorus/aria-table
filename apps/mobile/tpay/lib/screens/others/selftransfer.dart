import 'package:flutter/material.dart';

class Selftransfer extends StatefulWidget {
  const Selftransfer({super.key});

  @override
  State<Selftransfer> createState() => _SelftransferState();
}

class _SelftransferState extends State<Selftransfer> {
  final _formKey = GlobalKey<FormState>();
  String? _fromAccount;
  String? _toAccount;
  double _amount = 0;
  String? _selectedBank;

  final List<Map<String, String>> _banks = [
    {
      'imagePath': 'assets/images/png/CANBK.NS.png',
      'bankName': 'Canara bank',
    },
    {
      'imagePath': 'assets/images/png/SBI-logo.png',
      'bankName': 'SBI bank',
    },
    {
      'imagePath': 'assets/images/png/HDFCBANK.png',
      'bankName': 'HDFC bank',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Self Transfer'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(
                  labelText: 'From Account',
                  border: OutlineInputBorder(),
                ),
                items: _banks.map((Map<String, String> bank) {
                  return DropdownMenuItem<String>(
                    value: bank['bankName'],
                    child: Row(
                      children: [
                        Image.asset(
                          bank['imagePath']!,
                          width: 20,
                          height: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(bank['bankName']!),
                      ],
                    ),
                  );
                }).toList(),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select from account';
                  }
                  return null;
                },
                onChanged: (value) => setState(() => _fromAccount = value),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(
                  labelText: 'To Account',
                  border: OutlineInputBorder(),
                ),
                items: _banks.map((Map<String, String> bank) {
                  return DropdownMenuItem<String>(
                    value: bank['bankName'],
                    child: Row(
                      children: [
                        Image.asset(
                          bank['imagePath']!,
                          width: 20,
                          height: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(bank['bankName']!),
                      ],
                    ),
                  );
                }).toList(),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select to account';
                  }
                  return null;
                },
                onChanged: (value) => setState(() => _toAccount = value),
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Amount',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter amount';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Please enter a valid amount';
                  }
                  return null;
                },
                onSaved: (value) => _amount = double.parse(value!),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    _formKey.currentState!.save();
                    // TODO: Add transfer logic here
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Transfer successful')),
                    );
                  }
                },
                child: const Text('Transfer'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
