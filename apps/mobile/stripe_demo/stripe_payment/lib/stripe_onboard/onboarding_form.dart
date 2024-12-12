import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:multi_select_flutter/multi_select_flutter.dart';
import 'package:http/http.dart' as http;

class OnboardingForm extends StatefulWidget {
  const OnboardingForm({super.key});

  @override
  State<OnboardingForm> createState() => _OnboardingFormState();
}

class _OnboardingFormState extends State<OnboardingForm> {
  // ignore: unused_field
  final _formKey = GlobalKey<FormState>();
  final _stepperKey = GlobalKey<FormState>();

  int _currentStep = 0;
  String _businessType = 'individual';
  List<String> _selectedCapabilities = [];
  final List<String> _capabilities = [
    'acss_debit_payments',
    'affirm_payments',
    'afterpay_clearpay_payments',
    'amazon_pay_payments',
    'au_becs_debit_payments',
    'bacs_debit_payments',
    'bancontact_payments',
    'bank_transfer_payments',
    'card_payments',
    'cashapp_payments',
    'eps_payments',
    'india_international_payments',
    'link_payments',
    'mobilepay_payments',
    'transfers',
    'us_bank_account_ach_payments',
    'us_bank_transfer_payments',
  ];

  final _formData = {
    'address': '',
    'name': '',
    'export_license_id': '',
    'export_purpose_code': '',
    'owners_provided': false,
    'phone': '',
    'registration_number': '',
    'employer_id': '',
    'vat_id': '',
    'dob': DateTime.now(),
    'first_name': '',
    'last_name': '',
    'gender': 'Male',
    'id_number': '',
    'id_number_secondary': '',
    'political_exposure': 'none',
    'city': '',
    'country': '',
    'address_line1': '',
    'address_line2': '',
    'postal_code': '',
    'state': '',
    'relationship_title': '',
    'ssn_last_4': '',
    'type': 'custom',
  };

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    _formKey.currentState!.save();

    final requestData = {
      'country': _formData['country'],
      'type': _businessType,
      'business_profile_url': '',
      'date': DateTime.now().toIso8601String(),
      'ip_address': '',
      'address': _formData['address'],
      'name': _formData['name'],
      'export_license_id': _formData['export_license_id'],
      'export_purpose_code': _formData['export_purpose_code'],
      'owners_provided': _formData['owners_provided'],
      'phone': _formData['phone'],
      'registration_number': _formData['registration_number'],
      'employer_id': _formData['employer_id'],
      'vat_id': _formData['vat_id'],
      'dob': _formData['dob'],
      'first_name': _formData['first_name'],
      'last_name': _formData['last_name'],
      'gender': _formData['gender'],
      'id_number': _formData['id_number'],
      'id_number_secondary': _formData['id_number_secondary'],
      'political_exposure': _formData['political_exposure'],
      'city': _formData['city'],
      'address_line1': _formData['address_line1'],
      'address_line2': _formData['address_line2'],
      'postal_code': _formData['postal_code'],
      'state': _formData['state'],
      'relationship_title': _formData['relationship_title'],
      'ssn_last_4': _formData['ssn_last_4'],
      'selected_capabilities': _selectedCapabilities,
    };

    final response = await http.post(
      Uri.parse('http://localhost:3000/custom_onboard'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(requestData),
    );
    print('Response -> ${response.body}');
    if (response.statusCode == 200) {
      print('Form submitted successfully');
    } else {
      print('Error submitting form: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Merchant Onboarding'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
      ),
      body: Stepper(
        key: _stepperKey,
        currentStep: _currentStep,
        onStepContinue: () {
          if (_currentStep < _getSteps().length - 1) {
            setState(() {
              _currentStep++;
            });
          } else {
            print('Form Data: $_formData');
            print('Selected Capabilities: $_selectedCapabilities');
            // _submitForm();
          }
        },
        onStepCancel: () {
          if (_currentStep > 0) {
            setState(() {
              _currentStep--;
            });
          }
        },
        steps: _getSteps(),
      ),
    );
  }

  List<Step> _getSteps() {
    return [
      Step(
        title: const Text('Business Type'),
        content: Column(
          children: [
            DropdownButtonFormField<String>(
              value: _businessType,
              decoration: const InputDecoration(labelText: 'Business Type'),
              items: ['company', 'individual'].map((type) {
                return DropdownMenuItem(
                  value: type,
                  child: Text(type),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _businessType = value!;
                });
              },
              validator: (value) =>
                  value == null ? 'This field is required' : null,
            ),
          ],
        ),
        isActive: _currentStep >= 0,
        state: _currentStep > 0 ? StepState.complete : StepState.indexed,
      ),
      if (_businessType == 'company') ...[
        Step(
          title: const Text('Company Details'),
          content: Column(
            children: [
              _buildTextFormField('Name', 'name', required: true),
              _buildTextFormField('Address', 'address',
                  required: true, isTextArea: true),
              _buildTextFormField('Export License ID', 'export_license_id'),
              _buildTextFormField('Export Purpose Code', 'export_purpose_code'),
              CheckboxListTile(
                title: const Text('Owners Provided'),
                value: _formData['owners_provided'] as bool,
                onChanged: (bool? value) {
                  setState(() {
                    _formData['owners_provided'] = value!;
                  });
                },
              ),
              _buildTextFormField('Phone', 'phone', required: true),
            ],
          ),
          isActive: _currentStep >= 1,
          state: _currentStep > 1 ? StepState.complete : StepState.indexed,
        ),
        Step(
          title: const Text('More Company Details'),
          content: Column(
            children: [
              _buildTextFormField('Registration Number', 'registration_number',
                  required: true),
              _buildTextFormField('Employer ID', 'employer_id', required: true),
              _buildTextFormField('VAT ID', 'vat_id', required: true),
              _buildTextFormField('Other Detail', 'other_detail'),
            ],
          ),
          isActive: _currentStep >= 2,
          state: _currentStep > 2 ? StepState.complete : StepState.indexed,
        ),
      ] else if (_businessType == 'individual') ...[
        Step(
          title: const Text('Personal Details'),
          content: Column(
            children: [
              _buildTextFormField('First Name', 'first_name', required: true),
              _buildTextFormField('Last Name', 'last_name', required: true),
              _buildDatePicker('Date of Birth', 'dob', required: true),
              _buildTextFormField('Email', 'email', required: true),
              _buildDropdownFormField('Gender', 'gender', ['Male', 'Female']),
              _buildTextFormField('ID Number', 'id_number', required: true),
            ],
          ),
          isActive: _currentStep >= 1,
          state: _currentStep > 1 ? StepState.complete : StepState.indexed,
        ),
        Step(
          title: const Text('Address & More'),
          content: Column(
            children: [
              _buildTextFormField('Address Line 1', 'address_line1',
                  required: true, isTextArea: true),
              _buildTextFormField('Address Line 2', 'address_line2'),
              _buildTextFormField('Postal Code', 'postal_code', required: true),
              _buildDropdownFormField('City', 'city', []),
              _buildDropdownFormField('Country', 'country', []),
              _buildDropdownFormField('State', 'state', []),
              _buildTextFormField('Relationship Title', 'relationship_title'),
              _buildTextFormField('SSN Last 4', 'ssn_last_4', required: true),
            ],
          ),
          isActive: _currentStep >= 2,
          state: _currentStep > 2 ? StepState.complete : StepState.indexed,
        ),
      ],
      Step(
        title: const Text('Capabilities'),
        content: Column(
          children: [
            MultiSelectDialogField(
              items: _capabilities
                  .map((capability) =>
                      MultiSelectItem<String>(capability, capability))
                  .toList(),
              title: const Text("Capabilities"),
              selectedColor: Colors.blue,
              onConfirm: (values) {
                setState(() {
                  _selectedCapabilities = values.cast<String>();
                });
              },
              chipDisplay: MultiSelectChipDisplay(
                onTap: (item) {
                  setState(() {
                    _selectedCapabilities.remove(item);
                  });
                },
              ),
            ),
          ],
        ),
        isActive: _currentStep >= (_businessType == 'company' ? 3 : 2),
        state: _currentStep > (_businessType == 'company' ? 3 : 2)
            ? StepState.complete
            : StepState.indexed,
      ),
      Step(
        title: const Text('Review & Submit'),
        content: const Column(
          children: [
            Text('Review your information and submit the form.'),
          ],
        ),
        isActive: _currentStep >= (_businessType == 'company' ? 4 : 3),
        state: _currentStep > (_businessType == 'company' ? 4 : 3)
            ? StepState.complete
            : StepState.indexed,
      ),
    ];
  }

  Widget _buildTextFormField(String label, String key,
      {bool required = false, bool isTextArea = false}) {
    return TextFormField(
      decoration: InputDecoration(labelText: label),
      onChanged: (value) {
        setState(() {
          _formData[key] = value;
        });
      },
      maxLines: isTextArea ? 3 : 1,
      validator: (value) {
        if (required && (value == null || value.isEmpty)) {
          return 'This field is required';
        }
        return null;
      },
    );
  }

  Widget _buildDatePicker(String label, String key, {bool required = false}) {
    return GestureDetector(
      onTap: () async {
        DateTime? pickedDate = await showDatePicker(
          context: context,
          initialDate: _formData[key] as DateTime,
          firstDate: DateTime(1900),
          lastDate: DateTime.now(),
        );
        if (pickedDate != null) {
          setState(() {
            _formData[key] = pickedDate;
          });
        }
      },
      child: AbsorbPointer(
        child: TextFormField(
          decoration: InputDecoration(labelText: label),
          controller: TextEditingController(
            text:
                (_formData[key] as DateTime).toLocal().toString().split(' ')[0],
          ),
          validator: (value) {
            if (required && (value == null || value.isEmpty)) {
              return 'This field is required';
            }
            return null;
          },
        ),
      ),
    );
  }

  Widget _buildDropdownFormField(
      String label, String key, List<String> options) {
    return DropdownButtonFormField<String>(
      value: _formData[key].toString(),
      decoration: InputDecoration(labelText: label),
      items: options.map((option) {
        return DropdownMenuItem(
          value: option,
          child: Text(option),
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _formData[key] = value!;
        });
      },
      validator: (value) {
        if (value == null) {
          return 'This field is required';
        }
        return null;
      },
    );
  }
}
