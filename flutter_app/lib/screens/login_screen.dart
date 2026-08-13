import 'dart:convert';
import 'package:flutter/material.dart';
import '../api_client.dart';
import '../theme.dart';
import '../models.dart';
import '../widgets/common.dart';
import 'register_screen.dart';
import 'pending_screen.dart';
import 'app_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController();
  final password = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> _submit() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final res = await ApiClient.post('/api/auth/login', {
        'email': email.text.trim(),
        'password': password.text,
      });
      final data = jsonDecode(res.body);
      if (res.statusCode != 200) {
        if (data['status'] == 'PENDING') {
          if (!mounted) return;
          Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const PendingScreen()));
          return;
        }
        setState(() => error = data['error'] ?? 'حدث خطأ');
        return;
      }
      final meRes = await ApiClient.get('/api/auth/me');
      final session = Session.fromJson(jsonDecode(meRes.body));
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => AppShell(session: session)));
    } catch (_) {
      setState(() => error = 'تعذّر الاتصال بالخادم');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
          child: Column(
            children: [
              const SizedBox(height: 20),
              const LogoMark(size: 60),
              const SizedBox(height: 16),
              Text('مرحباً بعودتك', style: headingFont(size: 20)),
              const SizedBox(height: 5),
              Text('سجّل دخولك لمتابعة التوصيات والتحليلات',
                  style: bodyFont(size: 12.5, color: AppColors.textDim)),
              const SizedBox(height: 28),
              AppField(hint: 'البريد الإلكتروني', icon: Icons.mail_outline, controller: email, keyboardType: TextInputType.emailAddress),
              AppField(hint: 'كلمة المرور', icon: Icons.lock_outline, controller: password, obscure: true),
              if (error != null) ...[
                const SizedBox(height: 4),
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(error!, style: bodyFont(size: 12.5, color: AppColors.coral)),
                ),
              ],
              const SizedBox(height: 12),
              GoldButton(label: loading ? 'جارٍ الدخول...' : 'تسجيل الدخول', onPressed: _submit, loading: loading),
              const SizedBox(height: 20),
              GestureDetector(
                onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const RegisterScreen())),
                child: RichText(
                  text: TextSpan(
                    style: bodyFont(size: 12.5, color: AppColors.textDim),
                    children: [
                      const TextSpan(text: 'ليس لديك حساب؟ '),
                      TextSpan(text: 'سجل الآن', style: headingFont(size: 12.5, color: AppColors.gold)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
