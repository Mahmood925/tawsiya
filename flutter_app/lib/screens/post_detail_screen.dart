import 'dart:convert';
import 'package:flutter/material.dart';
import '../api_client.dart';
import '../theme.dart';
import '../models.dart';
import '../utils.dart';
import '../widgets/common.dart';

class PostDetailScreen extends StatefulWidget {
  final String postId;
  final Session session;
  const PostDetailScreen({super.key, required this.postId, required this.session});

  @override
  State<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends State<PostDetailScreen> {
  Post? post;
  bool loading = true;
  bool liked = false;
  int likeCount = 0;
  final commentController = TextEditingController();
  bool sending = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final res = await ApiClient.get('/api/posts/${widget.postId}');
    if (res.statusCode == 200) {
      final p = Post.fromJson(jsonDecode(res.body));
      setState(() {
        post = p;
        liked = p.likedByMe;
        likeCount = p.likeCount;
        loading = false;
      });
    } else {
      setState(() => loading = false);
    }
  }

  Future<void> _toggleLike() async {
    setState(() {
      liked = !liked;
      likeCount += liked ? 1 : -1;
    });
    await ApiClient.post('/api/posts/${widget.postId}/like');
  }

  Future<void> _sendComment() async {
    final text = commentController.text.trim();
    if (text.isEmpty || sending) return;
    setState(() => sending = true);
    final res = await ApiClient.post('/api/posts/${widget.postId}/comments', {'text': text});
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      setState(() {
        post!.comments.add(CommentItem.fromJson(data['comment']));
        commentController.clear();
      });
    }
    setState(() => sending = false);
  }

  Future<void> _deletePost() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('حذف المنشور'),
        content: const Text('هل أنت متأكد من حذف هذا المنشور؟'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('إلغاء')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('حذف', style: TextStyle(color: AppColors.coral))),
        ],
      ),
    );
    if (confirmed == true) {
      await ApiClient.delete('/api/posts/${widget.postId}');
      if (mounted) Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        title: Text('المنشور', style: headingFont(size: 15.5)),
        actions: [
          if (widget.session.isAdmin && post != null)
            IconButton(onPressed: _deletePost, icon: const Icon(Icons.delete_outline, color: AppColors.coral)),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : post == null
              ? const Center(child: Text('المنشور غير موجود'))
              : Column(
                  children: [
                    Expanded(
                      child: ListView(
                        padding: EdgeInsets.zero,
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            child: Row(
                              children: [
                                Avatar(name: post!.author.name, size: 32),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(post!.author.name, style: headingFont(size: 13)),
                                      Text(timeAgo(post!.createdAt), style: bodyFont(size: 11, color: AppColors.textDim)),
                                    ],
                                  ),
                                ),
                                TypeBadge(category: post!.category),
                              ],
                            ),
                          ),
                          for (final img in post!.images)
                            AspectRatio(aspectRatio: 1, child: Image.network(img.url, fit: BoxFit.cover)),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                GestureDetector(
                                  onTap: _toggleLike,
                                  child: Row(
                                    children: [
                                      Icon(liked ? Icons.favorite : Icons.favorite_border, size: 22, color: liked ? AppColors.coral : AppColors.text),
                                      const SizedBox(width: 6),
                                      Text('$likeCount', style: bodyFont(size: 12.5, color: AppColors.textDim)),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 10),
                                if (post!.title != null) ...[
                                  Text(post!.title!, style: headingFont(size: 15)),
                                  const SizedBox(height: 4),
                                ],
                                RichText(
                                  text: TextSpan(
                                    children: [
                                      TextSpan(text: '${post!.author.name} ', style: headingFont(size: 13)),
                                      TextSpan(text: post!.body, style: bodyFont(size: 13, color: AppColors.text)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Divider(height: 1, color: AppColors.border),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                for (final c in post!.comments)
                                  Padding(
                                    padding: const EdgeInsets.only(bottom: 10),
                                    child: RichText(
                                      text: TextSpan(
                                        children: [
                                          TextSpan(
                                            text: '${c.user.name} ',
                                            style: headingFont(size: 13, color: c.user.id == post!.author.id ? AppColors.gold : AppColors.text),
                                          ),
                                          TextSpan(text: c.text, style: bodyFont(size: 13, color: AppColors.text)),
                                        ],
                                      ),
                                    ),
                                  ),
                                if (post!.comments.isEmpty)
                                  Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 20),
                                    child: Center(child: Text('لا توجد تعليقات بعد', style: bodyFont(size: 12.5, color: AppColors.textDim))),
                                  ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 70),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: const BoxDecoration(color: AppColors.surface, border: Border(top: BorderSide(color: AppColors.border))),
                      child: SafeArea(
                        top: false,
                        child: Row(
                          children: [
                            IconButton(
                              onPressed: _sendComment,
                              icon: Icon(Icons.send, color: commentController.text.trim().isEmpty ? AppColors.textDim : AppColors.gold),
                            ),
                            Expanded(
                              child: TextField(
                                controller: commentController,
                                onChanged: (_) => setState(() {}),
                                textAlign: TextAlign.right,
                                style: bodyFont(size: 13),
                                decoration: InputDecoration(
                                  hintText: 'اكتب تعليقاً...',
                                  hintStyle: bodyFont(size: 13, color: AppColors.textDim),
                                  filled: true,
                                  fillColor: AppColors.surface2,
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
    );
  }
}
