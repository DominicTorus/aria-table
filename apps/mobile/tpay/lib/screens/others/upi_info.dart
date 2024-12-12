import 'dart:io';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share/share.dart';

class UPIInfoWithQR extends StatefulWidget {
  final String imageUrl;
  final String name;
  final String qrData;
  const UPIInfoWithQR(
      {super.key,
      required this.imageUrl,
      required this.name,
      required this.qrData});

  @override
  State<UPIInfoWithQR> createState() => _UPIInfoWithQRState();
}

class _UPIInfoWithQRState extends State<UPIInfoWithQR> {
  Uint8List? _qrImageData;
  void _generateQrImageData() async {
    try {
      final image = await QrPainter(
        data: widget.qrData,
        version: QrVersions.auto,
      ).toImageData(200);

      setState(() {
        _qrImageData = image!.buffer.asUint8List();
      });
    } catch (e) {
      print('Error generating QR code image: $e');
    }
  }

  void _shareQrCode() async {
    _generateQrImageData();
    if (_qrImageData != null) {
      try {
        final tempDir = await getTemporaryDirectory();
        final file = await File('${tempDir.path}/qr_code.png').create();
        await file.writeAsBytes(_qrImageData!);

        await Share.shareFiles(
          [file.path],
          text: 'QR Code generated from: torus.tech',
        );
      } catch (e) {
        print('Error sharing QR code: $e');
      }
    }
  }

  Future<void> downloadImage(String url) async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final filePath = '${directory.path}/downloaded_image.jpg';

      final dio = Dio();
      await dio.download(url, filePath);

      print('Image downloaded to $filePath');
    } catch (e) {
      print('Download failed: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
              onPressed: () async {
                const imageUrl = '';
                await downloadImage(imageUrl);
              },
              icon: const Icon(Icons.download)),
          PopupMenuButton(
            icon: const Icon(Icons.more_vert_outlined),
            onSelected: (dynamic value) {},
            itemBuilder: (BuildContext context) {
              return [
                const PopupMenuItem(
                  value: 3,
                  child: Text("Set Amount"),
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
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircleAvatar(
                      radius: 20,
                      backgroundImage: widget.imageUrl.isNotEmpty
                          ? AssetImage(widget.imageUrl)
                          : null,
                      child: widget.imageUrl.isEmpty
                          ? Text(
                              widget.name[0],
                              style: const TextStyle(fontSize: 20),
                            )
                          : null,
                    ),
                    const SizedBox(width: 10),
                    Text(widget.name),
                  ],
                ),
                const SizedBox(height: 10),
                Center(
                    child: Stack(
                  alignment: Alignment.center,
                  children: <Widget>[
                    widget.qrData.isNotEmpty
                        ? QrImageView(
                            data: widget.qrData,
                            version: QrVersions.auto,
                            backgroundColor: Colors.white,
                            size: 200,
                          )
                        : Text(
                            'No Data Found',
                            style: Theme.of(context).textTheme.labelMedium,
                          ),
                    // Logo
                    Positioned(
                      child: Image.asset(
                        'assets/icons/torus.ico',
                        width: 60,
                        height: 60,
                      ),
                    ),
                  ],
                )),
                const SizedBox(height: 10),
                Text(
                  'Scan to pay with any UPI app',
                  style: Theme.of(context).textTheme.labelMedium,
                ),
              ],
            ),
            const SizedBox(height: 10),
            Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/png/SBI-logo.png',
                      height: 30,
                    ),
                    const SizedBox(width: 10),
                    Text('State Bank of India 6315',
                        style: Theme.of(context).textTheme.labelMedium),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('UPI ID: ',
                        style: TextStyle(color: Colors.black, fontSize: 12)),
                    const Text(
                      'rahulsakthi@sbi',
                      style: TextStyle(color: Color(0xff666666), fontSize: 12),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.content_copy,
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text('UPI ID copied to Clipboard')),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    side: BorderSide(
                        color: Theme.of(context).primaryColor, width: 1),
                    backgroundColor: Theme.of(context).cardColor,
                    shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.horizontal(
                        left: Radius.circular(50),
                        right: Radius.circular(50),
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.qr_code_2,
                      ),
                      const SizedBox(width: 5),
                      Text('Open scanner',
                          style: Theme.of(context).textTheme.labelMedium),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    _shareQrCode();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).primaryColorDark,
                    side: const BorderSide(width: 1),
                    shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.horizontal(
                        left: Radius.circular(50),
                        right: Radius.circular(50),
                      ),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.share,
                      ),
                      const SizedBox(width: 5),
                      Text(
                        'Share QR code',
                        style: Theme.of(context).textTheme.labelMedium,
                      ),
                    ],
                  ),
                )
              ],
            ),
            Column(
              children: [
                const Text(
                  'Powered by',
                  style: TextStyle(fontSize: 8),
                ),
                SizedBox(
                    height: 20,
                    width: 50,
                    child: Image.asset('assets/images/png/upi_logo.png')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
