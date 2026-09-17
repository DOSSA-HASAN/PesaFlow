import "package:flutter/material.dart";

class ActionIconButton extends StatelessWidget {
  final IconData icon;
  final String hint;
  final VoidCallback onPressed;
  final Color? hoverColor;
  final Color? iconColor;

  const ActionIconButton({
    super.key,
    required this.icon,
    required this.hint,
    required this.onPressed,
    this.hoverColor,
    this.iconColor
  });

  @override
  Widget build(BuildContext context) {
    return IconButton(
      hoverColor: hoverColor,
      onPressed: onPressed,
      icon: Icon(icon, size: 20),
      tooltip: hint,
      style: IconButton.styleFrom(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        foregroundColor: iconColor
      ),
    );
  }
}
