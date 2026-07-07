import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";

class QrCode extends ConsumerStatefulWidget {
  const QrCode({super.key});

  @override
  ConsumerState<QrCode> createState() => _QrCodeState();
}

class _QrCodeState extends ConsumerState<QrCode> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      height: double.maxFinite,
      padding: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        color: theme.colorScheme.onSecondary.withOpacity(0.03),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 250,
            height: 250,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: theme.colorScheme.onSecondary.withOpacity(0.1),
              ),
              color: theme.colorScheme.onPrimaryContainer,
            ),
            child: Center(child: Text("QR Code Comes here")),
          ),
          const SizedBox(height: 30),
          Text(
            "Scan To Pay",
            style: TextStyle(
              color: theme.colorScheme.onSecondary.withOpacity(0.8),
              fontSize: 30,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: 300,
            child: Text(
              "Scan To Use the M-Pesa app to scan this QR code if the push notification doesn't appear.",
              style: TextStyle(
                color: theme.colorScheme.onSecondary.withOpacity(0.5),
                fontSize: 15,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
