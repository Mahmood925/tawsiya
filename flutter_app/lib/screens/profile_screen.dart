import 'package:flutter/material.dart';
import '../api_client.dart';
import '../theme.dart';
import '../models.dart';
import '../utils.dart';
import '../widgets/common.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  final Session session;
  const ProfileScreen({super.key, required this.session});

  Future<void> _logout(BuildContext context) async {
    await ApiClient.post('/api/auth/logout');
    await ApiClient.clearCookie();
    if (context.mounted) {
      Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (_) => const LoginScreen()), (route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(title: Text('الملف الشخصي', style: headingFont(size: 15.5))),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 20),
              Avatar(name: session.name, size: 80),
              const SizedBox(height: 14),
              Text(session.name, style: headingFont(size: 17)),
              const SizedBox(height: 4),
              Text(roleLabels[session.role] ?? session.role, style: bodyFont(size: 12.5, color: AppColors.textDim)),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                height: 46,
                child: ElevatedButton.icon(
                  onPressed: () => _logout(context),
                  icon: const Icon(Icons.logout, size: 18, color: AppColors.coral),
                  label: Text('تسجيل الخروج', style: headingFont(size: 13, color: AppColors.coral)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.coralSoft,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
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
