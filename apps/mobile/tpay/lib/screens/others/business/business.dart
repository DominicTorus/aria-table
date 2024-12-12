import 'package:flutter/material.dart';

class Business extends StatefulWidget {
  const Business({super.key});

  @override
  State<Business> createState() => _BusinessState();
}

class _BusinessState extends State<Business> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business'),
        actions: [
          PopupMenuButton<int>(
            icon: const Icon(Icons.more_vert_outlined),
            onSelected: (int value) {
              switch (value) {
                case 1:
                  break;
                case 2:
                  break;
              }
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Trending',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 250,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildTrendingCard('assets/images/png/railway6.jpg'),
                  _buildTrendingCard('assets/images/png/midnight.jpg'),
                  _buildTrendingCard('assets/images/png/loanbusiness.jpg'),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Card(
              color: Colors.grey.shade200,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 10),
                  ListTile(
                    leading: const CircleAvatar(
                      backgroundImage:
                          AssetImage('assets/images/png/unnamed.png'),
                      radius: 20,
                    ),
                    title: const Text('5Paisa'),
                    subtitle: const Text('Stock market trading'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {},
                  ),
                  ListTile(
                    leading: const CircleAvatar(
                      backgroundImage:
                          AssetImage('assets/images/png/redbus.png'),
                      radius: 20,
                    ),
                    title: const Text('redBus'),
                    subtitle: const Text('Bus rides through India'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Handle notifications tap
                    },
                  ),
                  ListTile(
                    leading: const CircleAvatar(
                      backgroundImage:
                          AssetImage('assets/images/png/confirmtlk.png'),
                      radius: 20,
                    ),
                    title: const Text('Confirm Tkt'),
                    subtitle: const Text('IRCTC TKT confirmation'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Handle security tap
                    },
                  ),
                  ListTile(
                    leading: const CircleAvatar(
                      backgroundImage: AssetImage('assets/images/png/png.png'),
                      radius: 20,
                    ),
                    title: const Text('MakeMyTrip'),
                    subtitle: const Text('Travel in india and abroad'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Handle help & support tap
                    },
                  ),
                  ListTile(
                    leading: const CircleAvatar(
                      backgroundImage:
                          AssetImage('assets/images/png/channels4_profile.jpg'),
                      radius: 20,
                    ),
                    title: const Text('InstaMoney'),
                    subtitle: const Text('Go digital Go InstaMoney'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Handle help & support tap
                    },
                  ),
                  ListTile(
                    leading: const CircleAvatar(
                      backgroundImage:
                          AssetImage('assets/images/png/digit-insurance.png'),
                      radius: 20,
                    ),
                    title: const Text('Digit Insurance'),
                    subtitle: const Text('Best insurance online'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      // Handle help & support tap
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrendingCard(String imagePath) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8.0),
      child: Card(
        child: Image.asset(
          imagePath,
          fit: BoxFit.cover,
          width: 260,
        ),
      ),
    );
  }
}
