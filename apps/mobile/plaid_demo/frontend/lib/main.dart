import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontend/account_info.dart';
import 'package:http/http.dart' as http;
import 'package:plaid_flutter/plaid_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized;
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late SharedPreferences prefs;
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'TPay',
      debugShowCheckedModeBanner: false,
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  LinkConfiguration? _configuration;
  StreamSubscription<LinkEvent>? _streamEvent;
  StreamSubscription<LinkExit>? _streamExit;
  StreamSubscription<LinkSuccess>? _streamSuccess;
  late SharedPreferences prefs;
  String linkToken = '';
  String publicToken = '';
  String accessToken = '';
  List<Map<String, String>> accounts = [];
  Map<String, String> institution = {};

  @override
  void initState() {
    super.initState();
    initSharedPrefs();
  }

  void initSharedPrefs() async {
    prefs = await SharedPreferences.getInstance();
    final storedAccessToken = prefs.getString('access-token');
    if (storedAccessToken != null) {
      final storedAccounts = prefs.getString('accounts');
      final storedInstitution = prefs.getString('institution');
      // GET ACCOUNTS
      if (storedAccounts != null) {
        try {
          List<dynamic> jsonList = jsonDecode(storedAccounts);
          setState(() {
            accounts = jsonList.map((item) {
              if (item is Map<String, dynamic>) {
                return {
                  'id': item['id'] as String,
                  'name': item['name'] as String,
                  'mask': item['mask'].toString(),
                  'type': item['type'] as String,
                };
              } else {
                return {
                  'id': '',
                  'name': '',
                  'mask': '',
                  'type': '',
                };
              }
            }).toList();
          });
        } catch (e) {
          print('Error parsing accounts JSON: $e');
        }
      }
      // GET INSTITUIONS
      if (storedInstitution != null) {
        try {
          final decodedInstitution =
              jsonDecode(storedInstitution) as Map<String, dynamic>;
          setState(() {
            institution = {
              'id': decodedInstitution['id'] as String,
              'name': decodedInstitution['name'] as String,
            };
          });
        } catch (e) {
          print('Error parsing institution JSON: $e');
        }
      }

      Navigator.pushReplacement(
        // ignore: use_build_context_synchronously
        context,
        MaterialPageRoute(
          builder: (context) => AccountInfo(
            accounts: accounts,
            institution: institution,
            accessToken: storedAccessToken,
          ),
        ),
      );
    } else {
      _createLinkToken();
      // setState(() {
      //   linkToken = 'link-sandbox-71c37b1e-bca4-4017-b6e4-79fc5c8ba5ae';
      //   _configuration = LinkTokenConfiguration(token: linkToken);
      // });
      _streamEvent = PlaidLink.onEvent.listen(_onEvent);
      _streamExit = PlaidLink.onExit.listen(_onExit);
      _streamSuccess = PlaidLink.onSuccess.listen(_onSuccess);
    }
  }

  Future<void> _createLinkToken() async {
    try {
      final response = await http.post(
        Uri.parse("http://localhost:3000/api/create-link-token"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "user": {"client_user_id": "App123"},
          "client_name": "Torus Pay",
          "products": ["auth"],
          "country_codes": ["US"],
          "language": "en",
          "webhook": "https://www.genericwebhookurl.com/webhook",
          "android_package_name": "com.example.frontend",
        }),
      );
      if (response.statusCode == 200) {
        setState(() {
          linkToken = jsonDecode(response.body)['link_token'];
          _configuration = LinkTokenConfiguration(token: linkToken);
        });
      } else {
        print('Failed to create link token');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  Future<void> _exchangePublicToken() async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:3000/api/exchange-public-token'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $publicToken',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          prefs.setString('access-token', data['access_token']);
          accessToken = data['access_token'];
        });
        Navigator.pushReplacement(
          // ignore: use_build_context_synchronously
          context,
          MaterialPageRoute(
              builder: (context) => AccountInfo(
                    accounts: accounts,
                    institution: institution,
                    accessToken: prefs.getString('access-token') ?? '',
                  )),
        );
      } else {
        print('Failed to exchange public token');
      }
    } catch (e) {
      print(e);
    }
  }

  void _onEvent(LinkEvent event) {
    final name = event.name;
    final metadata = event.metadata.description();
    print("onEvent: $name, metadata: $metadata");
  }

  void _onSuccess(LinkSuccess event) {
    final token = event.publicToken;
    final metadata = event.metadata.description();
    print(metadata);
    setState(() {
      publicToken = token.toString();
      accounts = event.metadata.accounts.map((account) {
        return {
          'id': account.id,
          'name': account.name,
          'mask': account.mask.toString(),
          'type': account.type
        };
      }).toList();
      institution = {
        'id': event.metadata.institution?.id ?? 'N/A',
        'name': event.metadata.institution?.name ?? 'N/A',
      };
      // Store accounts and institution
      prefs.setString('accounts', jsonEncode(accounts));
      prefs.setString('institution', jsonEncode(institution));
    });
    _exchangePublicToken();
  }

  void _onExit(LinkExit event) {
    final metadata = event.metadata.description();
    final error = event.error?.description();
    print("onExit metadata: $metadata, error: $error");
  }

  @override
  void dispose() {
    _streamEvent?.cancel();
    _streamExit?.cancel();
    _streamSuccess?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Padding(
          padding: EdgeInsets.only(top: 30),
          child: Text('Secure Payments'),
        ),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        centerTitle: true,
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: Center(
              child: Image.asset(
                'assets/images/transfer.png',
                fit: BoxFit.cover,
                width: double.infinity,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: const ButtonStyle(
                  backgroundColor: WidgetStatePropertyAll(Colors.blue),
                  foregroundColor: WidgetStatePropertyAll(Colors.white),
                ),
                onPressed: _configuration != null
                    ? () => PlaidLink.open(configuration: _configuration!)
                    : null,
                child: const Padding(
                  padding: EdgeInsets.all(8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Icon(Icons.account_balance, color: Colors.white),
                      SizedBox(
                        width: 10,
                        height: 30,
                      ),
                      Text('Add Bank Account'),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}
