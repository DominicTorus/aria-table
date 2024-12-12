import 'package:flutter/material.dart';
import 'package:tpay/screens/others/payments/bankvalue.dart';

class Managemoney extends StatefulWidget {
  const Managemoney({super.key});

  @override
  State<Managemoney> createState() => _ManagemoneyState();
}

List<String> banks = ['500', '1000', '2000'];

class _ManagemoneyState extends State<Managemoney> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Bank'), // Add 'const' here
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0), // Add 'const' here
        child: Column(
          children: [
            _buildBankRow(
              imagePath: 'assets/images/png/CANBK.NS.png',
              bankName: 'Canara bank',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        Bankvalue(banks: [banks[0]]), // Pass the correct type
                  ),
                );
              },
            ),
            const SizedBox(height: 16), // Add 'const' here
            _buildBankRow(
              imagePath: 'assets/images/png/SBI-logo.png',
              bankName: 'SBI bank',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        Bankvalue(banks: [banks[1]]), // Pass the correct type
                  ),
                );
              },
            ),
            const SizedBox(height: 16), // Add 'const' here
            _buildBankRow(
              imagePath: 'assets/images/png/HDFCBANK.png',
              bankName: 'HDFC bank',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        Bankvalue(banks: [banks[2]]), // Pass the correct type
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBankRow({
    required String imagePath,
    required String bankName,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey),
            ),
            child: Image.asset(
              imagePath,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 8),
          Text(bankName),
        ],
      ),
    );
  }
}
