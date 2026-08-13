import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const bg = Color(0xFFFAFAFA);
  static const surface = Color(0xFFFFFFFF);
  static const surface2 = Color(0xFFF2F2F2);
  static const border = Color(0xFFDBDBDB);
  static const text = Color(0xFF262626);
  static const textDim = Color(0xFF8E8E8E);
  static const gold = Color(0xFFB8863F);
  static const goldSoft = Color(0x1FB8863F);
  static const teal = Color(0xFF0C9E6E);
  static const tealSoft = Color(0x1A0C9E6E);
  static const coral = Color(0xFFED4956);
  static const coralSoft = Color(0x1AED4956);
  static const amber = Color(0xFFC7801F);
  static const amberSoft = Color(0x1AC7801F);

  static const navy = Color(0xFF0B1F3A);
  static const navyDeep = Color(0xFF081527);
  static const emerald = Color(0xFF17A567);
}

TextStyle headingFont({double size = 15, FontWeight weight = FontWeight.w800, Color? color}) {
  return GoogleFonts.almarai(fontSize: size, fontWeight: weight, color: color ?? AppColors.text);
}

TextStyle bodyFont({double size = 13, FontWeight weight = FontWeight.w400, Color? color}) {
  return GoogleFonts.ibmPlexSansArabic(fontSize: size, fontWeight: weight, color: color ?? AppColors.text);
}

ThemeData buildAppTheme() {
  return ThemeData(
    scaffoldBackgroundColor: AppColors.bg,
    fontFamily: GoogleFonts.ibmPlexSansArabic().fontFamily,
    colorScheme: ColorScheme.fromSeed(seedColor: AppColors.gold, brightness: Brightness.light),
    useMaterial3: true,
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.surface,
      foregroundColor: AppColors.text,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
    ),
  );
}
