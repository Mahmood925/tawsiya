import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String base = 'https://tawsiya-oman.vercel.app';
  static String? _cookie;

  static Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _cookie = prefs.getString('session_cookie');
  }

  static Future<void> _saveCookie(http.Response res) async {
    final setCookie = res.headers['set-cookie'];
    if (setCookie != null) {
      _cookie = setCookie.split(';').first;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('session_cookie', _cookie!);
    }
  }

  static Future<void> clearCookie() async {
    _cookie = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('session_cookie');
  }

  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_cookie != null) 'Cookie': _cookie!,
      };

  static Map<String, String> get _plainHeaders => {
        if (_cookie != null) 'Cookie': _cookie!,
      };

  static Future<http.Response> get(String path) async {
    final res = await http.get(Uri.parse('$base$path'), headers: _plainHeaders);
    return res;
  }

  static Future<http.Response> post(String path, [Map<String, dynamic>? body]) async {
    final res = await http.post(Uri.parse('$base$path'), headers: _headers, body: body != null ? jsonEncode(body) : null);
    await _saveCookie(res);
    return res;
  }

  static Future<http.Response> patch(String path, Map<String, dynamic> body) async {
    final res = await http.patch(Uri.parse('$base$path'), headers: _headers, body: jsonEncode(body));
    return res;
  }

  static Future<http.Response> delete(String path) async {
    final res = await http.delete(Uri.parse('$base$path'), headers: _plainHeaders);
    return res;
  }

  static Future<http.StreamedResponse> multipart(
    String path,
    Map<String, String> fields,
    List<http.MultipartFile> files,
  ) async {
    final req = http.MultipartRequest('POST', Uri.parse('$base$path'));
    req.headers.addAll(_plainHeaders);
    req.fields.addAll(fields);
    req.files.addAll(files);
    return req.send();
  }

  static bool get isLoggedIn => _cookie != null;
}
