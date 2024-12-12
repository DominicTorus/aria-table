import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:tpay/screens/others/payments/pay.dart';

class Banktransfer extends StatefulWidget {
  const Banktransfer({super.key});

  @override
  State<Banktransfer> createState() => _BanktransferState();
}

class _BanktransferState extends State<Banktransfer> {
  final TextEditingController accountNumberController = TextEditingController();
  final TextEditingController reEnterAccountNumberController =
      TextEditingController();
  final TextEditingController ifscCodeController = TextEditingController();
  final TextEditingController accountHolderController = TextEditingController();

  bool isFormValid = false;

  @override
  void initState() {
    super.initState();
    accountNumberController.addListener(validateForm);
    reEnterAccountNumberController.addListener(validateForm);
    ifscCodeController.addListener(validateForm);
    accountHolderController.addListener(validateForm);
  }

  @override
  void dispose() {
    accountNumberController.dispose();
    ifscCodeController.dispose();
    accountHolderController.dispose();
    reEnterAccountNumberController.dispose();
    super.dispose();
  }

  void validateForm() {
    final String accountNumber = accountNumberController.text;
    final String reEnterAccountNumber = reEnterAccountNumberController.text;
    final String ifscCode = ifscCodeController.text;
    final String accountHolderName = accountHolderController.text;

    bool isValidAccountNumber = int.tryParse(accountNumber) != null;
    bool isValidIFSC = ifscCode.length == 11;
    bool isValidAccountHolderName = accountHolderName.isNotEmpty;
    bool reEnterAccountNumberValid = accountNumber == reEnterAccountNumber;
    bool formIsValid = isValidAccountNumber &&
        isValidIFSC &&
        isValidAccountHolderName &&
        reEnterAccountNumberValid;

    setState(() {
      isFormValid = formIsValid;
      print(isFormValid);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).cardColor,
        title: const Text('Enter recipient details'),
        actions: [
          PopupMenuButton(
            icon: const Icon(Icons.more_vert_outlined),
            onSelected: (dynamic value) {},
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
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(
          children: [
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: TextFormField(
                controller: accountNumberController,
                keyboardType: TextInputType.number,
                inputFormatters: <TextInputFormatter>[
                  FilteringTextInputFormatter.digitsOnly
                ],
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Bank Account Number',
                ),
                obscureText: true,
                autovalidateMode: AutovalidateMode.onUserInteraction,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: TextFormField(
                controller: reEnterAccountNumberController,
                keyboardType: TextInputType.number,
                inputFormatters: <TextInputFormatter>[
                  FilteringTextInputFormatter.digitsOnly
                ],
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Re-enter bank account number',
                ),
                obscureText: true,
                autovalidateMode: AutovalidateMode.onUserInteraction,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please re-enter the account number';
                  } else if (value != accountNumberController.text) {
                    return 're-enter account number must matches with \naccount number';
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: TextFormField(
                controller: ifscCodeController,
                maxLength: 11,
                textCapitalization: TextCapitalization.characters,
                inputFormatters: <TextInputFormatter>[
                  FilteringTextInputFormatter.allow(RegExp(r'[A-Z0-9]')),
                ],
                decoration: InputDecoration(
                  counterText: '',
                  border: const OutlineInputBorder(),
                  labelText: 'IFSC Code',
                  suffixIcon: ElevatedButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                        foregroundColor: Theme.of(context).primaryColorDark,
                        backgroundColor: Theme.of(context).cardColor,
                        elevation: 0),
                    child: const Text('Search IFSC '),
                  ),
                ),
                autovalidateMode: AutovalidateMode.onUserInteraction,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the IFSC code';
                  } else if (value.length != 11) {
                    return 'IFSC should be 4 letters, followed by 7 letters or \ndigits';
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: TextField(
                controller: accountHolderController,
                textCapitalization: TextCapitalization.characters,
                inputFormatters: <TextInputFormatter>[
                  FilteringTextInputFormatter.allow(RegExp(r'[a-zA-Z]')),
                ],
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Account Holder Name',
                ),
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
      floatingActionButton: Center(
        child: Padding(
          padding: const EdgeInsets.only(bottom: 30, left: 30),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              SizedBox(
                width: 150,
                height: 50,
                child: FloatingActionButton(
                  backgroundColor: isFormValid
                      ? Theme.of(context).primaryColor
                      : Colors.grey.shade200,
                  foregroundColor: isFormValid
                      ? Theme.of(context).primaryColorLight
                      : Colors.grey.shade500,
                  onPressed: isFormValid
                      ? () {
                          Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => PaymentScreen()));
                        }
                      : null,
                  child: const Padding(
                    padding: EdgeInsets.only(bottom: 2),
                    child: Text(
                      'Proceed to Pay',
                      style: TextStyle(fontSize: 15),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
