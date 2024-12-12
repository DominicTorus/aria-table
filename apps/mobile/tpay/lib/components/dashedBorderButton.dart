import 'dart:ui';

import 'package:flutter/material.dart';

class DashedBorderButton extends StatelessWidget {
  final VoidCallback onPressed;
  final String text;
  final IconData? iconData;

  const DashedBorderButton({
    super.key,
    required this.onPressed,
    required this.text,
    this.iconData,
  });

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: DottedBorderPainter(),
      child: Container(
        height: 30,
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(50),
        ),
        child: TextButton(
          style: TextButton.styleFrom(
            backgroundColor: Theme.of(context).cardColor,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(50),
            ),
          ),
          onPressed: onPressed,
          child: Row(
            children: [
              Text(
                text,
                style: Theme.of(context).textTheme.labelSmall,
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
              ),
              iconData != null ? Icon(iconData) : const SizedBox(),
            ],
          ),
        ),
      ),
    );
  }
}

class DottedBorderPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.5;

    const double radius = 50.0;
    const double dotRadius = 1.0;
    const double dotSpacing = 9.0;

    final Path path = Path();
    path.addRRect(RRect.fromLTRBR(
      0,
      0,
      size.width,
      size.height,
      const Radius.circular(radius),
    ));

    final PathMetrics pathMetrics = path.computeMetrics();
    for (PathMetric pathMetric in pathMetrics) {
      final length = pathMetric.length;
      double distance = 0.0;
      while (distance < length) {
        final posTan = pathMetric.getTangentForOffset(distance);
        if (posTan != null) {
          canvas.drawCircle(posTan.position, dotRadius, paint);
        }
        distance += dotSpacing;
      }
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) {
    return false;
  }
}
