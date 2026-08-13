String timeAgo(String isoDate) {
  final date = DateTime.parse(isoDate).toLocal();
  final diff = DateTime.now().difference(date);

  if (diff.inSeconds < 60) return 'الآن';
  if (diff.inMinutes < 60) return 'منذ ${diff.inMinutes} دقيقة';
  if (diff.inHours < 24) return 'منذ ${diff.inHours} ساعة';
  if (diff.inDays < 30) return 'منذ ${diff.inDays} يوم';
  final months = (diff.inDays / 30).floor();
  return 'منذ $months شهر';
}

String initials(String name) {
  final trimmed = name.trim();
  return trimmed.isNotEmpty ? trimmed.substring(0, 1) : '؟';
}

const Map<String, String> roleLabels = {'USER': 'متداول', 'COACH': 'كوتش', 'ADMIN': 'إدارة'};
const Map<String, String> statusLabels = {'PENDING': 'معلّق', 'APPROVED': 'مفعّل', 'REJECTED': 'مرفوض'};
