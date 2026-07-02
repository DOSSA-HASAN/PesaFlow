import "package:flutter/material.dart";

class CustomButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final double width;
  final double height;

  const CustomButton({super.key, required this.label, required this.onPressed, required this.width, required this.height});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: theme.colorScheme.primary,
        padding: EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        fixedSize: Size(width, height)
      ),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(color: theme.colorScheme.onSecondary.withOpacity(0.8), fontWeight: FontWeight.w800, letterSpacing: 1.2),
      ),
    );
  }
}
