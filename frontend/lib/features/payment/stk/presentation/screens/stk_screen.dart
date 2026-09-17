import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/core/widgets/btn.dart";
import "package:frontend/core/widgets/text_field.dart";
import "package:frontend/core/widgets/toast_util.dart";
import "package:frontend/features/payment/b2C/presentation/widgets/command_id_dropdown.dart";
import "package:frontend/features/payment/stk/presentation/widgets/qr_code.dart";
import "package:frontend/features/payment/stk/provider/stk_provider.dart";
import "package:frontend/features/payment_accounts/data/models/payment_account_model.dart";
import "package:frontend/features/payment_accounts/presentation/widgets/payment_accounts_dropdown.dart";
import "package:frontend/features/payment_accounts/provider/selected_payment_account_provider.dart";
import "package:lucide_icons/lucide_icons.dart";
import "package:toastification/toastification.dart";
import "package:frontend/features/payment_accounts/provider/payment_account_provider.dart";

class StkScreen extends ConsumerStatefulWidget {
  const StkScreen({super.key});

  @override
  ConsumerState<StkScreen> createState() => _StkScreenState();
}

class _StkScreenState extends ConsumerState<StkScreen> {
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _phoneNumberController = TextEditingController(text: "254");
  final TextEditingController _referenceController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  @override
  void dispose() {
    _amountController.dispose();
    _phoneNumberController.dispose();
    _referenceController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  void initState(){
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final stkState = ref.watch(stkProvider);
    final selectedAccount = ref.watch(selectedAccountProvider);

    ref.listen<AsyncValue<bool>>(stkProvider, (previous, next) {
      if (next is AsyncData<bool> && next.value == true) {
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.success,
          title: "Stk Prompt Successful",
          description: "Customer has been prompted.",
        );
      }
      if (next is AsyncError<bool>) {
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.error,
          title: "STK prompt failed",
          description: "${next.error.toString()} - from toast",
        );
      }
    });

    return Padding(
      padding: const EdgeInsets.all(0),
      child: Center(
        child: Container(
          clipBehavior: Clip.hardEdge,
          height: double.infinity,
          decoration: BoxDecoration(
            color: theme.colorScheme.onPrimary,
            // borderRadius: BorderRadius.circular(20),
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
                      Text(
                        "Prompt Customer",
                        style: TextStyle(
                          color: theme.colorScheme.onSecondary.withOpacity(0.8),
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "Enter customer phone number and amount to prompt the customer on their phone.",
                        textAlign: TextAlign.left,
                        style: TextStyle(
                          color: theme.colorScheme.onSecondary.withOpacity(0.5),
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 10),
                      PaymentAccountsDropdown(
                        onAccountSelected: (account) {
                          ref.read(selectedAccountProvider.notifier).state =
                              account;
                        },
                      ),
                      const SizedBox(height: 20),
                      CustomTextField(
                        label: "M-Pesa Phone Number",
                        hintText: "712345678",
                        prefixIcon: Icon(LucideIcons.phone),
                        controller: _phoneNumberController,
                      ),
                      const SizedBox(height: 20),
                      CustomTextField(
                        label: "Payment Amount (KES)",
                        hintText: "12,450",
                        prefixIcon: Icon(LucideIcons.banknote),
                        controller: _amountController,
                      ),
                      const SizedBox(height: 20),
                      CustomTextField(
                        label: "Reference",
                        hintText: "INV-3926",
                        prefixIcon: Icon(LucideIcons.receipt),
                        controller: _referenceController,
                      ),
                      const SizedBox(height: 20),
                      CustomTextField(
                        label: "Description",
                        hintText: "Payment made for transport",
                        prefixIcon: Icon(LucideIcons.fileText),
                        controller: _descriptionController,
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
                                      selectedAccount!.shortCode,
                                      _amountController.text.trim(),
                                      _phoneNumberController.text.trim(),
                                      _referenceController.text.trim(),
                                      _descriptionController.text.trim(),
                                    );
                              },
                        width: 650,
                        height: 50,
                      ),
                      // const SizedBox(height: 30),
                      // Flexible(
                      //   child: Container(
                      //     padding: const EdgeInsets.all(12),
                      //     decoration: BoxDecoration(
                      //       color: theme.colorScheme.primary.withOpacity(0.2),
                      //       borderRadius: BorderRadius.circular(12),
                      //     ),
                      //     child: Row(
                      //       crossAxisAlignment: CrossAxisAlignment.start,
                      //       children: [
                      //         Icon(
                      //           Icons.info_rounded,
                      //           color: theme.colorScheme.primary,
                      //         ),
                      //         const SizedBox(width: 20),
                      //         Expanded(
                      //           child: Text(
                      //             "Once you click the above button, the customer will receive a pop on their phone asking for their M-Pesa PIN.",
                      //             softWrap: true,
                      //           ),
                      //         ),
                      //       ],
                      //     ),
                      //   ),
                      // ),
                    ],
                  ),
                ),
              ),
              Expanded(child: QrCode()),
            ],
          ),
        ),
      ),
    );
  }
}
