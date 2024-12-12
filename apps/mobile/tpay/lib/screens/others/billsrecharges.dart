import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:tpay/screens/others/paymentcategory/dthrecharge.dart';
import 'package:tpay/screens/others/paymentcategory/electricitybill.dart';
import 'package:tpay/screens/others/paymentcategory/fasttag/fasttag.dart';
import 'package:tpay/screens/others/paymentcategory/gasbill.dart';
import 'package:tpay/screens/others/paymentcategory/hospital.dart';
import 'package:tpay/screens/others/paymentcategory/internetbill.dart';
import 'package:tpay/screens/others/paymentcategory/loanpayment.dart';
import 'package:tpay/screens/others/paymentcategory/mobileRecharge.dart';
import 'package:tpay/screens/others/paymentcategory/subcription.dart';
import 'package:tpay/screens/others/paymentcategory/taxipay.dart';
import 'package:tpay/screens/others/paymentcategory/waterbill.dart';

class BillsRecharges extends StatefulWidget {
  const BillsRecharges({super.key});

  @override
  _BillsRechargesState createState() => _BillsRechargesState();
}

class _BillsRechargesState extends State<BillsRecharges> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_outlined),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          children: [
            Expanded(
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Search',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(50.0),
                  ),
                ),
                onChanged: (value) {},
              ),
            ),
            IconButton(
              icon: const Icon(Icons.more_vert_outlined),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Feedback'),
                    content: const Text(
                      'Send feedback functionality can be implemented here.',
                    ),
                    actions: [
                      TextButton(
                        child: const Text('OK'),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 20),
          child: Text(
            "Payment Categories",
            style: TextStyle(color: Colors.black, fontSize: 20),
          ),
        ),
        _buildSectionHeader('Recharge', [
          _MenuItem(
            icon: Icons.phone_android,
            label: 'Mobile \nRecharge',
            onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const MobileRecharge())),
          ),
          _MenuItem(
            icon: Icons.dvr_outlined,
            label: 'DTH Recharge',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Dthrecharge())),
          ),
          _MenuItem(
            icon: Icons.storefront,
            label: 'Google play',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Internetbill())),
          ),
          _MenuItem(
            icon: Icons.car_rental,
            label: 'Fast Tag \nRecharge',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const FastTag())),
          ),
        ]),
        const SizedBox(height: 16),
        const Divider(),
        _buildSectionHeader('Utility Bills', [
          _MenuItem(
            icon: Icons.lightbulb_outline,
            label: 'Electricity \nBill',
            onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const ElectricityBill())),
          ),
          _MenuItem(
            icon: Icons.wifi,
            label: 'Internet Bill',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Internetbill())),
          ),
          _MenuItem(
            icon: Icons.mobile_friendly,
            label: 'postpaid \nBill',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Waterbill())),
          ),
          _MenuItem(
            icon: Icons.water_drop,
            label: 'Water Bill',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Waterbill())),
          ),
          _MenuItem(
            icon: Icons.gas_meter,
            label: 'Gas Bill',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Gasbill())),
          ),
          _MenuItem(
            icon: Icons.local_gas_station,
            label: 'CNG Bill',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Gasbill())),
          ),
          _MenuItem(
            icon: Icons.book,
            label: 'Education \nBill',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Gasbill())),
          ),
        ]),
        const SizedBox(height: 16),
        const Divider(),
        _buildSectionHeader('Finance & Tax', [
          _MenuItem(
            icon: Icons.monetization_on,
            label: 'Loan Payment',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Loanpayment())),
          ),
          _MenuItem(
            icon: Icons.local_atm,
            label: 'Emi Payment',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Taxipay())),
          ),
          _MenuItem(
            icon: Icons.taxi_alert,
            label: 'Taxi',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Taxipay())),
          ),
        ]),
        const SizedBox(height: 16),
        const Divider(),
        _buildSectionHeader('More', [
          _MenuItem(
            icon: Icons.subscriptions,
            label: 'Subscription',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Subcription())),
          ),
          _MenuItem(
            icon: Icons.local_hospital,
            label: 'Hospital',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Hospital())),
          ),
          _MenuItem(
            icon: Icons.house,
            label: 'Housing',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Hospital())),
          ),
          _MenuItem(
            icon: Icons.assessment,
            label: 'Assessment',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Hospital())),
          ),
          _MenuItem(
            icon: Icons.card_giftcard,
            label: 'Gift Card',
            onTap: () => Navigator.push(context,
                MaterialPageRoute(builder: (context) => const Hospital())),
          ),
        ]),
        const SizedBox(height: 16),
        const Divider(),
      ],
    );
  }

  Widget _buildSectionHeader(String title, List<_MenuItem> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Text(
            title,
            style: const TextStyle(
                color: Colors.black, fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 16.0,
            mainAxisSpacing: 16.0,
          ),
          itemCount: items.length,
          itemBuilder: (context, index) {
            final item = items[index];
            return _buildMenuItem(
              icon: item.icon,
              label: item.label,
              onTap: item.onTap,
            );
          },
        ),
      ],
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16.0),
      child: Container(
        padding: const EdgeInsets.all(8.0),
        decoration: BoxDecoration(
          color: const Color.fromARGB(255, 231, 238, 245),
          borderRadius: BorderRadius.circular(16.0),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              child: Icon(icon, color: Colors.black),
              radius: 30.0,
              backgroundColor: Colors.transparent,
            ),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.black,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _MenuItem({
    required this.icon,
    required this.label,
    required this.onTap,
  });
}
