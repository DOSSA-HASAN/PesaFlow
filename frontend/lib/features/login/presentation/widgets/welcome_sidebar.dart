import "dart:ui";

import "package:flutter/material.dart";

class WelcomeSidebar extends StatelessWidget {
  const WelcomeSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      // color: const Color(0xFF102210),
      padding: EdgeInsets.all(64.0),
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage("assets/images/welcome_sidebar_bg.png"),
          fit: BoxFit.cover,
          colorFilter: ColorFilter.mode(
            const Color(0xFF102210).withOpacity(0.7),
            BlendMode.darken,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Row(
            children: [
              // Logo
              Container(
                padding: EdgeInsets.all(8.0),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.flash_on,
                  size: 32,
                  color: Color(0xFF102210),
                ),
              ),
              const SizedBox(width: 10,),
              // Text
              Text(
                "PesaFlow",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 48),
          const Text(
            "Empower your business with smart payments.",
            style: const TextStyle(
              color: Colors.white,
              fontSize: 44,
              fontWeight: FontWeight.bold,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 28),
          const Text(
            "Join over 500,000 merchants who trust M-Pesa to manage their daily transactions and grow their enterprise across the globe.",
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 16,
              fontWeight: FontWeight.normal,
              height: 1.6,
            ),
          ),
          const SizedBox(height: 48),
          Container(
            padding: const EdgeInsets.all(32),
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: Colors.white12)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _MetricItem(value: "99.9%", label: "Uptime Reliability"),
                const SizedBox(width: 50),
                _MetricItem(value: "256-bit", label: "AES Encryption"),
                const SizedBox(width: 50),
                _MetricItem(value: "24/7", label: "Priority Support"),
                const SizedBox(width: 50),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MetricItem extends StatelessWidget {
  final String value;
  final String label;

  const _MetricItem({super.key, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: TextStyle(
            color: theme.colorScheme.primary,
            fontWeight: FontWeight.bold,
            fontSize: 24,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: Colors.white70,
            fontWeight: FontWeight.normal,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}
