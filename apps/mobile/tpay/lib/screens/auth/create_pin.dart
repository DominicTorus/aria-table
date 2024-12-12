import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sms_autofill/sms_autofill.dart';
import 'package:tpay/screens/others/dashboard.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class CreatePin extends StatefulWidget {
  const CreatePin({super.key});

  @override
  State<CreatePin> createState() => _CreatePinState();
}

class _CreatePinState extends State<CreatePin> {
  String? _code;

  void _submit() {
    if (_code!.length == 4) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (BuildContext context) => const Dashboard()),
        (Route<dynamic> route) => false,
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Please enter a valid PIN.'),
          behavior: SnackBarBehavior.floating,
          margin: const EdgeInsets.only(bottom: 16, right: 16, left: 16),
          backgroundColor: Colors.red,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        AppLocalizations.of(context)!.createyournewPIN,
                        style: TextStyle(fontSize: 25),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        AppLocalizations.of(context)!
                            .chooseyourpreferredsecuritymethod,
                        style: TextStyle(fontSize: 15),
                      ),
                    ),
                    const SizedBox(height: 100),
                    PinFieldAutoFill(
                      currentCode: _code,
                      keyboardType: TextInputType.number,
                      autoFocus: true,
                      enabled: true,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      onCodeChanged: (val) {
                        WidgetsBinding.instance.addPostFrameCallback((_) {
                          if (mounted) {
                            setState(() {
                              _code = val;
                            });
                          }
                        });
                      },
                      onCodeSubmitted: (val) {
                        _submit();
                      },
                      codeLength: 4,
                    ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(
                shadowColor: Colors.transparent,
                backgroundColor: Theme.of(context).primaryColorDark,
                foregroundColor: Theme.of(context).primaryColorLight,
                padding: EdgeInsets.zero,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Continue'),
            ),
          ),
        ],
      ),
    );
  }
}
