import 'package:flutter/material.dart';

class TransactionHistory extends StatefulWidget {
  const TransactionHistory({super.key});

  @override
  State<TransactionHistory> createState() => _TransactionHistoryState();
}

class _TransactionHistoryState extends State<TransactionHistory> {
  String searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  // Dummy data for transactions
  final List<Map<String, dynamic>> transactions = [
    {
      'name': 'John Doe',
      'subtitle': 'debit',
      'amount': '₹200',
      'color': Colors.red,
      'avatar': 'assets/images/png/2f41fd.jpg',
    },
    {
      'name': 'Jane Smith',
      'subtitle': 'credit',
      'amount': '₹150',
      'color': Colors.green,
      'avatar': 'assets/images/png/close.jpg',
    },
    {
      'name': 'Michael Brown',
      'subtitle': 'debit',
      'amount': '₹300',
      'color': Colors.red,
      'avatar': 'assets/images/png/pexels.jpeg',
    },
  ];

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      setState(() {
        searchQuery = _searchController.text;
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _filteredTransactions() {
    return transactions.where((transaction) {
      final query = searchQuery.toLowerCase();
      return transaction['name']!.toLowerCase().contains(query) ||
          transaction['subtitle']!.toLowerCase().contains(query) ||
          transaction['amount']!.toLowerCase().contains(query);
    }).toList();
  }

  Widget _buildSearchField() {
    return Container(
      height: 40.0,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.0),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
          Expanded(
            child: TextField(
              controller: _searchController,
              decoration: const InputDecoration(
                border: InputBorder.none,
                hintText: 'Search...',
                hintStyle: TextStyle(color: Colors.grey),
                contentPadding: EdgeInsets.symmetric(horizontal: 10.0),
              ),
            ),
          ),
          PopupMenuButton<int>(
            icon: const Icon(Icons.more_vert_outlined, color: Colors.black),
            onSelected: (int value) {
              switch (value) {
                case 1:
                  // Handle "Get help" action
                  break;
                case 2:
                  // Handle "Send feedback" action
                  break;
              }
            },
            itemBuilder: (BuildContext context) {
              return [
                const PopupMenuItem(
                  value: 1,
                  child: Text("Get help"),
                ),
                const PopupMenuItem(
                  value: 2,
                  child: Text("Send feedback"),
                ),
              ];
            },
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionList() {
    final filteredTransactions = _filteredTransactions();
    return ListView.builder(
      itemCount: filteredTransactions.length,
      itemBuilder: (context, index) {
        final transaction = filteredTransactions[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundImage: AssetImage(transaction['avatar']!),
            onBackgroundImageError: (error, stackTrace) {},
          ),
          title: Text(transaction['name']!),
          subtitle: Text('${transaction['subtitle']}'),
          contentPadding: EdgeInsets.only(
              bottom: index == filteredTransactions.length - 1 ? 16.0 : 0),
          trailing: Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: Text(
              '${transaction['amount']}',
              style: TextStyle(color: transaction['color'], fontSize: 12.0),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: _buildSearchField(),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _buildTransactionList(),
      ),
    );
  }
}
