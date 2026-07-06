import "package:flutter/material.dart";

class SecurityFooter extends StatelessWidget {
  const SecurityFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 20),
      child: const Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _badge(label: "PCI COMPLIANT"),
              const SizedBox(width: 20,),
              _badge(label: "SSL SECURE"),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            "PROTECTED BY M-PESA SECURITY SYSTEMS\n© 2026 PESAFLOW. ALL RIGHTS RESERVED.",
            style: TextStyle(
              color: Colors.grey,
              fontSize: 10,
              letterSpacing: 1.5,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

class _badge extends StatelessWidget {
  final String label;

  const _badge({super.key, required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: Colors.grey.withOpacity(0.4), width: 1.5),
      ),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          color: Colors.grey,
          fontSize: 9,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
