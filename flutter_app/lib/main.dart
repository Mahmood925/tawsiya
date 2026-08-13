import 'dart:convert';
import 'package:flutter/material.dart';
import 'api_client.dart';
import 'theme.dart';
import 'models.dart';
import 'widgets/common.dart';
import 'screens/login_screen.dart';
import 'screens/pending_screen.dart';
import 'screens/app_shell.dart';
import 'push_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const TawsiyaApp());
}

class TawsiyaApp extends StatelessWidget {
  const TawsiyaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'توصية',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      locale: const Locale('ar'),
      localizationsDelegates: const [
        DefaultMaterialLocalizations.delegate,
        DefaultWidgetsLocalizations.delegate,
      ],
      builder: (context, child) => Directionality(textDirection: TextDirection.rtl, child: child!),
      home: const SplashGate(),
    );
  }
}

class SplashGate extends StatefulWidget {
  const SplashGate({super.key});
  @override
  State<SplashGate> createState() => _SplashGateState();
}

class _SplashGateState extends State<SplashGate> {
  @override
  void initState() {
    super.initState();
    _check();
  }

  Future<void> _check() async {
    await ApiClient.init();
    if (!ApiClient.isLoggedIn) {
      _go(const LoginScreen());
      return;
    }
    try {
      final res = await ApiClient.get('/api/auth/me');
      if (res.statusCode != 200) {
        await ApiClient.clearCookie();
        _go(const LoginScreen());
        return;
      }
      final session = Session.fromJson(jsonDecode(res.body));
      if (session.status == 'PENDING') {
        _go(const PendingScreen());
      } else if (session.status == 'REJECTED') {
        await ApiClient.clearCookie();
        _go(const LoginScreen());
      } else {
        initPushNotifications();
        _go(AppShell(session: session));
      }
    } catch (_) {
      _go(const LoginScreen());
    }
  }

  void _go(Widget screen) {
    if (!mounted) return;
    Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => screen));
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.bg,
      body: Center(child: LogoMark(size: 64)),
    );
  }
}
