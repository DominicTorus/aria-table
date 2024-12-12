import 'package:flutter/material.dart';
import 'package:tpay/providers/googleAccountsProvide.dart';
import 'package:tpay/screens/auth/otpVerification.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class AccountSelection extends StatefulWidget {
  final String phoneNumber;
  const AccountSelection({super.key, required this.phoneNumber});

  @override
  State<AccountSelection> createState() => _AccountSelectionState();
}

class _AccountSelectionState extends State<AccountSelection> {
  // List<String> _googleAccounts = [];
  // // final AccountService _accountService = AccountService();
  // final GoogleSignIn _googleSignIn = GoogleSignIn();
  List<String> _googleAccounts = [];
  final GoogleAccountProvider _accountProvider = GoogleAccountProvider();

  @override
  void initState() {
    super.initState();
    // _signInWithGoogle();
    _loadGoogleAccounts();
  }

  Future<void> _loadGoogleAccounts() async {
    final accounts = await _accountProvider.getGoogleAccounts();
    setState(() {
      print(_googleAccounts);
      _googleAccounts = accounts;
    });
  }
  // Future<void> _signInWithGoogle() async {
  //   try {
  //     final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
  //     if (googleUser != null) {
  //       //final googleAuth = await googleUser.authentication;
  //       final String? accountName = googleUser.displayName;

  //       if (accountName != null) {
  //         setState(() {
  //           _googleAccounts = [accountName];
  //         });
  //       }
  //     }
  //   } catch (e) {
  //     print('Error signing in with Google: $e');
  //   }
  // }

  String _getAvatarText(String name) {
    if (name.isEmpty) {
      return '';
    }
    List<String> parts = name.split(' ');
    if (parts.length > 1) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else {
      return name.substring(0, 2).toUpperCase();
    }
  }

  Widget _buildAvatar(String name) {
    return CircleAvatar(
      backgroundColor: Colors.blueAccent,
      radius: 24,
      child: Text(
        _getAvatarText(name),
        style: Theme.of(context).textTheme.labelLarge,
      ),
    );
  }

  Future<void> _submit(String account) async {
    // var appSignatureID = await SmsAutoFill().getAppSignature;
    // Map<String, String> sendOtpData = {
    //   "mobile_number": widget.phoneNumber,
    //   "app_signature_id": appSignatureID,
    //   "account": account
    // };

    Navigator.push(
      // ignore: use_build_context_synchronously
      context,
      MaterialPageRoute(
        builder: (context) => Otpverification(
          phonenumber: widget.phoneNumber,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(right: 100),
                  child: Image.asset(
                    'assets/icons/torus.ico',
                    height: 90,
                    width: 90,
                  ),
                ),
                Text(
                  AppLocalizations.of(context)!.chooseyouraccount,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  AppLocalizations.of(context)!
                      .thisishowpeopleontoruspaywillseeyou,
                  style: Theme.of(context).textTheme.labelMedium,
                ),
                const SizedBox(height: 30),
                Expanded(
                  child: ListView.builder(
                    itemCount: _googleAccounts.length,
                    itemBuilder: (context, index) {
                      final account = _googleAccounts[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: ListTile(
                          contentPadding:
                              const EdgeInsets.symmetric(horizontal: 12.0),
                          title: Text(
                            account,
                            style: Theme.of(context).textTheme.labelMedium,
                          ),
                          leading: _buildAvatar(account),
                          onTap: () => _submit(account),
                        ),
                      );
                    },
                  ),
                ),
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      RichText(
                        textAlign: TextAlign.justify,
                        text: TextSpan(
                          text: 'By continuing you agree to the combined ',
                          style: Theme.of(context).textTheme.displaySmall,
                          children: const [
                            TextSpan(
                              text: 'Google Pay Terms',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                                color: Colors.blue,
                              ),
                            ),
                            TextSpan(
                              text:
                                  '\n    The Privacy Policy describes how your data is handled. \nGoogle Pay will periodically send your contacts and location \nto Google servers. People with your number can contact you \n access Google services and see your public information like \nname and photo. The phone number you have provided can \n                 be used on different Google Services',
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: ElevatedButton(
                          onPressed: () {
                            if (_googleAccounts.isNotEmpty) {
                              _submit(_googleAccounts.first);
                            } else {
                              _submit('');
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            shadowColor: Colors.transparent,
                            backgroundColor: Theme.of(context).primaryColorDark,
                            foregroundColor:
                                Theme.of(context).primaryColorLight,
                            padding: EdgeInsets.zero,
                            minimumSize: const Size(double.infinity, 50),
                          ),
                          child: Text(
                              AppLocalizations.of(context)!.acceptandcontinue),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
