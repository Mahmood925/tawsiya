import 'package:flutter/material.dart';
import '../api_client.dart';
import '../theme.dart';
import '../widgets/common.dart';
import 'login_screen.dart';

class PendingScreen extends StatelessWidget {
  const PendingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: const BoxDecoration(color: AppColors.amberSoft, shape: BoxShape.circle),
                  child: const Icon(Icons.access_time, color: AppColors.amber, size: 32),
                ),
                const SizedBox(height: 20),
                Text('طلبك قيد المراجعة', style: headingFont(size: 17)),
                const SizedBox(height: 8),
                Text(
                  'تم إرسال طلب التسجيل إلى إدارة المعهد. سيتم إشعارك فور قبول حسابك.',
                  textAlign: TextAlign.center,
                  style: bodyFont(size: 13, color: AppColors.textDim),
                ),
                const SizedBox(height: 26),
                SizedBox(
                  width: double.infinity,
                  child: GoldButton(
                    label: 'رجوع لتسجيل الدخول',
                    onPressed: () async {
                      await ApiClient.clearCookie();
                      if (context.mounted) {
                        Navigator.of(context).pushAndRemoveUntil(
                          MaterialPageRoute(builder: (_) => const LoginScreen()),
                          (route) => false,
                        );
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
