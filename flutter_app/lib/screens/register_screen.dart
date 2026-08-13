import 'dart:convert';
import 'package:flutter/material.dart';
import '../api_client.dart';
import '../theme.dart';
import '../widgets/common.dart';
import 'pending_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final name = TextEditingController();
  final phone = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  final confirm = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> _submit() async {
    if (password.text != confirm.text) {
      setState(() => error = 'كلمتا المرور غير متطابقتين');
      return;
    }
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final res = await ApiClient.post('/api/auth/register', {
        'name': name.text.trim(),
        'phone': phone.text.trim(),
        'email': email.text.trim(),
        'password': password.text,
      });
      final data = jsonDecode(res.body);
      if (res.statusCode != 200 && res.statusCode != 201) {
        setState(() => error = data['error'] ?? 'حدث خطأ');
        return;
      }
      if (!mounted) return;
      Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (_) => const PendingScreen()));
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
      appBar: AppBar(title: Text('إنشاء حساب', style: headingFont(size: 15.5))),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              AppField(hint: 'الاسم الكامل', icon: Icons.person_outline, controller: name),
              AppField(hint: 'رقم الهاتف', icon: Icons.phone_outlined, controller: phone, keyboardType: TextInputType.phone),
              AppField(hint: 'البريد الإلكتروني', icon: Icons.mail_outline, controller: email, keyboardType: TextInputType.emailAddress),
              AppField(hint: 'كلمة المرور', icon: Icons.lock_outline, controller: password, obscure: true),
              AppField(hint: 'تأكيد كلمة المرور', icon: Icons.lock_outline, controller: confirm, obscure: true),
              if (error != null) ...[
                Align(
                  alignment: Alignment.centerRight,
                  child: Text(error!, style: bodyFont(size: 12.5, color: AppColors.coral)),
                ),
                const SizedBox(height: 8),
              ],
              GoldButton(label: loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب', onPressed: _submit, loading: loading),
            ],
          ),
        ),
      ),
    );
  }
}
