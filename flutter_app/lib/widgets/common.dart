import 'package:flutter/material.dart';
import '../theme.dart';
import '../utils.dart';

class LogoMark extends StatelessWidget {
  final double size;
  const LogoMark({super.key, this.size = 40});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.navy, AppColors.navyDeep],
        ),
        borderRadius: BorderRadius.circular(size * 0.28),
      ),
      child: CustomPaint(painter: _MarkPainter(), size: Size(size, size)),
    );
  }
}

class _MarkPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width / 58.0 * 0.66;
    final cx = size.width / 2;
    final cy = size.height / 2;
    const srcCx = 27.0, srcCy = 29.0;
    Offset pt(double x, double y) => Offset(cx + (x - srcCx) * s, cy + (y - srcCy) * s);

    final linePaint = Paint()
      ..color = AppColors.gold
      ..strokeWidth = 4.5 * s
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..style = PaintingStyle.stroke;

    final path = Path()
      ..moveTo(pt(8, 42).dx, pt(8, 42).dy)
      ..lineTo(pt(20, 34).dx, pt(20, 34).dy)
      ..lineTo(pt(30, 40).dx, pt(30, 40).dy)
      ..lineTo(pt(46, 16).dx, pt(46, 16).dy);
    canvas.drawPath(path, linePaint);

    final arrow = Path()
      ..moveTo(pt(38, 16).dx, pt(38, 16).dy)
      ..lineTo(pt(46, 16).dx, pt(46, 16).dy)
      ..lineTo(pt(46, 24).dx, pt(46, 24).dy);
    canvas.drawPath(arrow, linePaint);

    final dotPaint = Paint()..color = AppColors.emerald;
    final r = 3.4 * s;
    canvas.drawCircle(pt(20, 34), r, dotPaint);
    canvas.drawCircle(pt(8, 42), r, dotPaint);
    canvas.drawCircle(pt(30, 40), r, Paint()..color = AppColors.navy);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class LogoLockup extends StatelessWidget {
  final double mark;
  final double word;
  const LogoLockup({super.key, this.mark = 34, this.word = 18});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        LogoMark(size: mark),
        const SizedBox(width: 10),
        RichText(
          text: TextSpan(
            style: headingFont(size: word, color: AppColors.navy),
            children: [
              const TextSpan(text: 'تو'),
              const TextSpan(text: 'صي', style: TextStyle(color: AppColors.gold)),
              const TextSpan(text: 'ة'),
            ],
          ),
        ),
      ],
    );
  }
}

class Avatar extends StatelessWidget {
  final String name;
  final double size;
  const Avatar({super.key, required this.name, this.size = 36});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: const BoxDecoration(color: AppColors.goldSoft, shape: BoxShape.circle),
      child: Text(initials(name), style: headingFont(size: size * 0.4, color: AppColors.gold)),
    );
  }
}

class GoldButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  const GoldButton({super.key, required this.label, required this.onPressed, this.loading = false});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: loading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.gold,
          foregroundColor: const Color(0xFF1A1206),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
          elevation: 0,
        ),
        child: loading
            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF1A1206)))
            : Text(label, style: headingFont(size: 14, color: const Color(0xFF1A1206))),
      ),
    );
  }
}

class AppField extends StatelessWidget {
  final String hint;
  final IconData icon;
  final TextEditingController controller;
  final bool obscure;
  final TextInputType? keyboardType;
  const AppField({
    super.key,
    required this.hint,
    required this.icon,
    required this.controller,
    this.obscure = false,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: controller,
        obscureText: obscure,
        keyboardType: keyboardType,
        textAlign: TextAlign.right,
        style: bodyFont(size: 13.5),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: bodyFont(size: 13, color: AppColors.textDim),
          suffixIcon: Icon(icon, color: AppColors.textDim, size: 19),
          filled: true,
          fillColor: AppColors.surface2,
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(11), borderSide: BorderSide.none),
        ),
      ),
    );
  }
}

class TypeBadge extends StatelessWidget {
  final String category;
  const TypeBadge({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    final isAnalysis = category == 'analysis';
    final color = isAnalysis ? const Color(0xFF2F6FE0) : AppColors.amber;
    final bg = isAnalysis ? const Color(0x1A2F6FE0) : AppColors.amberSoft;
    final label = isAnalysis ? 'تحليل' : 'خبر';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(7)),
      child: Text(label, style: bodyFont(size: 11, weight: FontWeight.w700, color: color)),
    );
  }
}

class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String hint;
  const EmptyState({super.key, required this.icon, required this.title, required this.hint});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 60),
      child: Column(
        children: [
          Icon(icon, size: 34, color: AppColors.textDim),
          const SizedBox(height: 12),
          Text(title, style: headingFont(size: 13.5)),
          const SizedBox(height: 4),
          Text(hint, style: bodyFont(size: 12, color: AppColors.textDim), textAlign: TextAlign.center),
        ],
      ),
    );
  }
}
