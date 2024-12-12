import 'package:flutter/material.dart';

class LanguageProvider with ChangeNotifier {
  Locale _locale;

  LanguageProvider(this._locale);

  Locale get locale => _locale;

  void setLocale(Locale newLocale) {
    if (_locale != newLocale) {
      _locale = newLocale;
      notifyListeners();
    }
  }
}
