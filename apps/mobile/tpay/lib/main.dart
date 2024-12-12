import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:get/get_navigation/src/root/get_material_app.dart';
import 'package:provider/provider.dart';
import 'package:tpay/providers/dependemcyInjection.dart';
import 'package:tpay/providers/themeProvider.dart';
import 'package:tpay/providers/languageProvider.dart';
import 'package:tpay/screens/others/dashboard.dart';
import 'package:tpay/screens/spalash/spalashScreen.dart';
import 'package:tpay/themes/theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  DependencyInjection.init();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<ThemeProvider>(
          create: (_) => ThemeProvider(AppTheme.lightTheme),
        ),
        ChangeNotifierProvider<LanguageProvider>(
          create: (_) => LanguageProvider(
            const Locale('en'),
          ),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, _) {
        return Consumer<LanguageProvider>(
          builder: (context, languageProvider, _) {
            print(languageProvider.locale);
            return GetMaterialApp(
              debugShowCheckedModeBanner: false,
              title: 'Torus Pay',
              theme: themeProvider.getTheme(),
              locale: languageProvider.locale,
              localizationsDelegates: const [
                AppLocalizations.delegate,
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              supportedLocales: const [
                Locale('en'),
                Locale('es'),
                Locale('ar'),
              ],
              routes: {
                '/dashboard': (context) => const Dashboard(),
              },
              home: const Spalashscreen(),
            );
          },
        );
      },
    );
  }
}
