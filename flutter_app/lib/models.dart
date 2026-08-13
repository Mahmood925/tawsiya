class Session {
  final String id;
  final String name;
  final String role; // USER, COACH, ADMIN
  final String status; // PENDING, APPROVED, REJECTED

  Session({required this.id, required this.name, required this.role, required this.status});

  factory Session.fromJson(Map<String, dynamic> json) => Session(
        id: json['id'],
        name: json['name'],
        role: json['role'],
        status: json['status'],
      );

  bool get canPost => role == 'COACH' || role == 'ADMIN';
  bool get isAdmin => role == 'ADMIN';
}

class PostImage {
  final String id;
  final String url;
  PostImage({required this.id, required this.url});
  factory PostImage.fromJson(Map<String, dynamic> json) => PostImage(id: json['id'], url: json['url']);
}

class PostAuthor {
  final String id;
  final String name;
  PostAuthor({required this.id, required this.name});
  factory PostAuthor.fromJson(Map<String, dynamic> json) => PostAuthor(id: json['id'], name: json['name']);
}

class CommentItem {
  final String id;
  final String text;
  final PostAuthor user;
  CommentItem({required this.id, required this.text, required this.user});
  factory CommentItem.fromJson(Map<String, dynamic> json) =>
      CommentItem(id: json['id'], text: json['text'], user: PostAuthor.fromJson(json['user']));
}

class Post {
  final String id;
  final String category;
  final String? title;
  final String body;
  final String createdAt;
  final PostAuthor author;
  final List<PostImage> images;
  final int likeCount;
  final int commentCount;
  final bool likedByMe;
  final List<CommentItem> comments;

  Post({
    required this.id,
    required this.category,
    required this.title,
    required this.body,
    required this.createdAt,
    required this.author,
    required this.images,
    required this.likeCount,
    required this.commentCount,
    required this.likedByMe,
    this.comments = const [],
  });

  factory Post.fromJson(Map<String, dynamic> json) => Post(
        id: json['id'],
        category: json['category'],
        title: json['title'],
        body: json['body'],
        createdAt: json['createdAt'],
        author: PostAuthor.fromJson(json['author']),
        images: (json['images'] as List? ?? []).map((e) => PostImage.fromJson(e)).toList(),
        likeCount: json['likeCount'] ?? 0,
        commentCount: json['commentCount'] ?? (json['comments'] as List?)?.length ?? 0,
        likedByMe: json['likedByMe'] ?? false,
        comments: (json['comments'] as List? ?? []).map((e) => CommentItem.fromJson(e)).toList(),
      );
}

class AppNotification {
  final String id;
  final String type;
  final String title;
  final String body;
  final String? link;
  final bool read;
  final String createdAt;

  AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.body,
    required this.link,
    required this.read,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) => AppNotification(
        id: json['id'],
        type: json['type'],
        title: json['title'],
        body: json['body'],
        link: json['link'],
        read: json['read'] ?? false,
        createdAt: json['createdAt'],
      );
}

class AdminUser {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String role;
  final String status;
  final String createdAt;

  AdminUser({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    required this.status,
    required this.createdAt,
  });

  factory AdminUser.fromJson(Map<String, dynamic> json) => AdminUser(
        id: json['id'],
        name: json['name'],
        email: json['email'],
        phone: json['phone'],
        role: json['role'],
        status: json['status'],
        createdAt: json['createdAt'],
      );
}
