import 'package:flutter/material.dart';
import 'package:toastification/toastification.dart';

class ToastUtil {
  static void showPaymentToast(
    BuildContext context,
    Map<String, dynamic> payment,
  ) {
    final String status = payment["status"] ?? "FAILED";
    final String amount = payment["amount"].toString() ?? '0.00';
    final String reference = payment["reference"] ?? 'Payment';
    final String receipt = payment["externalReceiptNumber"] ?? '';
    final String phoneNumber = payment["phoneNumber"] ?? "+254xxxxxxxx";
    final String message = payment["message"] ?? "";

    switch (status.toUpperCase()) {
      case "SUCCESS":
        _trigger(
          context: context,
          type: ToastificationType.success,
          title: reference,
          description:
              "${amount} Ksh received from ${phoneNumber}.\nMessage: ${message}",
        );
      case "CANCELLED":
        _trigger(
          context: context,
          type: ToastificationType.error,
          title: reference,
          description: "${phoneNumber} cancelled the prompt.",
        );
      case "FAILED":
        _trigger(
          context: context,
          type: ToastificationType.error,
          title: reference,
          description: message,
        );
    }
  }

  static void showGeneralToast({
    required BuildContext context,
    required ToastificationType type,
    required String title,
    required String description,
  }) {
    return _trigger(
      context: context,
      type: type,
      title: title,
      description: description,
    );
  }

  static void _trigger({
    required BuildContext context,
    required ToastificationType type,
    required String title,
    required String description,
    Widget? icon,
  }) {
    toastification.show(
      type: type,
      title: Text(title),
      description: Text(description),
      icon: icon ?? Icon(Icons.notifications_active_rounded),
    );
  }
}
