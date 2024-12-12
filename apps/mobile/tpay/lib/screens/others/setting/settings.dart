import 'dart:io';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
// import 'package:tpay/screens/others/setting/feedback.dart';

class MySetting extends StatefulWidget {
  const MySetting({super.key});

  @override
  State<MySetting> createState() => _MySettingState();
}

class _MySettingState extends State<MySetting> {
  SharedPreferences? prefs;
  String referralCode = 'your_referral_code';
  String imagePath = '';

  @override
  void initState() {
    super.initState();
    initSharedPrefs();
  }

  void initSharedPrefs() async {
    prefs = await SharedPreferences.getInstance();
    setState(() {
      imagePath = prefs!.getString('avatar_image').toString();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        // backgroundColor: Theme.of(context).primaryColorDark,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_outlined),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          PopupMenuButton<int>(
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem<int>(
                value: 1,
                child: Text('Send feedback',
                    style: TextStyle(color: Colors.black)),
              ),
            ],
            onSelected: (value) {
              if (value == 1) {
                _showFeedbackDialog(context);
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Align(
              alignment: Alignment.center,
              child: CircleAvatar(
                radius: 50,
                backgroundColor: const Color.fromARGB(255, 181, 208, 255),
                child: imagePath != null && imagePath != ''
                    ? ClipOval(
                        child: Image.file(
                          File(imagePath),
                          width: 100,
                          height: 100,
                          fit: BoxFit.cover,
                        ),
                      )
                    : const Padding(
                        padding: EdgeInsets.only(bottom: 1),
                        child: Text(
                          "T",
                          style: TextStyle(fontSize: 30),
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('MSP', style: TextStyle(color: Colors.black)),
                const Text(
                  "+91 9876543210",
                  style: TextStyle(color: Colors.black),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Text('UPI ID: ',
                            style: TextStyle(color: Colors.black)),
                        Text(
                          referralCode,
                          style: const TextStyle(color: Color(0xff666666)),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.content_copy),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content:
                                  Text('referralCode copied to Clipboard')),
                        );
                      },
                    ),
                  ],
                ),
                const Divider(color: Colors.grey, thickness: 1),
              ],
            ),
            const SizedBox(height: 20),
            _sectionTitle("Account"),
            const SizedBox(height: 5),
            _accountWidget("Signed in as", "BobJohn@gpay.com"),
            const SizedBox(height: 5),
            _accountWidget("Mobile Number", "+91 9876543210"),
            const SizedBox(height: 5),
            _accountWidget("Payment methods", "GPay Bank 1234", onTap: () {
              // Implement your logic here
            }),
            const SizedBox(height: 5),
            _accountWidget("Language", "English"),
            const SizedBox(height: 5),
            _accountWidget("Pay across Google",
                "Save your UPI IDs to your Google Account"),
            const Divider(color: Colors.grey, thickness: 1),
            const SizedBox(height: 5),
            _sectionTitle("Privacy and Security"),
            const SizedBox(height: 5),
            _accountWidget("Change Password", "Change your password"),
            const SizedBox(height: 5),
            _accountWidget("Change PIN", "Change your PIN"),
            const SizedBox(height: 5),
            _accountWidget("Delete Account", "Delete your account", onTap: () {
              // Implement your logic here
            }),
            const SizedBox(height: 5),
            _accountWidget("Logout", "Logout of Google Pay", onTap: () {
              // Implement your logic here
            }),
            const Divider(color: Colors.grey, thickness: 1),
            const SizedBox(height: 5),
            _sectionTitle("Information"),
            const SizedBox(height: 5),
            _accountWidget("Help", "Help and feedback"),
            const SizedBox(height: 5),
            _accountWidget("Privacy Policy", "Privacy policy"),
            const SizedBox(height: 5),
            _accountWidget("Terms of Service", "Terms of service"),
            const SizedBox(height: 5),
            _accountWidget("version", "1.0.0", onTap: () {
              // Implement your logic here
            }),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Text(
      title.toUpperCase(),
      style: const TextStyle(
          fontSize: 12, fontWeight: FontWeight.bold, color: Colors.black),
    );
  }

  Widget _accountWidget(String title, String subtitle, {VoidCallback? onTap}) {
    return ListTile(
      title: Text(title),
      subtitle: Text(subtitle),
      onTap: onTap,
    );
  }

  void _showFeedbackDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
          elevation: 0,
          backgroundColor: Colors.transparent,
          child: contentBox(context),
        );
      },
    );
  }

  Widget contentBox(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        shape: BoxShape.rectangle,
        color: Colors.white,
        borderRadius: BorderRadius.circular(10.0),
        boxShadow: const [
          BoxShadow(
            color: Colors.black,
            offset: Offset(0, 10),
            blurRadius: 10.0,
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          const Text(
            "Send Feedback",
            style: TextStyle(
              fontSize: 22.0,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 15.0),
          TextField(
            decoration: InputDecoration(
              hintText: "Enter your feedback",
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
              ),
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 10.0, vertical: 15.0),
            ),
            maxLines: 5,
          ),
          const SizedBox(height: 20.0),
          Align(
            alignment: Alignment.bottomRight,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
                // Handle feedback submission here
              },
              child: const Text("Submit"),
            ),
          ),
        ],
      ),
    );
  }
}
