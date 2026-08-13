import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import '../api_client.dart';
import '../theme.dart';
import '../models.dart';
import '../widgets/common.dart';

class NewPostScreen extends StatefulWidget {
  final Session session;
  const NewPostScreen({super.key, required this.session});

  @override
  State<NewPostScreen> createState() => _NewPostScreenState();
}

class _NewPostScreenState extends State<NewPostScreen> {
  String category = 'analysis';
  final title = TextEditingController();
  final body = TextEditingController();
  final images = <XFile>[];
  bool loading = false;
  String? error;

  Future<void> _pickImages() async {
    if (images.length >= 4) return;
    final picked = await ImagePicker().pickMultiImage(limit: 4 - images.length);
    setState(() => images.addAll(picked));
  }

  Future<void> _submit() async {
    if (body.text.trim().isEmpty) {
      setState(() => error = 'نص المنشور مطلوب');
      return;
    }
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final files = <http.MultipartFile>[];
      for (final img in images) {
        files.add(await http.MultipartFile.fromPath('images', img.path));
      }
      final streamed = await ApiClient.multipart(
        '/api/posts',
        {
          'category': category,
          'title': title.text.trim(),
          'body': body.text.trim(),
        },
        files,
      );
      final res = await http.Response.fromStream(streamed);
      if (res.statusCode != 200) {
        final data = jsonDecode(res.body);
        setState(() => error = data['error'] ?? 'حدث خطأ');
        return;
      }
      if (mounted) Navigator.of(context).pop(true);
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
      appBar: AppBar(title: Text('منشور جديد', style: headingFont(size: 15.5))),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Align(
                alignment: Alignment.centerRight,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _categoryChip('تحليل', 'analysis'),
                    const SizedBox(width: 8),
                    _categoryChip('خبر', 'news'),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              AppField(hint: 'عنوان (اختياري)', icon: Icons.title, controller: title),
              TextField(
                controller: body,
                maxLines: 6,
                textAlign: TextAlign.right,
                style: bodyFont(size: 13.5),
                decoration: InputDecoration(
                  hintText: 'اكتب نص المنشور...',
                  hintStyle: bodyFont(size: 13, color: AppColors.textDim),
                  filled: true,
                  fillColor: AppColors.surface2,
                  contentPadding: const EdgeInsets.all(14),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(11), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 14),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  for (final img in images)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.file(File(img.path), width: 72, height: 72, fit: BoxFit.cover),
                    ),
                  if (images.length < 4)
                    GestureDetector(
                      onTap: _pickImages,
                      child: Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          border: Border.all(color: AppColors.border),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.add_photo_alternate_outlined, color: AppColors.textDim),
                      ),
                    ),
                ],
              ),
              if (error != null) ...[
                const SizedBox(height: 12),
                Text(error!, style: bodyFont(size: 12.5, color: AppColors.coral)),
              ],
              const SizedBox(height: 18),
              GoldButton(label: loading ? 'جارٍ النشر...' : 'نشر', onPressed: _submit, loading: loading),
            ],
          ),
        ),
      ),
    );
  }

  Widget _categoryChip(String label, String value) {
    final active = category == value;
    return GestureDetector(
      onTap: () => setState(() => category = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: active ? AppColors.gold : AppColors.border),
          color: active ? AppColors.goldSoft : Colors.transparent,
        ),
        child: Text(label, style: bodyFont(size: 12.5, weight: FontWeight.w700, color: active ? AppColors.gold : AppColors.textDim)),
      ),
    );
  }
}
