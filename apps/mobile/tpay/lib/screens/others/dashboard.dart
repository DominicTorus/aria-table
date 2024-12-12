import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:getwidget/components/list_tile/gf_list_tile.dart';
import 'package:share/share.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:tpay/components/animatedHintText.dart';
import 'package:tpay/components/custom/dashboardTile.dart';
import 'package:tpay/components/dashedBorderButton.dart';
import 'package:tpay/screens/others/bankTransfer.dart';
import 'package:tpay/screens/others/billsrecharges.dart';
import 'package:tpay/screens/others/business/business.dart';
import 'package:tpay/screens/others/cibil.dart';
import 'package:tpay/screens/others/payContact.dart';
import 'package:tpay/screens/others/payPhoneNumber.dart';
import 'package:tpay/screens/others/payUPI.dart';
import 'package:tpay/screens/others/paymentcategory/creditcard.dart';
import 'package:tpay/screens/others/paymentcategory/dthrecharge.dart';
import 'package:tpay/screens/others/paymentcategory/electricitybill.dart';
import 'package:tpay/screens/others/paymentcategory/mobileRecharge.dart';
import 'package:tpay/screens/others/payments/chat.dart';
import 'package:tpay/screens/others/payments/managemoney.dart';
import 'package:tpay/screens/others/payments/transactionhistory.dart';
import 'package:tpay/screens/others/profiledetail.dart';
import 'package:tpay/screens/others/scanner.dart';
import 'package:tpay/screens/others/selftransfer.dart';
import 'package:tpay/screens/others/upi_info.dart';
import 'package:tpay/utils/extensions/extension.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class Dashboard extends StatefulWidget {
  const Dashboard({super.key});

  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final TextEditingController _searchController = TextEditingController();
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    setLoaderState();
  }

  void setLoaderState() async {
    await Future.delayed(const Duration(seconds: 3));
    if (mounted) {
      setState(() {
        _loading = false;
      });
    }
  }

  final List<User> users = [
    User(name: 'Alice', avatar: 'assets/images/png/2f41fd.jpg'),
    User(name: 'Bob', avatar: 'assets/images/png/360_F.jpg'),
    User(
      name: 'Charlie',
      avatar: '',
    ),
    User(name: 'David', avatar: 'assets/images/png/close.jpg'),
    User(name: 'Eve', avatar: 'assets/images/png/indian-man.jpg'),
    User(name: 'Frank', avatar: 'assets/images/png/Outdoors.jpg'),
    User(name: 'Grace', avatar: 'assets/images/png/pexels.jpeg'),
    User(name: 'Hannah', avatar: ''),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
          height: 40.0,
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(20.0),
            boxShadow: [
              BoxShadow(color: Colors.grey.shade300, blurRadius: 5.0)
            ],
          ),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.search),
                onPressed: () {},
              ),
              Expanded(
                child: AnimatedHintTextField(
                  controller: _searchController,
                ),
              ),
            ],
          ),
        ),
        backgroundColor: Theme.of(context).cardColor,
        actions: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: GestureDetector(
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const Profiledetail())),
              child: const CircleAvatar(
                radius: 15,
                backgroundColor: Color.fromARGB(255, 240, 240, 240),
                child: Icon(
                  Icons.person,
                  size: 20,
                ),
              ),
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Theme.of(context).cardColor,
                Theme.of(context).cardColor,
                Theme.of(context).cardColor,
              ],
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Stack(
                children: [
                  Container(
                    width: double.infinity,
                    height: 200,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Theme.of(context).cardColor,
                          Theme.of(context).primaryColorDark,
                        ],
                      ),
                    ),
                  ),
                  const DashboardTile()
                ],
              ),
              const SizedBox(height: 10),
              Skeletonizer(
                enabled: _loading,
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(0),
                      topRight: Radius.circular(0),
                    ),
                    color: Theme.of(context).cardColor,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      //Icons List
                      Padding(
                        padding: const EdgeInsets.only(top: 12),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                _buildMenuItem(
                                  Theme.of(context).primaryColor,
                                  Icons.qr_code,
                                  AppLocalizations.of(context)!.scan_QR,
                                  () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => const MyScanner(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  Theme.of(context).primaryColor,
                                  Icons.phone_android,
                                  AppLocalizations.of(context)!.pay_contacts,
                                  () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const PayContact(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  Theme.of(context).primaryColor,
                                  Icons.account_balance,
                                  AppLocalizations.of(context)!.bank_transfer,
                                  () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const Banktransfer(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  Theme.of(context).primaryColor,
                                  Icons.mobile_friendly,
                                  AppLocalizations.of(context)!
                                      .pay_phone_number,
                                  () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const PayPhoneNumber(),
                                      ),
                                    );
                                  },
                                ),
                              ],
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildMenuItem(
                                  Theme.of(context).primaryColor,
                                  Icons.payment_sharp,
                                  AppLocalizations.of(context)!.pay_UPI_ID,
                                  () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => const PayUPI(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  Theme.of(context).primaryColor,
                                  Icons.person,
                                  AppLocalizations.of(context)!.self_transfer,
                                  () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const Selftransfer(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  Theme.of(context).primaryColor,
                                  Icons.credit_score,
                                  AppLocalizations.of(context)!.pay_bills,
                                  () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            const BillsRecharges(),
                                      ),
                                    );
                                  },
                                ),
                                _buildMenuItem(
                                  Theme.of(context).primaryColor,
                                  Icons.send_to_mobile,
                                  AppLocalizations.of(context)!.mobile_recharge,
                                  () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                const MobileRecharge()));
                                  },
                                ),
                              ],
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                DashedBorderButton(
                                  iconData: Icons.add_rounded,
                                  onPressed: () {},
                                  text: AppLocalizations.of(context)!
                                      .activate_UPI_lite,
                                ),
                                const SizedBox(width: 20),
                                DashedBorderButton(
                                  onPressed: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                const UPIInfoWithQR(
                                                  imageUrl:
                                                      'assets/images/png/360_F.jpg',
                                                  name: 'Alex',
                                                  qrData: 'rahulsakth@sbi',
                                                )));
                                  },
                                  text: 'UPI ID: rahulsakth@sbi',
                                )
                              ],
                            ),
                          ],
                        ),
                      ),
                      20.height,
                      Padding(
                        padding: const EdgeInsets.only(left: 15, bottom: 12),
                        child: Text(
                          AppLocalizations.of(context)!.people,
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                      ),
                      10.height,
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 4,
                          crossAxisSpacing: 8.0,
                          mainAxisSpacing: 8.0,
                        ),
                        itemCount: users.length,
                        itemBuilder: (BuildContext context, int index) {
                          return GridTile(
                            child: Column(
                              children: [
                                GestureDetector(
                                  onTap: () {
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => Chart(
                                            imageUrl:
                                                users[index].avatar.toString(),
                                            name: users[index].name.toString(),
                                          ),
                                        ));
                                  },
                                  child: CircleAvatar(
                                    radius: 25,
                                    backgroundImage:
                                        users[index].avatar.isNotEmpty
                                            ? AssetImage(users[index].avatar)
                                            : null,
                                    child: users[index].avatar.isEmpty
                                        ? Text(
                                            users[index].name[0],
                                            style:
                                                const TextStyle(fontSize: 20),
                                          )
                                        : null,
                                  ),
                                ),
                                const SizedBox(height: 8.0),
                                Text(
                                  users[index].name,
                                  style: const TextStyle(fontSize: 12.0),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Padding(
                            padding:
                                const EdgeInsets.only(left: 15, bottom: 12),
                            child: Text(
                              AppLocalizations.of(context)!.bills_and_recharges,
                              style: Theme.of(context).textTheme.labelLarge,
                            ),
                          ),
                          Padding(
                            padding:
                                const EdgeInsets.only(left: 40, bottom: 12),
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                side: BorderSide(
                                    color: Theme.of(context).primaryColor,
                                    width: 1),
                                backgroundColor: Theme.of(context).cardColor,
                                elevation: 0,
                              ),
                              onPressed: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) =>
                                            const BillsRecharges()));
                              },
                              child: Text(
                                AppLocalizations.of(context)!.explore,
                                style: TextStyle(
                                    color: Theme.of(context).primaryColor),
                              ),
                            ),
                          ),
                        ],
                      ),
                      10.height,
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildMenuItem(
                            Theme.of(context).primaryColor,
                            Icons.send_to_mobile,
                            AppLocalizations.of(context)!.mobile_recharge,
                            () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          const MobileRecharge()));
                            },
                          ),
                          _buildMenuItem(
                            Theme.of(context).primaryColor,
                            Icons.credit_card,
                            AppLocalizations.of(context)!.credit_cards,
                            () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          const Creditcard()));
                            },
                          ),
                          _buildMenuItem(
                            Theme.of(context).primaryColor,
                            Icons.tv,
                            AppLocalizations.of(context)!.dth_and_cable,
                            () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          const Dthrecharge()));
                            },
                          ),
                          _buildMenuItem(
                            Theme.of(context).primaryColor,
                            Icons.electric_bolt,
                            AppLocalizations.of(context)!.electricity,
                            () {
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) =>
                                          const ElectricityBill()));
                            },
                          ),
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Padding(
                            padding:
                                const EdgeInsets.only(left: 15, bottom: 12),
                            child: Text(
                              AppLocalizations.of(context)!.businesses,
                              style: Theme.of(context).textTheme.labelLarge,
                            ),
                          ),
                          Padding(
                            padding:
                                const EdgeInsets.only(left: 40, bottom: 12),
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                side: BorderSide(
                                    color: Theme.of(context).primaryColor,
                                    width: 1),
                                backgroundColor: Theme.of(context).cardColor,
                                elevation: 0,
                              ),
                              onPressed: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) =>
                                            const Business()));
                              },
                              child: Text(
                                AppLocalizations.of(context)!.explore,
                                style: TextStyle(
                                    color: Theme.of(context).primaryColor),
                              ),
                            ),
                          ),
                        ],
                      ),
                      10.height,
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 5),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            Column(
                              children: [
                                CircleAvatar(
                                  backgroundImage: AssetImage(
                                      'assets/images/png/redbus.png'),
                                  radius: 25,
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  '    redBus     ',
                                  style: TextStyle(
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            Column(
                              children: [
                                CircleAvatar(
                                  backgroundImage: AssetImage(
                                      'assets/images/png/confirmtlk.png'),
                                  radius: 25,
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  'Confirm Tkt',
                                  style: TextStyle(
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            Column(
                              children: [
                                CircleAvatar(
                                  backgroundImage:
                                      AssetImage('assets/images/png/png.png'),
                                  radius: 25,
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  'MakeMyTrip',
                                  style: TextStyle(
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            Column(
                              children: [
                                CircleAvatar(
                                  backgroundImage: AssetImage(
                                      'assets/images/png/channels4_profile.jpg'),
                                  radius: 25,
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  'InstaMoney',
                                  style: TextStyle(
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                      Padding(
                        padding: const EdgeInsets.only(left: 15, bottom: 12),
                        child: Text(
                          'Offers zone',
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 5),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            const Column(
                              children: [
                                CircleAvatar(
                                  backgroundImage: AssetImage(
                                      'assets/images/png/offers.png'),
                                  radius: 25,
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  'Rewards',
                                  style: TextStyle(
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            const Padding(
                              padding: EdgeInsets.all(8.0),
                              child: Column(
                                children: [
                                  CircleAvatar(
                                    backgroundImage: AssetImage(
                                        'assets/images/png/rewards.png'),
                                    radius: 25,
                                  ),
                                  SizedBox(
                                    height: 5,
                                  ),
                                  Text(
                                    'Offers',
                                    style: TextStyle(
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Column(
                              children: [
                                CircleAvatar(
                                  backgroundImage: AssetImage(
                                      'assets/images/png/referals.png'),
                                  radius: 25,
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  'Refferals',
                                  style: TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                            Column(
                              children: [
                                CircleAvatar(
                                  backgroundColor: Theme.of(context).cardColor,
                                  radius: 25,
                                ),
                                const SizedBox(
                                  height: 5,
                                ),
                                Text(
                                  'InstaMoney',
                                  style: TextStyle(
                                      fontSize: 12,
                                      color: Theme.of(context).cardColor),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                      20.height,
                      Padding(
                        padding: const EdgeInsets.only(left: 15, bottom: 10),
                        child: Text(
                          'Manage your money',
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                      ),
                      _cards(context),
                      GFListTile(
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => const Cibilscore()));
                        },
                        avatar: const Icon(
                          Icons.compass_calibration,
                          size: 25,
                        ),
                        title: const Text(
                          'Check your CIBIL score for \nfree',
                          style: TextStyle(fontSize: 15),
                        ),
                        // subTitle: Column(
                        //   children: [
                        //     const SizedBox(height: 10),
                        //     Container(
                        //       padding: const EdgeInsets.all(5.0),
                        //       decoration: BoxDecoration(
                        //         color: Colors.blue,
                        //         borderRadius: BorderRadius.circular(50),
                        //       ),
                        //       constraints: const BoxConstraints(
                        //         maxWidth: 200,
                        //         maxHeight: 30,
                        //       ),
                        //       alignment: Alignment.topCenter,
                        //       child: const Text(
                        //         'New score available',
                        //         textAlign: TextAlign.center,
                        //         style: TextStyle(
                        //           color: Colors.white, // Text color
                        //           fontSize: 12,
                        //         ),
                        //       ),
                        //     ),
                        //   ],
                        // ),
                        icon: const Icon(
                          Icons.arrow_forward_ios,
                          size: 16,
                        ),
                      ),
                      GFListTile(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const Managemoney(),
                            ),
                          );
                        },
                        avatar: const Icon(
                          Icons.account_balance,
                          size: 25,
                        ),
                        title: const Text(
                          'Check bank balance',
                          style: TextStyle(fontSize: 15),
                        ),
                        icon: const Icon(
                          Icons.arrow_forward_ios,
                          size: 16,
                        ),
                      ),
                      GFListTile(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const TransactionHistory(),
                            ),
                          );
                        },
                        avatar: const Icon(
                          Icons.history,
                          size: 25,
                        ),
                        title: const Text(
                          'See transaction history',
                          style: TextStyle(fontSize: 15),
                        ),
                        icon: const Icon(
                          Icons.arrow_forward_ios,
                          size: 16,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30),
              _buildFooter(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(
      Color color, IconData icon, String label, void Function() onTap) {
    return InkWell(
      onTap: onTap,
      child: SizedBox(
        height: 100,
        width: 80,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 25),
            const SizedBox(height: 8),
            Expanded(
              flex: 0,
              child: Center(
                child: Text(
                  label,
                  style: TextStyle(
                    color: color,
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                  ),
                  textAlign: TextAlign.center,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RichText(
            text: const TextSpan(
              style: TextStyle(fontSize: 14.0, color: Colors.black),
              children: [
                TextSpan(
                  text: 'Invite friends to get ',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
                TextSpan(
                  text: ' र 201',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            '\nInvite friends to Google Pay and get र 201 when your friend sends their first payment. They get र 21.\n',
            style: TextStyle(fontSize: 14),
          ),
          Row(
            children: [
              const Text('Copy your code a5pv9z'),
              IconButton(
                icon: const Icon(Icons.content_copy),
                onPressed: () {
                  Clipboard.setData(const ClipboardData(text: 'a5pv9z'))
                      .then((_) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('copied to clipboard'),
                      ),
                    );
                  });
                },
              ),
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              ElevatedButton(
                onPressed: () {
                  Share.share(
                      'Continue with Torus Pay Invitation code: a5pv9z');
                },
                style: ElevatedButton.styleFrom(
                  elevation: 2,
                  backgroundColor: Theme.of(context).cardColor,
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.horizontal(
                      left: Radius.circular(50),
                      right: Radius.circular(50),
                    ),
                  ),
                ),
                child: Text(
                  'Invite',
                  style: TextStyle(color: Theme.of(context).primaryColorDark),
                ),
              ),
              SizedBox(
                height: 100,
                width: 200,
                child: Image.asset('assets/images/png/invite_bg.png'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class User {
  final String name;
  final String avatar;

  User({required this.name, required this.avatar});
}

Container _cards(BuildContext context) {
  return Container(
    padding: const EdgeInsets.all(16.0),
    child: SizedBox(
      height: 200,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: <Widget>[
          _buildCard(context, 'Get a credit card', Colors.white),
          _buildCard(context, 'Get a loan ', Colors.white),
        ],
      ),
    ),
  );
}

Widget _buildCard(BuildContext context, String title, Color color) {
  return Container(
    width: 300,
    margin: const EdgeInsets.symmetric(horizontal: 8.0),
    child: Card(
      color: color,
      elevation: 5,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Icon(Icons.credit_card_sharp),
                  Text(
                    '₹0 joining fee',
                    style: TextStyle(color: Colors.black),
                  ),
                ],
              ),
            ),
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton(
                onPressed: () {},
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(fontSize: 22, color: Colors.black),
                    ),
                    const Text(
                      'Save up to ₹ 12,000 yearly',
                      style: TextStyle(fontSize: 12, color: Colors.black),
                    ),
                  ],
                ),
              ),
            ),
            Align(
              alignment: Alignment.centerLeft,
              child: TextButton(
                onPressed: () {},
                child: const Text('Apply now'),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
