import 'package:another_flutter_splash_screen/another_flutter_splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:tpay/screens/auth/newRegistration.dart';
import 'package:tpay/screens/others/dashboard.dart';

class Spalashscreen extends StatelessWidget {
  const Spalashscreen({super.key});

  @override
  Widget build(BuildContext context) {
    return FlutterSplashScreen.gif(
      useImmersiveMode: true,
      gifPath: 'assets/icons/torus.ico',
      gifWidth: 180,
      gifHeight: 474,
      backgroundColor: Theme.of(context).cardColor,
      duration: const Duration(milliseconds: 3000),
      onEnd: () {
        Navigator.of(context).pushReplacement(
          FadePageRoute(page: const Dashboard()),
        );
      },
    );
  }
}

class FadePageRoute<T> extends PageRouteBuilder<T> {
  final Widget page;

  FadePageRoute({required this.page})
      : super(
          pageBuilder: (BuildContext context, Animation<double> animation,
              Animation<double> secondaryAnimation) {
            return page;
          },
          transitionsBuilder: (BuildContext context,
              Animation<double> animation,
              Animation<double> secondaryAnimation,
              Widget child) {
            const begin = Offset(0.0, 0.0);
            const end = Offset.zero;
            const curve = Curves.easeIn;

            var tween = Tween(begin: begin, end: end);
            animation.drive(tween.chain(CurveTween(curve: curve)));

            return FadeTransition(opacity: animation, child: child);
          },
        );
}
