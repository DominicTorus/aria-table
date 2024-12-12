import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    primaryColor: Colors.blueAccent,
    hintColor: Colors.grey.shade500,
    cardColor: Colors.white,
    iconTheme: const IconThemeData(
      color: Colors.blueAccent,
    ),
    textTheme: const TextTheme(
      labelSmall: TextStyle(
        fontSize: 12.0,
        color: Colors.black,
      ),
      labelMedium: TextStyle(
        fontSize: 14.0,
        color: Colors.black,
      ),
      labelLarge: TextStyle(
        fontSize: 16.0,
        color: Colors.black,
      ),
      titleSmall: TextStyle(
        fontSize: 20.0,
        fontWeight: FontWeight.bold,
        color: Colors.black,
      ),
      titleMedium: TextStyle(
        fontSize: 24.0,
        fontWeight: FontWeight.bold,
        color: Colors.black,
      ),
      titleLarge: TextStyle(
        fontSize: 28.0,
        fontStyle: FontStyle.italic,
        color: Colors.black,
      ),
      displaySmall: TextStyle(
        fontSize: 10.0,
        color: Colors.black,
      ),
      displayLarge: TextStyle(
        fontSize: 72.0,
        color: Colors.black,
      ),
      bodyMedium: TextStyle(
        fontSize: 14.0,
        fontFamily: 'Arial',
        color: Colors.black,
      ),
    ),
    buttonTheme: const ButtonThemeData(
      buttonColor: Colors.blueAccent,
      textTheme: ButtonTextTheme.primary,
      disabledColor: Colors.grey,
    ),
    scaffoldBackgroundColor: Colors.white,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Colors.black,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    primaryColor: Colors.blueAccent,
    hintColor: Colors.grey.shade800,
    cardColor: Colors.black,
    iconTheme: const IconThemeData(
      color: Colors.blueAccent,
    ),
    textTheme: const TextTheme(
      labelSmall: TextStyle(
        fontSize: 12.0,
        color: Colors.white,
      ),
      labelMedium: TextStyle(
        fontSize: 14.0,
        color: Colors.white,
      ),
      labelLarge: TextStyle(
        fontSize: 16.0,
        color: Colors.white,
      ),
      titleSmall: TextStyle(
        fontSize: 20.0,
        color: Colors.white,
      ),
      titleMedium: TextStyle(
        fontSize: 24.0,
        color: Colors.white,
      ),
      titleLarge: TextStyle(
        fontSize: 28.0,
        color: Colors.white,
      ),
      displaySmall: TextStyle(
        fontSize: 10.0,
        color: Colors.white,
      ),
      displayLarge: TextStyle(
        fontSize: 72.0,
        color: Colors.white,
      ),
      bodyMedium:
          TextStyle(fontSize: 14.0, fontFamily: 'Arial', color: Colors.white),
    ),
    buttonTheme: const ButtonThemeData(
      buttonColor: Colors.blueAccent,
      textTheme: ButtonTextTheme.primary,
      disabledColor: Colors.grey,
    ),
    scaffoldBackgroundColor: Colors.black,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.black,
      foregroundColor: Colors.white,
    ),
  );
}
