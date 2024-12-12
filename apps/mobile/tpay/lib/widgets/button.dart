import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final double? width;
  final double? height;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final String buttonText;
  final VoidCallback onPress;
  final IconData? iconData;
  final bool? isCircular;
  final bool disabled;

  const CustomButton({
    super.key,
    this.width,
    this.height,
    this.backgroundColor,
    this.foregroundColor,
    this.iconData,
    this.isCircular,
    required this.buttonText,
    required this.onPress,
    required this.disabled,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: disabled ? null : onPress,
        style: ElevatedButton.styleFrom(
          backgroundColor: disabled ? Colors.grey.shade100 : backgroundColor,
          foregroundColor: disabled ? Colors.black : foregroundColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(
                isCircular == null || isCircular == false ? 8 : 50),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (iconData != null) Icon(iconData, size: 20),
            if (iconData != null) const SizedBox(width: 8),
            Text(
              buttonText,
              style: const TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
