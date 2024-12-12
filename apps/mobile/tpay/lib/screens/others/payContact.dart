import 'package:contacts_service/contacts_service.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:tpay/screens/others/payments/pay.dart';

class PayContact extends StatefulWidget {
  const PayContact({super.key});

  @override
  State<PayContact> createState() => _PayContactState();
}

class _PayContactState extends State<PayContact> {
  final TextEditingController _searchController = TextEditingController();
  List<Contact> _allContacts = [];
  List<Contact> _filteredContacts = [];
  bool _loading = true;
  bool _permissionDenied = false;

  @override
  void initState() {
    super.initState();
    getPermission();
    _loadContacts();
    _searchController.addListener(() {
      _filterContacts(_searchController.text);
    });
  }

  void _filterContacts(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredContacts = _allContacts;
      } else {
        _filteredContacts = _allContacts.where((contact) {
          final nameContainsQuery = contact.displayName != null &&
              contact.displayName!.toLowerCase().contains(query.toLowerCase());
          final phoneContainsQuery = contact.phones != null &&
              contact.phones!.any((phone) =>
                  phone.value != null && phone.value!.contains(query));

          return nameContainsQuery || phoneContainsQuery;
        }).toList();
      }
    });
  }

  Future<void> getPermission() async {
    await Permission.contacts.request();
  }

  Future<void> _loadContacts() async {
    try {
      var permissionStatus = await Permission.contacts.request();

      if (permissionStatus.isGranted) {
        try {
          List<Contact> contacts =
              (await ContactsService.getContacts()).toList();
          setState(() {
            _allContacts = contacts;
            _filteredContacts = contacts;
            _permissionDenied = false;
          });
        } catch (e) {
          print('Error fetching contacts: $e');
        }
      } else {
        setState(() {
          _permissionDenied = false;
        });
      }
      setState(() {
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _loading = false;
        _permissionDenied = true;
      });

      print('Exception while requesting permission: $e');
    }
  }

  ListTile _showErrorTile(String errorMessgae) {
    return ListTile(
      title: const Text(
        'Pay friends who are also on Torus Pay',
        style: TextStyle(fontSize: 12),
      ),
      leading: const Icon(
        Icons.contact_page_outlined,
        size: 30,
      ),
      subtitle: Align(
        alignment: Alignment.centerLeft,
        child: GestureDetector(
          onTap: () {
            openAppSettings();
          },
          child: Text(
            'Sync contacts',
            style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Theme.of(context).primaryColorDark),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Container(
          height: 45.0,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20.0),
            boxShadow: [
              BoxShadow(color: Colors.grey.shade300, blurRadius: 5.0)
            ],
            border: Border.all(
              color: Colors.black,
              width: 1.0,
            ),
          ),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.black),
                onPressed: () {
                  Navigator.pop(context);
                },
              ),
              Expanded(
                child: TextField(
                  controller: _searchController,
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Search...',
                    hintStyle: TextStyle(color: Colors.grey),
                    contentPadding:
                        EdgeInsets.symmetric(horizontal: 10.0, vertical: 8),
                  ),
                ),
              ),
            ],
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          PopupMenuButton(
            icon: const Icon(Icons.more_vert_outlined),
            onSelected: (dynamic value) {
              // Handle menu actions here
            },
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
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            //_showErrorTile(''),
            _permissionDenied ? _showErrorTile('') : const SizedBox(),
            const SizedBox(height: 12),
            _loading
                ? const Center(
                    child: CircularProgressIndicator(),
                  )
                : _filteredContacts.isNotEmpty
                    ? Expanded(
                        child: ListView.builder(
                          itemCount: _filteredContacts.length,
                          itemBuilder: (context, index) {
                            final contact = _filteredContacts[index];
                            return Column(
                              children: [
                                ListTile(
                                  leading: contact.avatar != null &&
                                          contact.avatar!.isNotEmpty
                                      ? CircleAvatar(
                                          backgroundImage:
                                              MemoryImage(contact.avatar!),
                                        )
                                      : CircleAvatar(
                                          child: Text(contact.displayName
                                              .toString()[0]),
                                        ),
                                  title: Text(contact.displayName ?? 'No Name'),
                                  subtitle: contact.phones!.isNotEmpty
                                      ? Text(contact.phones!.first.value ??
                                          'No Phone Number')
                                      : null,
                                  onTap: () {
                                    Navigator.pushReplacement(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                const PaymentScreen()));
                                  },
                                ),
                              ],
                            );
                          },
                        ),
                      )
                    : const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}
