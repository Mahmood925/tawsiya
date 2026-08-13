import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform => android;

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyDEwfuDL77jAfaQN21cA0xfUcYac_7D0H8',
    appId: '1:264290181428:android:0f536e9b9f5594df63c561',
    messagingSenderId: '264290181428',
    projectId: 'tawsiya-fcc92',
    storageBucket: 'tawsiya-fcc92.firebasestorage.app',
  );
}
