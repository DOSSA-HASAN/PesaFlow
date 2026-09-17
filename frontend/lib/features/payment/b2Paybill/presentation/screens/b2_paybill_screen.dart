import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/core/widgets/btn.dart';
import 'package:frontend/core/widgets/text_field.dart';
import 'package:frontend/core/widgets/toast_util.dart';
import 'package:frontend/features/payment/b2Paybill/presentation/screens/b2_paybill_payment_response.dart';
import 'package:frontend/features/payment/b2Paybill/provider/b2_paybill_provider.dart';
import 'package:frontend/features/payment_accounts/presentation/widgets/payment_accounts_dropdown.dart';
import 'package:frontend/features/payment_accounts/provider/selected_payment_account_provider.dart';
import 'package:toastification/toastification.dart';

class B2PaybillScreen extends ConsumerStatefulWidget {
  const B2PaybillScreen({super.key});

  ConsumerState<B2PaybillScreen> createState() => _B2PaybillScreenState();
}

class _B2PaybillScreenState extends ConsumerState<B2PaybillScreen> {
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _receiverTillController = TextEditingController();
  final TextEditingController _accountRefController = TextEditingController();
  final TextEditingController _remarksController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final selectedAccount = ref.watch(selectedAccountProvider);
    final theme = Theme.of(context);
    final b2PaybillRef = ref.watch(b2PaybillProvider);
    ref.listen<AsyncValue<bool>>(b2PaybillProvider, (previous, next) {
      if (next is AsyncData && next.value == true) {
        _amountController.clear();
        _receiverTillController.clear();
        _accountRefController.clear();
        _remarksController.clear();
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.success,
          title: "B2Paybill Payment Success",
          description:
          "B2Paybill payment has been submitted and is now being processed.",
        );
      } else if (next is AsyncError) {
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.error,
          title: "B2Paybill Payment Failed",
          description: next.error.toString(),
        );
      }
    });
    return Padding(
      padding: const EdgeInsets.all(0),
      child: Center(
        child: Container(
          // constraints: BoxConstraints(maxWidth: 1000),
          clipBehavior: Clip.hardEdge,
          // margin: const EdgeInsets.all(30),
          decoration: BoxDecoration(
            color: theme.colorScheme.onPrimary,
            borderRadius: BorderRadius.circular(0),
            border: Border.all(
              color: theme.colorScheme.onSecondary.withOpacity(0.1),
            ),
            boxShadow: [
              BoxShadow(
                color: theme.colorScheme.onSecondary.withOpacity(0.08),
                offset: Offset(1, 1),
                blurRadius: 10,
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    Expanded(
                      child: Container(
                        padding: EdgeInsets.all(30),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Business To Paybill Transaction",
                              style: TextStyle(
                                color: theme.colorScheme.onSecondary
                                    .withOpacity(0.8),
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              "All fields are required. Once submitted wait for confirmation notification.",
                              textAlign: TextAlign.left,
                              style: TextStyle(
                                color: theme.colorScheme.onSecondary
                                    .withOpacity(0.5),
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(height: 40),
                            PaymentAccountsDropdown(
                              onAccountSelected: (account) {
                                ref
                                    .read(selectedAccountProvider.notifier)
                                    .state =
                                    account;
                              },
                            ),
                            const SizedBox(height: 20),
                            Row(
                              // crossAxisAlignment: CrossAxisAlignment.start,
                              // mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Expanded(
                                  child: CustomTextField(
                                    label: "Payment Amount (KES)",
                                    hintText: "12,450",
                                    prefixIcon: Icon(Icons.money),
                                    controller: _amountController,
                                  ),
                                ),
                                const SizedBox(width: 20),
                                Expanded(
                                  child: CustomTextField(
                                    label: "Receiver Till Number",
                                    hintText: "600000",
                                    prefixIcon: Icon(Icons.numbers_rounded),
                                    controller: _receiverTillController,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                            CustomTextField(
                              label: "Invoice Number / Account Reference",
                              hintText: "INV-001-7-7-2026",
                              controller: _accountRefController,
                            ),
                            const SizedBox(height: 20),
                            CustomTextField(
                              label: "Remarks",
                              hintText:
                              "Additional information for transaction",
                              controller: _remarksController,
                            ),
                            const SizedBox(height: 20),
                            CustomButton(
                              label: b2PaybillRef is AsyncLoading
                                  ? "Processing payment..."
                                  : "Paybill",
                              height: 50,
                              onPressed: b2PaybillRef is AsyncLoading
                                  ? () {}
                                  : () {
                                //TODO: shortcode is hardcoded for now
                                ref
                                    .read(b2PaybillProvider.notifier)
                                    .submitB2Paybill(
                                  selectedAccount!.shortCode,
                                  _amountController.text.trim(),
                                  _receiverTillController.text.trim(),
                                  _accountRefController.text.trim(),
                                  _remarksController.text.trim(),
                                );
                              },
                            ),
                            const SizedBox(height: 30),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(child: B2PaybillPaymentResponse()),
            ],
          ),
        ),
      ),
    );
  }
}
