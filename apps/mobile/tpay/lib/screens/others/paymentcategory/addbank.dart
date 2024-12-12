import 'package:flutter/material.dart';

class AddBank extends StatefulWidget {
  const AddBank({super.key});

  @override
  State<AddBank> createState() => _AddBankState();
}

class _AddBankState extends State<AddBank> {
  void _onMenuSelected(int value) {
    switch (value) {
      case 1:
        // Handle refresh action
        break;
      case 2:
        // Handle get help action
        break;
      case 3:
        // Handle send feedback action
        break;
      default:
        break;
    }
  }

  Widget _buildIconWithText(String text, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8.0),
          child: CustomPaint(
            painter: DashedBorderPainter(
              color: Colors.blueAccent,
              dashWidth: 4.0,
              dashSpace: 4.0,
            ),
            child: Container(
              width: 80,
              height: 80,
              child: Icon(
                icon,
                size: 40,
                color: Colors.blueAccent,
              ),
            ),
          ),
        ),
        SizedBox(width: 10),
        Text(
          text,
          style: Theme.of(context).textTheme.bodyLarge,
        ),
      ],
    );
  }

  Widget _buildMenuItem(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: Colors.blueAccent),
      title: Text(title),
      onTap: onTap,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Bank'),
        actions: [
          PopupMenuButton<int>(
            icon: const Icon(Icons.more_vert_outlined),
            onSelected: _onMenuSelected,
            itemBuilder: (BuildContext context) {
              return [
                const PopupMenuItem(
                  value: 1,
                  child: Text("Refresh"),
                ),
                const PopupMenuItem(
                  value: 2,
                  child: Text("Get help"),
                ),
                const PopupMenuItem(
                  value: 3,
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
            SizedBox(height: 20),
            _buildIconWithText("Add Bank", Icons.account_balance),
            _buildIconWithText("Add Credit/Debit Card", Icons.credit_card),
            _buildIconWithText("Set Up UPI Lite", Icons.add),
            SizedBox(height: 20),
            Column(
              children: [],
            ),
          ],
        ),
      ),
    );
  }
}

class DashedBorderPainter extends CustomPainter {
  final Color color;
  final double dashWidth;
  final double dashSpace;

  DashedBorderPainter({
    required this.color,
    required this.dashWidth,
    required this.dashSpace,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    final dashPath = Path();
    final width = size.width;
    final height = size.height;
    final dashCount = (width / (dashWidth + dashSpace)).floor();

    for (int i = 0; i < dashCount; i++) {
      double startX = i * (dashWidth + dashSpace);
      double endX = startX + dashWidth;
      dashPath.moveTo(startX, 0);
      dashPath.lineTo(endX, 0);
      dashPath.moveTo(startX, height);
      dashPath.lineTo(endX, height);
      dashPath.moveTo(0, startX);
      dashPath.lineTo(0, endX);
      dashPath.moveTo(width, startX);
      dashPath.lineTo(width, endX);
    }

    canvas.drawPath(dashPath, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
