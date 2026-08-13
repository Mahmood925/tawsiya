import 'dart:convert';
import 'package:flutter/material.dart';
import '../api_client.dart';
import '../theme.dart';
import '../models.dart';
import '../utils.dart';
import '../widgets/common.dart';
import 'post_detail_screen.dart';
import 'notifications_screen.dart';

class FeedScreen extends StatefulWidget {
  final Session session;
  const FeedScreen({super.key, required this.session});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  List<Post> posts = [];
  bool loading = true;
  String filter = 'all';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);
    final path = filter == 'all' ? '/api/posts' : '/api/posts?category=$filter';
    final res = await ApiClient.get(path);
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      setState(() {
        posts = (data['posts'] as List).map((e) => Post.fromJson(e)).toList();
      });
    }
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const LogoLockup(mark: 30, word: 17),
              GestureDetector(
                onTap: () => Navigator.of(context)
                    .push(MaterialPageRoute(builder: (_) => NotificationsScreen(session: widget.session))),
                child: const Icon(Icons.favorite_border, color: AppColors.text, size: 23),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              _chip('الكل', 'all'),
              const SizedBox(width: 8),
              _chip('أخبار', 'news'),
              const SizedBox(width: 8),
              _chip('تحليل', 'analysis'),
            ],
          ),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: _load,
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : posts.isEmpty
                    ? ListView(children: const [
                        EmptyState(icon: Icons.trending_up, title: 'لا توجد منشورات بعد', hint: 'ستظهر هنا أحدث التوصيات والتحليلات فور نشرها')
                      ])
                    : ListView.builder(
                        itemCount: posts.length,
                        itemBuilder: (context, i) => _PostCard(
                          post: posts[i],
                          onOpen: () async {
                            await Navigator.of(context)
                                .push(MaterialPageRoute(builder: (_) => PostDetailScreen(postId: posts[i].id, session: widget.session)));
                            _load();
                          },
                        ),
                      ),
          ),
        ),
      ],
    );
  }

  Widget _chip(String label, String value) {
    final active = filter == value;
    return GestureDetector(
      onTap: () {
        setState(() => filter = value);
        _load();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: active ? AppColors.gold : AppColors.border),
          color: active ? AppColors.goldSoft : Colors.transparent,
        ),
        child: Text(label, style: bodyFont(size: 12.5, weight: FontWeight.w600, color: active ? AppColors.gold : AppColors.textDim)),
      ),
    );
  }
}

class _PostCard extends StatefulWidget {
  final Post post;
  final VoidCallback onOpen;
  const _PostCard({required this.post, required this.onOpen});

  @override
  State<_PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<_PostCard> {
  late bool liked = widget.post.likedByMe;
  late int likeCount = widget.post.likeCount;
  bool busy = false;

  Future<void> _toggleLike() async {
    if (busy) return;
    setState(() {
      busy = true;
      liked = !liked;
      likeCount += liked ? 1 : -1;
    });
    final res = await ApiClient.post('/api/posts/${widget.post.id}/like');
    if (res.statusCode != 200) {
      setState(() {
        liked = !liked;
        likeCount += liked ? 1 : -1;
      });
    }
    setState(() => busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final post = widget.post;
    final cover = post.images.isNotEmpty ? post.images.first : null;
    return Container(
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.border))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          InkWell(
            onTap: widget.onOpen,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: Row(
                children: [
                  Avatar(name: post.author.name, size: 32),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Row(
                      children: [
                        Flexible(
                          child: Text(post.author.name, style: headingFont(size: 13), overflow: TextOverflow.ellipsis),
                        ),
                        const SizedBox(width: 4),
                        Text('· ${timeAgo(post.createdAt)}', style: bodyFont(size: 11, color: AppColors.textDim)),
                      ],
                    ),
                  ),
                  TypeBadge(category: post.category),
                ],
              ),
            ),
          ),
          if (cover != null)
            GestureDetector(
              onTap: widget.onOpen,
              child: AspectRatio(
                aspectRatio: 1,
                child: Image.network(cover.url, fit: BoxFit.cover),
              ),
            ),
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 8, 14, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    GestureDetector(
                      onTap: _toggleLike,
                      child: Row(
                        children: [
                          Icon(liked ? Icons.favorite : Icons.favorite_border, size: 20, color: liked ? AppColors.coral : AppColors.text),
                          const SizedBox(width: 5),
                          Text('$likeCount', style: bodyFont(size: 12.5, color: AppColors.textDim)),
                        ],
                      ),
                    ),
                    const SizedBox(width: 14),
                    GestureDetector(
                      onTap: widget.onOpen,
                      child: Row(
                        children: [
                          const Icon(Icons.mode_comment_outlined, size: 19, color: AppColors.textDim),
                          const SizedBox(width: 5),
                          Text('${post.commentCount}', style: bodyFont(size: 12.5, color: AppColors.textDim)),
                        ],
                      ),
                    ),
                  ],
                ),
                if (post.title != null) ...[
                  const SizedBox(height: 6),
                  Text(post.title!, style: headingFont(size: 13.5)),
                ],
                const SizedBox(height: 3),
                RichText(
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  text: TextSpan(
                    children: [
                      TextSpan(text: '${post.author.name} ', style: headingFont(size: 13)),
                      TextSpan(text: post.body, style: bodyFont(size: 13, color: AppColors.textDim)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
