import 'dart:convert';
import 'package:flutter/material.dart';
import '../api_client.dart';
import '../theme.dart';
import '../models.dart';
import '../utils.dart';
import '../widgets/common.dart';
import 'post_detail_screen.dart';

const _iconMap = {
  'NEW_POST': Icons.trending_up,
  'NEW_COMMENT': Icons.mode_comment_outlined,
  'NEW_LIKE': Icons.favorite,
  'ACCOUNT_APPROVED': Icons.verified_outlined,
  'ACCOUNT_REJECTED': Icons.cancel_outlined,
};

class NotificationsScreen extends StatefulWidget {
  final Session session;
  const NotificationsScreen({super.key, required this.session});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<AppNotification> items = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);
    final res = await ApiClient.get('/api/notifications');
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      setState(() => items = (data['notifications'] as List).map((e) => AppNotification.fromJson(e)).toList());
    }
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(title: Text('الإشعارات', style: headingFont(size: 15.5))),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _load,
              child: items.isEmpty
                  ? ListView(children: const [
                      EmptyState(icon: Icons.notifications_off_outlined, title: 'لا توجد إشعارات', hint: 'ستصلك هنا كل التحديثات المتعلقة بحسابك ومنشوراتك')
                    ])
                  : ListView.builder(
                      padding: const EdgeInsets.all(14),
                      itemCount: items.length,
                      itemBuilder: (context, i) {
                        final n = items[i];
                        return GestureDetector(
                          onTap: () {
                            if (n.link != null && n.link!.startsWith('/feed/')) {
                              final id = n.link!.replaceFirst('/feed/', '');
                              Navigator.of(context).push(MaterialPageRoute(builder: (_) => PostDetailScreen(postId: id, session: widget.session)));
                            }
                          },
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 10),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              border: Border.all(color: AppColors.border),
                              borderRadius: BorderRadius.circular(13),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 38,
                                  height: 38,
                                  decoration: const BoxDecoration(color: AppColors.goldSoft, shape: BoxShape.circle),
                                  child: Icon(_iconMap[n.type] ?? Icons.notifications_outlined, size: 18, color: AppColors.gold),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(n.title, style: headingFont(size: 13)),
                                      const SizedBox(height: 2),
                                      Text(n.body, style: bodyFont(size: 12, color: AppColors.textDim)),
                                      const SizedBox(height: 4),
                                      Text(timeAgo(n.createdAt), style: bodyFont(size: 10.5, color: AppColors.textDim)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
    );
  }
}
