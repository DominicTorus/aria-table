import 'package:flutter/material.dart';

class Dthrecharge extends StatefulWidget {
  const Dthrecharge({super.key});

  @override
  State<Dthrecharge> createState() => _DthrechargeState();
}

class _DthrechargeState extends State<Dthrecharge> {
  final TextEditingController _dthNumberController = TextEditingController();
  String? _selectedPlan;
  String? _selectedProvider;

  final List<String> _providers = [
    'Sun Direct',
    'Dish TV',
    'Tata Sky',
    'Airtel Dish',
    'Videocon Dish'
  ];

  final Map<String, List<String>> _plans = {
    'Sun Direct': ['Plan A - \$10', 'Plan B - \$20', 'Plan C - \$30'],
    'Dish TV': ['Plan X - \$15', 'Plan Y - \$25', 'Plan Z - \$35'],
    'Tata Sky': ['Plan 1 - \$12', 'Plan 2 - \$22', 'Plan 3 - \$32'],
    'Airtel Dish': [
      'Plan Alpha - \$18',
      'Plan Beta - \$28',
      'Plan Gamma - \$38'
    ],
    'Videocon Dish': ['Plan I - \$14', 'Plan II - \$24', 'Plan III - \$34']
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('DTH Recharge'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Select your DTH Provider',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            DropdownButtonFormField<String>(
              value: _selectedProvider,
              hint: Text('Choose a provider'),
              items: _providers.map((String provider) {
                return DropdownMenuItem<String>(
                  value: provider,
                  child: Text(provider),
                );
              }).toList(),
              onChanged: (String? newValue) {
                setState(() {
                  _selectedProvider = newValue;
                  _selectedPlan = null; // Reset plan when provider changes
                });
              },
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.domain),
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Enter your DTH Number',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            TextField(
              controller: _dthNumberController,
              decoration: InputDecoration(
                hintText: 'Enter your DTH number',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.dvr),
              ),
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 16),
            Text(
              'Select a Recharge Plan',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            DropdownButtonFormField<String>(
              value: _selectedPlan,
              hint: Text('Choose a plan'),
              items: _selectedProvider == null
                  ? []
                  : _plans[_selectedProvider!]!.map((String plan) {
                      return DropdownMenuItem<String>(
                        value: plan,
                        child: Text(plan),
                      );
                    }).toList(),
              onChanged: (String? newValue) {
                setState(() {
                  _selectedPlan = newValue;
                });
              },
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.payment),
              ),
            ),
            SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                if (_dthNumberController.text.isEmpty ||
                    _selectedPlan == null ||
                    _selectedProvider == null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Please fill in all fields')),
                  );
                  return;
                }
                // Handle the recharge request here
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Recharge request submitted')),
                );
              },
              child: Text('Submit'),
            ),
          ],
        ),
      ),
    );
  }
}
