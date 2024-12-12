import 'package:flutter/material.dart';

class PaymentScreen extends StatefulWidget {
  final String? upiId;
  const PaymentScreen({super.key, this.upiId});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  double amount = 0.0;
  final TextEditingController _amountController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  String upi = "";

  @override
  void initState() {
    super.initState();
    _amountController.addListener(_updateAmountFromTextField);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
    var uri = Uri.parse(widget.upiId ?? "");
    var upiId = uri.queryParameters['pa'];
    upi = upiId ?? "";
  }

  @override
  void dispose() {
    _amountController.removeListener(_updateAmountFromTextField);
    _amountController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _updateMoney(double newAmount) {
    setState(() {
      amount += newAmount;
    });
  }

  void _updateAmountFromTextField() {
    final text = _amountController.text;
    final newAmount = double.tryParse(text) ?? 0.0;
    setState(() {
      amount = newAmount;
    });
  }

  void _requestFocus() {
    _focusNode.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Stack(
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.vertical,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(
                    height: 150,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              radius: 27,
                              child: CircleAvatar(
                                radius: 25,
                                backgroundImage:
                                    AssetImage('assets/images/png/2f41fd.jpg'),
                              ),
                            ),
                            SizedBox(width: 10),
                            Icon(
                              Icons.arrow_forward,
                            ),
                            SizedBox(width: 10),
                            CircleAvatar(
                              radius: 27,
                              child: CircleAvatar(
                                radius: 25,
                                backgroundImage:
                                    AssetImage('assets/images/png/pexels.jpeg'),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Paying ${upi.isEmpty ? 'via ' : 'to '}",
                            ),
                            upi.isEmpty
                                ? Row(
                                    children: [
                                      const SizedBox(width: 10),
                                      const CircleAvatar(
                                        radius: 10,
                                        backgroundImage: AssetImage(
                                            'assets/images/png/jio.png'),
                                      ),
                                      const SizedBox(width: 10),
                                      Text("prepaid",
                                          style: Theme.of(context)
                                              .textTheme
                                              .labelSmall),
                                    ],
                                  )
                                : Text(
                                    upi,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.w600),
                                  ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  MoneyDisplay(
                    amount: amount,
                    onTap: _requestFocus, // Pass the focus request callback
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 15),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildRoundedBadge(100),
                        const SizedBox(width: 8),
                        _buildRoundedBadge(500),
                        const SizedBox(width: 8),
                        _buildRoundedBadge(1000),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            bottom: -100, // Move the TextField off the visible screen
            child: SizedBox(
              width: 0, // Make it as small as possible
              height: 0,
              child: TextField(
                controller: _amountController,
                focusNode: _focusNode,
                keyboardType:
                    const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Theme.of(context).cardColor,
        child: const Icon(Icons.keyboard_arrow_right),
      ),
    );
  }

  Widget _buildRoundedBadge(double amount) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColorDark,
        borderRadius: BorderRadius.circular(20),
      ),
      child: InkWell(
        onTap: () {
          _updateMoney(amount);
        },
        child: Text(
          '+ ${amount.toInt()}',
          style: const TextStyle(fontSize: 15, color: Colors.white),
        ),
      ),
    );
  }
}

class MoneyDisplay extends StatelessWidget {
  final double amount;
  final VoidCallback onTap; // Add a callback for tapping

  const MoneyDisplay({super.key, required this.amount, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final text = amount > 0 ? '₹${amount.toStringAsFixed(2)}' : '₹0';
    final textWidth = _calculateTextWidth(text, context);
    const minWidth = 200.0;
    final containerWidth = textWidth > minWidth ? textWidth : minWidth;

    return GestureDetector(
      onTap: onTap, // Call the onTap callback when tapped
      child: Column(
        children: [
          Container(
            width: containerWidth,
            padding: const EdgeInsets.only(bottom: 20),
            child: Center(
              child: Text(
                text,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 40.0,
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  double _calculateTextWidth(String text, BuildContext context) {
    final textPainter = TextPainter(
      text: TextSpan(
        text: text,
        style: const TextStyle(fontSize: 50, fontWeight: FontWeight.bold),
      ),
      textDirection: TextDirection.ltr,
      textAlign: TextAlign.center,
    );
    textPainter.layout();
    return textPainter.size.width;
  }
}
