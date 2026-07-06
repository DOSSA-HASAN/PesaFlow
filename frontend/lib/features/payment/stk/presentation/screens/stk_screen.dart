import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/core/widgets/btn.dart";
import "package:frontend/core/widgets/text_field.dart";
import "package:frontend/features/payment/stk/provider/stk_provider.dart";

class StkScreen extends ConsumerStatefulWidget {
  const StkScreen({super.key});

  @override
  ConsumerState<StkScreen> createState() => _StkScreenState();
}

class _StkScreenState extends ConsumerState<StkScreen> {
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _phoneNumberController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final stkState = ref.watch(stkProvider);
    return Container(
      constraints: BoxConstraints(maxWidth: 1000),
      clipBehavior: Clip.hardEdge,
      margin: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        color: theme.colorScheme.onPrimary,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.colorScheme.onSecondary.withOpacity(0.1),
        ),
        boxShadow: [
          BoxShadow(
            color: theme.colorScheme.onSecondary.withOpacity(0.08),
            offset: Offset(1, 1),
            blurRadius: 10,
            // blurRadius: 10,
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            flex: 1,
            child: Container(
              padding: EdgeInsets.all(30),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.shield_rounded,
                        color: theme.colorScheme.primary,
                      ),
                      const SizedBox(width: 12),
                      Text(
                        "SECURE PAYMENT",
                        style: TextStyle(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    "Prompt Customer",
                    style: TextStyle(
                      color: theme.colorScheme.onSecondary.withOpacity(0.8),
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "Enter customer phone number and amount to prompt the customer on their phone.",
                    textAlign: TextAlign.left,
                    style: TextStyle(
                      color: theme.colorScheme.onSecondary.withOpacity(0.5),
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 40),
                  CustomTextField(
                    label: "M-Pesa Phone Number",
                    hintText: "712345678",
                    prefixIcon: Icon(Icons.numbers_rounded),
                    controller: _phoneNumberController,
                  ),
                  const SizedBox(height: 20),
                  CustomTextField(
                    label: "Payment Amount (KES)",
                    hintText: "12,450",
                    prefixIcon: Icon(Icons.money),
                    controller: _amountController,
                  ),
                  const SizedBox(height: 20),
                  CustomButton(
                    label: stkState is AsyncLoading
                        ? "Prompting..."
                        : "Send Prompt",
                    onPressed: stkState is AsyncLoading
                        ? () {}
                        : () {
                            ref
                                .read(stkProvider.notifier)
                                .stkPrompt(
                                  "174379",
                                  _amountController.text.trim(),
                                  _phoneNumberController.text.trim(),
                                );
                            _amountController.text = "";
                            _phoneNumberController.text = "";
                          },
                    width: 650,
                    height: 50,
                  ),
                  const SizedBox(height: 50),
                  Flexible(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            Icons.info_rounded,
                            color: theme.colorScheme.primary,
                          ),
                          const SizedBox(width: 20),
                          Expanded(
                            child: Text(
                              "Once you click the above button, the customer will receive a pop on their phone asking for their M-Pesa PIN.",
                              softWrap: true,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: Container(
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
            ),
          ),
        ],
      ),
    );
  }
}
