import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class Payment extends StatefulWidget {
  final String accountId;
  final String recipientName;
  final String accessToken;
  final String firstName;
  final String lastName;
  final String email;
  final String businessName;
  final String routingNumber;
  final String accountNumber;
  final String accountType;
  const Payment(
      {super.key,
      required this.accountId,
      required this.recipientName,
      required this.accessToken,
      required this.firstName,
      required this.lastName,
      required this.email,
      required this.businessName,
      required this.routingNumber,
      required this.accountNumber,
      required this.accountType});

  @override
  State<Payment> createState() => _PaymentState();
}

class _PaymentState extends State<Payment> {
  String linkToken = '';
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  String transferIntentId = '';
  String authId = '';
  final String accessTokenDwolla = '';

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

// SAVE IN SHARED PREFS
  Future<void> _savePreferences(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  // CREATE A VERIFIED CUSTOMER
  Future<void> _createCustomer() async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/dwolla/create-verfied-customer'),
        headers: {
          'Content-Type': 'application/vnd.dwolla.v1.hal+json',
        },
        body: jsonEncode({
          "firstName": widget.firstName,
          "lastName": widget.lastName,
          "email": widget.email,
          "type": "receive-only",
          "businessName":
              widget.businessName.isNotEmpty ? widget.businessName : "",
        }),
      );

      if (response.statusCode == 201) {
        print('D_CS_ID -> ${response.body}');
        await _savePreferences('d_customer_id', response.body.toString());
        await _unverfiedFundingSource();
      } else {
        print('Failed to create customer. Status code: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
    } catch (e) {
      print('Exception occurred: $e');
    }
  }

// CREATE A UNVERIFIED FUNDING SOURCES
  Future<void> _unverfiedFundingSource() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final response = await http.post(
        Uri.parse(
            'http://localhost:3000/api/dwolla/create-unverfied-funding-source'),
        headers: {
          'Content-Type': 'application/vnd.dwolla.v1.hal+json',
        },
        body: jsonEncode({
          "routingNumber": widget.routingNumber,
          "accountNumber": widget.accountNumber,
          "bankAccountType": widget.accountType,
          "name": '${widget.firstName} ${widget.lastName}',
          "customer_id": prefs.getString('d_customer_id')
        }),
      );

      if (response.statusCode == 201) {
        await _savePreferences('d_fs_id', response.body.toString());
        print('D_FS -> ${response.body}');
        await _createTransfer();
      } else {
        print(
            'Failed to add funding source. Status code: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
    } catch (e) {
      print('Exception occurred: $e');
    }
  }

  // CREATE A TRANSFER
  Future<void> _createTransfer() async {
    final prefs = await SharedPreferences.getInstance();
    final formattedAmount = _formatAmount(_amountController.text);
    try {
      if (prefs.getString('fs_id').toString().isNotEmpty &&
          prefs.getString('d_fs_id').toString().isNotEmpty) {
        final response = await http.post(
          Uri.parse('http://localhost:3000/api/dwolla/create-transfer'),
          headers: {
            'Content-Type': 'application/vnd.dwolla.v1.hal+json',
          },
          body: jsonEncode({
            "source":
                'https://api-sandbox.dwolla.com/funding-sources/e89d0b49-389b-4eeb-9be1-b8e1f97e6d82',
            "destination":
                "https://api-sandbox.dwolla.com/funding-sources/c37b6926-ef29-4fe3-8db9-281642342915",
            "currency": "USD",
            "value": formattedAmount.toString()
          }),
        );

        if (response.statusCode == 201) {
          _showSuccessDialog();
          print('transferred successfully');
          print(response.headers);
          print('Response body: ${response.body}');
        } else {
          _showFailureDialog('Transfer Failed');
          print('Response body: ${response.body}');
          print(response.headers);
          print('Transfer not initiated');
        }
      } else {
        _showFailureDialog('Transfer Failed');
        print('Failed transfer');
      }
    } catch (e) {
      _showFailureDialog('Transfer Failed');
      print('Exception occurred at transfer: $e');
    }
  }

// FORMAT A AMOUNT
  String _formatAmount(String amount) {
    try {
      final double value = double.parse(amount);
      return value.toStringAsFixed(2);
    } catch (e) {
      print('Error formatting amount: $e');
      return amount;
    }
  }

  // SHOW SUCCESS DIALOG
  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Success'),
          content: const Text('Transfer completed successfully.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  // SHOW FAILURE DIALOG
  void _showFailureDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Transfer Failure'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Enter amount TextField
            TextField(
              controller: _amountController,
              decoration: const InputDecoration(
                labelText: 'Enter amount',
                border: OutlineInputBorder(),
              ),
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Enter a description',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.name,
              textAlign: TextAlign.center,
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                if (_descriptionController.text.isNotEmpty &&
                    _amountController.text.isNotEmpty) {
                  // _createCustomer();
                  _unverfiedFundingSource();
                }
              },
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: Colors.blue,
                padding:
                    const EdgeInsets.symmetric(vertical: 15, horizontal: 25),
              ),
              child: const Text('Transfer'),
            ),
          ],
        ),
      ),
    );
  }
}
