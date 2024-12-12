import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class BalanceCheck extends StatefulWidget {
  const BalanceCheck({super.key, this.accountId, required this.accessToken});

  final String? accountId;
  final String accessToken;

  @override
  State<BalanceCheck> createState() => _BalanceCheckState();
}

class _BalanceCheckState extends State<BalanceCheck> {
  bool _isLoading = false;
  List<Map<String, dynamic>> _accounts = [];

  @override
  void initState() {
    super.initState();
    _getBalance(widget.accessToken);
    print(widget.accountId);
  }

  Future<void> _getBalance(String accessToken) async {
    setState(() {
      _isLoading = true;
    });
    print(accessToken);
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/auth'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken'
        },
      );
      print(response.statusCode);
      print(response.body);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final accounts = data['accounts'] as List<dynamic>;
        setState(() {
          _accounts = accounts.cast<Map<String, dynamic>>();
        });
      } else {
        throw Exception(
            'Failed to get balance. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error getting balance: $e');
      setState(() {
        _accounts = [];
      });
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Balance Check'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: _isLoading
            ? const CircularProgressIndicator()
            : _accounts.isEmpty
                ? const Text(
                    '',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  )
                : ListView.builder(
                    itemCount: _accounts.length,
                    itemBuilder: (context, index) {
                      final account = _accounts[index];
                      final balance = account['balances']['available'] ?? 0;
                      final name = account['name'] ?? 'Unknown Account';
                      return ListTile(
                        title: Text(name),
                        subtitle:
                            Text('Balance: \$${balance.toStringAsFixed(2)}'),
                      );
                    },
                  ),
      ),
    );
  }
}
