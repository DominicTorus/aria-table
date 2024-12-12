import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:tpay/screens/others/payments/pay.dart';

class MyScanner extends StatefulWidget {
  const MyScanner({super.key});

  @override
  State<MyScanner> createState() => _MyScannerState();
}

class _MyScannerState extends State<MyScanner> {
  String scannedData = "Scan a code";
  late QRViewController controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

  @override
  void initState() {
    super.initState();
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });

    controller.scannedDataStream.listen((scanData) {
      if (scanData.code != null && scanData.code!.isNotEmpty) {
        controller.pauseCamera();
        setState(() {
          scannedData = scanData.code!;
        });

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PaymentScreen(
              upiId: scannedData.toString(),
            ),
          ),
        ).then((_) {
          controller.resumeCamera();
        });
      }
    });
  }

  Future<void> scanQR() async {
    try {
      await controller.toggleFlash();
    } catch (e) {
      print('Error toggling flash: $e');
    }
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    print(scannedData);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan and Pay'),
      ),
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          QRView(
            key: qrKey,
            onQRViewCreated: _onQRViewCreated,
            overlay: QrScannerOverlayShape(
              borderColor: Colors.red,
              borderRadius: 10,
              borderLength: 30,
              borderWidth: 10,
              cutOutSize: 300,
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: SizedBox(
                width: 40,
                height: 40,
                child: FloatingActionButton(
                  backgroundColor: Colors.black54,
                  onPressed: scanQR,
                  child: const Icon(Icons.flash_on, color: Colors.white),
                ),
              ),
            ),
          ),
          // Center(
          //   child: Text(
          //     scannedData,
          //     style: const TextStyle(fontSize: 20, color: Colors.white),
          //     textAlign: TextAlign.center,
          //   ),
          // ),
        ],
      ),
    );
  }
}
