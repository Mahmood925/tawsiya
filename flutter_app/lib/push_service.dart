import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';
import 'api_client.dart';

Future<void> initPushNotifications() async {
  try {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    final messaging = FirebaseMessaging.instance;

    final settings = await messaging.requestPermission(alert: true, badge: true, sound: true);
    if (settings.authorizationStatus != AuthorizationStatus.authorized &&
        settings.authorizationStatus != AuthorizationStatus.provisional) {
      return;
    }

    final token = await messaging.getToken();
    if (token != null) {
      await _registerToken(token);
    }
    FirebaseMessaging.instance.onTokenRefresh.listen(_registerToken);
  } catch (_) {
    // Push notifications are best-effort; never block app startup on failure.
  }
}

Future<void> _registerToken(String token) async {
  if (!ApiClient.isLoggedIn) return;
  await ApiClient.post('/api/push/register-fcm', {'token': token});
}
