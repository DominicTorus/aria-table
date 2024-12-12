import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TransferList extends StatefulWidget {
  final String accessToken;
  const TransferList({super.key, required this.accessToken});

  @override
  State<TransferList> createState() => _TransferListState();
}

class _TransferListState extends State<TransferList> {
  List<dynamic> _transfers = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    getTransaction();
  }

  void getTransaction() async {
    print(widget.accessToken);
    await _getTransactionList(widget.accessToken);
  }

  Future<void> _getTransactionList(String accessToken) async {
    final now = DateTime.now().toUtc();
    final endDate = DateFormat("yyyy-MM-ddTHH:mm:ss'Z'").format(now);
    const startDate = "2019-12-06T10:35:49Z";
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/transfer/transfer-list'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "start_date": startDate,
          "end_date": endDate,
          "count": 25,
          "offset": 0
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _transfers = data['transfers'];
          _isLoading = false;
        });
      } else {
        throw Exception(
            'Failed to get transactions. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error getting transactions: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  String _formatDate(String isoDateString) {
    final DateTime dateTime = DateTime.parse(isoDateString);
    final DateFormat formatter = DateFormat('dd MMM yyyy HH:mm:ss');
    return formatter.format(dateTime);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Transfers'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _transfers.isEmpty
              ? const Center(child: Text('No Data Found'))
              : ListView.builder(
                  itemCount: _transfers.length,
                  itemBuilder: (context, index) {
                    final transfer = _transfers[index];
                    return Card(
                      elevation: 5,
                      margin: const EdgeInsets.symmetric(
                          vertical: 8, horizontal: 16),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        title: Text(
                          transfer['description'] ?? 'No description',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${_formatDate(transfer['created'])}',
                              style: const TextStyle(color: Colors.grey),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${transfer['amount']} ${transfer['iso_currency_code']}',
                              style: const TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        trailing: Text(
                          transfer['status']?.toUpperCase() ?? 'UNKNOWN',
                          style: TextStyle(
                            color: transfer['status'] == 'settled'
                                ? Colors.green
                                : Colors.red,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
