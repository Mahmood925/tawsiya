import 'package:flutter/material.dart';
import '../theme.dart';
import '../models.dart';
import '../widgets/common.dart';
import 'feed_screen.dart';
import 'notifications_screen.dart';
import 'profile_screen.dart';
import 'admin_screen.dart';
import 'new_post_screen.dart';

class AppShell extends StatefulWidget {
  final Session session;
  const AppShell({super.key, required this.session});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int tab = 0;

  List<Widget> get _tabs => [
        FeedScreen(session: widget.session),
        NotificationsScreen(session: widget.session),
        if (widget.session.isAdmin) AdminScreen(session: widget.session),
        ProfileScreen(session: widget.session),
      ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: SafeArea(bottom: false, child: IndexedStack(index: tab, children: _tabs)),
      bottomNavigationBar: SafeArea(
        top: false,
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(top: BorderSide(color: AppColors.border)),
          ),
          child: Row(
            children: [
              _navItem(Icons.home_outlined, Icons.home, 0),
              if (widget.session.canPost)
                _navAction(
                  Icons.add_box_outlined,
                  () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => NewPostScreen(session: widget.session))),
                ),
              _navItem(Icons.favorite_border, Icons.favorite, 1),
              if (widget.session.isAdmin) _navItem(Icons.bar_chart_outlined, Icons.bar_chart, 2),
              _navProfile(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _navItem(IconData outline, IconData filled, int index) {
    final active = tab == index;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => tab = index),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Icon(active ? filled : outline, color: active ? AppColors.text : AppColors.textDim, size: 24),
        ),
      ),
    );
  }

  Widget _navAction(IconData icon, VoidCallback onTap) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Icon(icon, color: AppColors.textDim, size: 24),
        ),
      ),
    );
  }

  Widget _navProfile() {
    final active = tab == _tabs.length - 1;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => tab = _tabs.length - 1),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 9),
          child: Container(
            padding: const EdgeInsets.all(1),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: active ? AppColors.text : Colors.transparent, width: 2),
            ),
            child: Avatar(name: widget.session.name, size: 24),
          ),
        ),
      ),
    );
  }
}
