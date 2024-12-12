import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:frontend/transactions.dart';
import 'package:frontend/balance_check.dart';
import 'package:frontend/transferui.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AccountInfo extends StatefulWidget {
  final String accessToken;
  final List<Map<String, String>> accounts;
  final Map<String, String> institution;

  const AccountInfo({
    super.key,
    required this.accounts,
    required this.institution,
    required this.accessToken,
  });

  @override
  State<AccountInfo> createState() => _AccountInfoState();
}

class _AccountInfoState extends State<AccountInfo> {
  String _firstName = '';
  String _lastName = '';
  String _primaryEmail = '';
  String _accountID = '';

  @override
  void initState() {
    super.initState();
    _identityGet();
  }

// SAVE IN SHARED PREFS
  Future<void> _savePreferences(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

// GET LINKED ACCOUNT IDENTITIES
  void _identityGet() async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/identity/get'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.accessToken}',
        },
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // Extract owner's information
        final owner = data['accounts'][0]['owners'][0];

        // Extract names
        final names = owner['names'] as List;
        final fullName = names.isNotEmpty ? names[0] : '';
        final nameParts = fullName.split(' ');
        final emails = owner['emails'] as List;
        setState(() {
          // Get first and last names
          _firstName = nameParts.isNotEmpty ? nameParts[0] : '';
          _lastName =
              nameParts.length > 1 ? nameParts.sublist(1).join(' ') : '';
          _primaryEmail = emails.firstWhere(
            (email) => email['primary'] == true,
            orElse: () => {'data': ''},
          )['data'];
        });
        //await _createUnverifiedCustomer();
        await _getProcessorToken();
      } else {
        print('Failed to get identity');
      }
    } catch (e) {
      print('Error at get idenity -> $e');
    }
  }

// CREATE A UNVERIFIED CUSTOMER
  Future<void> _createUnverifiedCustomer() async {
    try {
      final response = await http.post(
        Uri.parse(
            'http://localhost:3000/api/dwolla/create-unverified-customers'),
        headers: {
          'Content-Type': 'application/vnd.dwolla.v1.hal+json',
        },
        body: jsonEncode({
          "firstName": _firstName,
          "lastName": _lastName,
          "email": _primaryEmail
        }),
      );
      if (response.statusCode == 201) {
        await _savePreferences(
            'customer_id', response.headers['location'].toString());
        print('CS_ID => ${response.headers['location']}');
        await _getProcessorToken();
      } else {
        print('Failed to create verified customer');
      }
    } catch (e) {
      print('Error at create verfied customer -> $e');
    }
  }

// GET PROCESSOR TOKEN
  Future<void> _getProcessorToken() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/dwolla/get-processor-token'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.accessToken}',
        },
        body: jsonEncode({
          "account_id": _accountID,
          "processor": "dwolla",
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final processorToken = data['processor_token'];
        await _savePreferences('processor_token', processorToken);
        // await _createVerifiedFundingSource();
        prefs.setString('fs_id',
            'https://api-sandbox.dwolla.com/funding-sources/e89d0b49-389b-4eeb-9be1-b8e1f97e6d82');
        print(processorToken);
      } else {
        print(
            'Failed to create processor token. Status code: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
    } catch (e) {
      print('Exception occurred at create processor token -> : $e');
    }
  }

// CREATE A VERIFIED FUNDING SOURCE
  Future<void> _createVerifiedFundingSource() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/dwolla/verified-funding-source'),
        headers: {
          'Content-Type': 'application/vnd.dwolla.v1.hal+json',
          'Authorization': 'Bearer ${prefs.getString('processor_token')}',
        },
        body: jsonEncode({
          "name": _firstName + ' ' + _lastName,
        }),
      );

      if (response.statusCode == 201) {
        await _savePreferences('fs_id', response.body.toString());
        print(response.body);
      } else {
        print(
            'Failed to add funding source. Status code: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
    } catch (e) {
      print('Exception occurred at create funding Source -> : $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bank Accounts'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
                decoration: BoxDecoration(
                  color: Colors.blue,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/icons/torus.ico',
                      width: 150,
                      height: 100,
                    ),
                    SizedBox(height: 10),
                  ],
                )),
            ListTile(
              leading: Icon(Icons.cloud_circle_sharp),
              title: Text('Transfer'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TransferUI(
                      accessToken: widget.accessToken,
                      institutionId: widget.institution['id'] ?? '',
                      accountId: _accountID,
                    ),
                  ),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.account_balance),
              title: Text('Check Balance'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => BalanceCheck(
                      accessToken: widget.accessToken,
                    ),
                  ),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.list),
              title: Text('Transactions'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Transactions()),
                );
              },
            ),
          ],
        ),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              widget.institution['name'] ?? 'N/A',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: widget.accounts.length,
              itemBuilder: (context, index) {
                final account = widget.accounts[index];
                _accountID = account['id'] ?? '';
                print(account['id']);
                return Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Card(
                    elevation: 4,
                    child: ListTile(
                      leading: Icon(
                        Icons.account_balance_sharp,
                        size: 45,
                      ),
                      title: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('${account['name']}'),
                          Text('${account['mask']}')
                        ],
                      ),
                      subtitle: Text(account['type'] ?? 'NA'),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Text(
                'This is a sandbox mode',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[400],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
