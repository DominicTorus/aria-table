import 'package:flutter/material.dart';
import 'package:tpay/screens/others/paymentcategory/addbank.dart';

class DashboardTile extends StatelessWidget {
  const DashboardTile({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.center,
      child: Column(
        children: [
          const SizedBox(height: 25),
          Text(
            'Start with your bank',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 8),
          Text(
            'Send and receive money securely',
            style: Theme.of(context).textTheme.labelMedium,
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: 200,
            height: 30,
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => const AddBank()));
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Theme.of(context).cardColor,
                padding: EdgeInsets.zero,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: Text(
                'Add your bank account',
                style: Theme.of(context).textTheme.labelMedium,
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
