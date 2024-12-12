import 'package:flutter/material.dart';

class Internetbill extends StatefulWidget {
  const Internetbill({super.key});

  @override
  State<Internetbill> createState() => _InternetbillState();
}

class _InternetbillState extends State<Internetbill> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _amountController = TextEditingController();

  String? _selectedProvider;
  String? _selectedPlan;

  // Define a map of plan amounts
  final Map<String, String> _planAmounts = {
    'Basic': '100',
    'Standard': '200',
    'Premium': '300',
  };

  final List<String> _providers = ['ACT', 'BSNL', 'Airtel', 'Jio', 'Fiber'];
  final List<String> _plans = ['Basic', 'Standard', 'Premium'];

  @override
  void dispose() {
    _nameController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Internet Bill Payment"),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'Internet Bill Details',
                style: Theme.of(context)
                    .textTheme
                    .bodyLarge
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 20),
              _buildDropdown<String>(
                value: _selectedProvider,
                hint: 'Select ISP',
                items: _providers,
                onChanged: (value) {
                  setState(() {
                    _selectedProvider = value;
                  });
                },
                validator: (value) =>
                    value == null ? 'Please select an ISP' : null,
              ),
              SizedBox(height: 20),
              _buildDropdown<String>(
                value: _selectedPlan,
                hint: 'Select Plan',
                items: _plans,
                onChanged: (value) {
                  setState(() {
                    _selectedPlan = value;
                    _amountController.text = _planAmounts[_selectedPlan] ?? '';
                  });
                },
                validator: (value) =>
                    value == null ? 'Please select a plan' : null,
              ),
              SizedBox(height: 20),
              _buildTextField(
                controller: _nameController,
                labelText: 'Name',
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter your name'
                    : null,
              ),
              SizedBox(height: 20),
              _buildTextField(
                controller: _amountController,
                labelText: 'Amount',
                keyboardType: TextInputType.number,
                validator: (value) => value == null || value.isEmpty
                    ? 'Please enter the amount'
                    : null,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _handleSubmit,
                child: Text('Submit'),
              ),
              SizedBox(height: 20),
              Divider(),
              SizedBox(height: 20),
              Text(
                'Payment Summary',
                style: Theme.of(context)
                    .textTheme
                    .bodyLarge
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDropdown<T>({
    required String? value,
    required String hint,
    required List<T> items,
    required ValueChanged<T?> onChanged,
    required FormFieldValidator<T?> validator,
  }) {
    return DropdownButtonFormField<T>(
      value: value as T?,
      hint: Text(hint),
      decoration: InputDecoration(
        border: OutlineInputBorder(),
      ),
      items: items.map((item) {
        return DropdownMenuItem<T>(
          value: item,
          child: Text(item.toString()),
        );
      }).toList(),
      onChanged: onChanged,
      validator: validator,
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String labelText,
    TextInputType keyboardType = TextInputType.text,
    required FormFieldValidator<String?> validator,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: labelText,
        border: OutlineInputBorder(),
      ),
      keyboardType: keyboardType,
      validator: validator,
    );
  }

  void _handleSubmit() {
    if (_formKey.currentState?.validate() ?? false) {
      showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text('Payment Confirmation'),
            content: Text(
                'Your bill has been submitted successfully.\n\nProvider: $_selectedProvider\nPlan: $_selectedPlan\nName: ${_nameController.text}\nAmount: ${_amountController.text}'),
            actions: <Widget>[
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: Text('OK'),
              ),
            ],
          );
        },
      );
    }
  }
}
