import 'package:flutter/material.dart';
import 'package:tpay/themes/theme.dart';

class ThemeProvider extends ChangeNotifier {
  ThemeData _themeData;

  ThemeProvider(this._themeData);

  ThemeData getTheme() => _themeData;

  void setTheme(ThemeData themeData) {
    _themeData = themeData;
    notifyListeners();
  }

  void toggleTheme() {
    _themeData = _themeData.brightness == Brightness.light
        ? AppTheme.darkTheme
        : AppTheme.lightTheme;
    notifyListeners();
  }
}
