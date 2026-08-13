import 'dart:convert';
import 'package:flutter/material.dart';
import '../api_client.dart';
import '../theme.dart';
import '../models.dart';
import '../utils.dart';
import '../widgets/common.dart';

class AdminScreen extends StatefulWidget {
  final Session session;
  const AdminScreen({super.key, required this.session});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {
  int tab = 0; // 0 pending, 1 users, 2 posts
  List<AdminUser> users = [];
  List<dynamic> posts = [];
  bool loading = false;
  bool showCreate = false;

  final createName = TextEditingController();
  final createEmail = TextEditingController();
  final createPassword = TextEditingController();
  String createRole = 'COACH';
  String? createError;
  bool creating = false;

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  Future<void> _loadUsers() async {
    setState(() => loading = true);
    final res = await ApiClient.get('/api/admin/users');
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      setState(() => users = (data['users'] as List).map((e) => AdminUser.fromJson(e)).toList());
    }
    setState(() => loading = false);
  }

  Future<void> _loadPosts() async {
    setState(() => loading = true);
    final res = await ApiClient.get('/api/posts');
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      setState(() => posts = data['posts'] as List);
    }
    setState(() => loading = false);
  }

  Future<void> _act(String userId, String action, [String? role]) async {
    await ApiClient.patch('/api/admin/users/$userId', {'action': action, if (role != null) 'role': role});
    _loadUsers();
  }

  Future<void> _deletePost(String postId) async {
    await ApiClient.delete('/api/posts/$postId');
    _loadPosts();
  }

  Future<void> _createAccount() async {
    setState(() {
      creating = true;
      createError = null;
    });
    final res = await ApiClient.post('/api/admin/users', {
      'name': createName.text.trim(),
      'email': createEmail.text.trim(),
      'password': createPassword.text,
      'role': createRole,
    });
    final data = jsonDecode(res.body);
    setState(() => creating = false);
    if (res.statusCode != 200) {
      setState(() => createError = data['error'] ?? 'حدث خطأ');
      return;
    }
    createName.clear();
    createEmail.clear();
    createPassword.clear();
    setState(() => showCreate = false);
    _loadUsers();
  }

  @override
  Widget build(BuildContext context) {
    final pending = users.where((u) => u.status == 'PENDING').toList();
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(title: Text('لوحة تحكم الإدارة', style: headingFont(size: 15.5))),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                _tabChip('المنشورات', 2),
                const SizedBox(width: 8),
                _tabChip('المستخدمون', 1),
                const SizedBox(width: 8),
                _tabChip('طلبات معلّقة', 0),
              ],
            ),
          ),
          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : tab == 0
                    ? _pendingTab(pending)
                    : tab == 1
                        ? _usersTab()
                        : _postsTab(),
          ),
        ],
      ),
    );
  }

  Widget _tabChip(String label, int value) {
    final active = tab == value;
    return GestureDetector(
      onTap: () {
        setState(() => tab = value);
        if (value == 2) _loadPosts();
        if (value != 2 && users.isEmpty) _loadUsers();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: active ? AppColors.gold : AppColors.border),
          color: active ? AppColors.goldSoft : Colors.transparent,
        ),
        child: Text(label, style: bodyFont(size: 12, weight: FontWeight.w600, color: active ? AppColors.gold : AppColors.textDim)),
      ),
    );
  }

  Widget _pendingTab(List<AdminUser> pending) {
    if (pending.isEmpty) {
      return const Center(child: EmptyState(icon: Icons.how_to_reg_outlined, title: 'لا توجد طلبات معلّقة', hint: 'ستظهر هنا طلبات التسجيل الجديدة'));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(14),
      itemCount: pending.length,
      itemBuilder: (context, i) {
        final u = pending[i];
        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.surface, border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(13)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(children: [
                Avatar(name: u.name),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [Text(u.name, style: headingFont(size: 13.5)), Text(u.email, style: bodyFont(size: 11.5, color: AppColors.textDim))],
                  ),
                ),
              ]),
              const SizedBox(height: 10),
              Row(children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _act(u.id, 'approve'),
                    style: OutlinedButton.styleFrom(backgroundColor: AppColors.tealSoft, side: BorderSide.none, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(9))),
                    child: Text('قبول', style: headingFont(size: 12.5, color: AppColors.teal)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _act(u.id, 'reject'),
                    style: OutlinedButton.styleFrom(backgroundColor: AppColors.coralSoft, side: BorderSide.none, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(9))),
                    child: Text('رفض', style: headingFont(size: 12.5, color: AppColors.coral)),
                  ),
                ),
              ]),
            ],
          ),
        );
      },
    );
  }

  Widget _usersTab() {
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        if (!showCreate)
          OutlinedButton.icon(
            onPressed: () => setState(() => showCreate = true),
            icon: const Icon(Icons.person_add_alt, color: AppColors.gold, size: 16),
            label: Text('إنشاء حساب مباشرة', style: headingFont(size: 12.5, color: AppColors.gold)),
            style: OutlinedButton.styleFrom(
              backgroundColor: AppColors.goldSoft,
              side: BorderSide(color: AppColors.gold, style: BorderStyle.solid),
              minimumSize: const Size.fromHeight(44),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
            ),
          ),
        if (showCreate)
          Container(
            padding: const EdgeInsets.all(12),
            margin: const EdgeInsets.only(bottom: 14),
            decoration: BoxDecoration(color: AppColors.surface, border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(13)),
            child: Column(
              children: [
                AppField(hint: 'الاسم الكامل', icon: Icons.person_outline, controller: createName),
                AppField(hint: 'البريد الإلكتروني', icon: Icons.mail_outline, controller: createEmail, keyboardType: TextInputType.emailAddress),
                AppField(hint: 'كلمة المرور', icon: Icons.lock_outline, controller: createPassword),
                DropdownButtonFormField<String>(
                  value: createRole,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: AppColors.surface2,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(11), borderSide: BorderSide.none),
                  ),
                  items: roleLabels.entries.map((e) => DropdownMenuItem(value: e.key, child: Text(e.value, style: bodyFont(size: 13)))).toList(),
                  onChanged: (v) => setState(() => createRole = v ?? 'COACH'),
                ),
                if (createError != null) ...[
                  const SizedBox(height: 8),
                  Text(createError!, style: bodyFont(size: 12, color: AppColors.coral)),
                ],
                const SizedBox(height: 10),
                Row(children: [
                  Expanded(child: GoldButton(label: creating ? 'جارٍ الإنشاء...' : 'إنشاء', onPressed: _createAccount, loading: creating)),
                  const SizedBox(width: 8),
                  TextButton(onPressed: () => setState(() => showCreate = false), child: const Text('إلغاء')),
                ]),
              ],
            ),
          ),
        for (final u in users)
          Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: AppColors.surface, border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(13)),
            child: Row(
              children: [
                Avatar(name: u.name),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(u.name, style: headingFont(size: 13.5)),
                      Text('${u.email} · ${statusLabels[u.status] ?? u.status}', style: bodyFont(size: 11, color: AppColors.textDim)),
                    ],
                  ),
                ),
                DropdownButton<String>(
                  value: u.role,
                  underline: const SizedBox(),
                  items: roleLabels.entries.map((e) => DropdownMenuItem(value: e.key, child: Text(e.value, style: bodyFont(size: 12)))).toList(),
                  onChanged: (v) {
                    if (v != null) _act(u.id, 'setRole', v);
                  },
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _postsTab() {
    if (posts.isEmpty) {
      return const Center(child: EmptyState(icon: Icons.article_outlined, title: 'لا توجد منشورات', hint: ''));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(14),
      itemCount: posts.length,
      itemBuilder: (context, i) {
        final p = posts[i];
        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.surface, border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(13)),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p['title'] ?? (p['body'] as String).substring(0, (p['body'] as String).length > 40 ? 40 : (p['body'] as String).length),
                        style: headingFont(size: 13)),
                    Text(p['author']['name'], style: bodyFont(size: 11.5, color: AppColors.textDim)),
                  ],
                ),
              ),
              IconButton(onPressed: () => _deletePost(p['id']), icon: const Icon(Icons.delete_outline, color: AppColors.coral)),
            ],
          ),
        );
      },
    );
  }
}
