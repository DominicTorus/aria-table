import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class Transactions extends StatefulWidget {
  const Transactions({super.key});

  @override
  State<Transactions> createState() => _TransactionsState();
}

class _TransactionsState extends State<Transactions> {
  List<dynamic> _transactions = [];
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchTransactions();
  }

  Future<void> _fetchTransactions() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final publicToken = await _createPublicToken();
      if (publicToken != null) {
        final accessToken = await _exchangePublicToken(publicToken);
        if (accessToken != null) {
          await _getTransactions(accessToken);
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Error fetching transactions: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _syncTransactions() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final publicToken = await _createPublicToken();
      if (publicToken != null) {
        final accessToken = await _exchangePublicToken(publicToken);
        if (accessToken != null) {
          await _syncWithPlaid(accessToken);
          await _getTransactions(accessToken);
        }
      }
    } catch (e) {
      setState(() {
        _error = 'Error syncing transactions: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<String?> _createPublicToken() async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/create-public-token'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "institution_id": "ins_20",
          "initial_products": ["transactions"],
          "options": {"webhook": "https://www.genericwebhookurl.com/webhook"}
        }),
      );

      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        return responseBody['public_token'];
      } else {
        print('Error creating public token: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error creating public token: $e');
      return null;
    }
  }

  Future<String?> _exchangePublicToken(String publicToken) async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/exchange-public-token'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $publicToken'
        },
      );

      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        return responseBody['access_token'];
      } else {
        print('Error exchanging public token: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error exchanging public token: $e');
      return null;
    }
  }

  Future<void> _getTransactions(String accessToken) async {
    final now = DateTime.now().toUtc();
    final endDate = DateFormat("yyyy-MM-dd").format(now);
    const startDate = "2019-12-06";
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/transaction/api/transactions'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "access_token": accessToken,
          "start_date": startDate,
          "end_date": endDate,
          "options": {"count": 50, "offset": 0}
        }),
      );

      if (response.statusCode == 200) {
        final responseBody = jsonDecode(response.body);
        setState(() {
          _transactions = responseBody['transactions'] ?? [];
        });
      } else {
        print('Error fetching transactions: ${response.body}');
      }
    } catch (e) {
      print('Error fetching transactions: $e');
    }
  }

  Future<void> _syncWithPlaid(String accessToken) async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/transaction/api/sync/transactions'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"access_token": accessToken, "count": 5}),
      );
      print(response.body);
      print(response.statusCode);

      if (response.statusCode != 200) {
        print('Error syncing transactions: ${response.body}');
      }
    } catch (e) {
      print('Error syncing transactions: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Transactions'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            tooltip: 'Sync transactions',
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            icon: const Icon(Icons.sync),
            onPressed: _syncTransactions,
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_isLoading) ...[
              Center(child: CircularProgressIndicator()),
            ] else if (_error != null) ...[
              Center(child: Text(_error!, style: TextStyle(color: Colors.red))),
            ] else ...[
              Expanded(
                child: _transactions.isEmpty
                    ? Center(child: Text('No transactions available'))
                    : ListView.builder(
                        itemCount: _transactions.length,
                        itemBuilder: (context, index) {
                          final transaction = _transactions[index];
                          final categoryList =
                              transaction['category'] as List<dynamic>?;

                          // Ensure categoryList is not null and has at least one item
                          final categories =
                              categoryList != null && categoryList.isNotEmpty
                                  ? categoryList
                                      .map((category) => category.toString())
                                      .toList()
                                  : ['Unknown'];

                          final amount = transaction['amount'] ?? 0.0;
                          final date = transaction['date'] ?? 'No date';

                          return Card(
                            elevation: 4,
                            margin: const EdgeInsets.symmetric(vertical: 15.0),
                            child: ListTile(
                              title: Text(
                                transaction['name'] ?? 'Unknown',
                                style: TextStyle(
                                    fontSize: 13, fontWeight: FontWeight.bold),
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(height: 10),
                                  Text(
                                    date,
                                    style: TextStyle(color: Colors.grey[600]),
                                  ),
                                  SizedBox(height: 15),
                                  SingleChildScrollView(
                                    scrollDirection: Axis.horizontal,
                                    child: Wrap(
                                      spacing:
                                          8.0, // Horizontal space between chips
                                      runSpacing:
                                          4.0, // Vertical space between lines of chips
                                      children: categories
                                          .map((category) => Container(
                                                padding: EdgeInsets.all(
                                                    4.0), // Padding to give some space around the chip content
                                                decoration: BoxDecoration(
                                                  color: const Color.fromARGB(
                                                      255, 186, 224, 255),
                                                  borderRadius:
                                                      BorderRadius.horizontal(
                                                    left: Radius.circular(
                                                        16.0), // Radius for left corners
                                                    right: Radius.circular(
                                                        16.0), // Radius for right corners
                                                  ),
                                                ),
                                                child: Center(
                                                  child: Padding(
                                                    padding: const EdgeInsets
                                                        .symmetric(
                                                        horizontal: 8),
                                                    child: Text(
                                                      category,
                                                      style: TextStyle(
                                                          color: const Color
                                                              .fromARGB(
                                                              255, 0, 0, 0)),
                                                    ),
                                                  ),
                                                ),
                                              ))
                                          .toList(),
                                    ),
                                  ),
                                ],
                              ),
                              trailing: Text(
                                '\$${amount.toStringAsFixed(2)}',
                                style: TextStyle(
                                    fontSize: 15,
                                    color: Colors.green,
                                    fontWeight: FontWeight.bold),
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ]
          ],
        ),
      ),
    );
  }
}
