import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/core/widgets/btn.dart';
import 'package:frontend/core/widgets/text_field.dart';
import 'package:frontend/core/widgets/toast_util.dart';
import 'package:frontend/features/payment/b2C/presentation/widgets/command_id_dropdown.dart';
import 'package:frontend/features/payment/b2C/provider/b2c_provider.dart';
import 'package:frontend/features/payment/b2Paybill/presentation/screens/b2_paybill_payment_response.dart';
import 'package:frontend/features/payment/b2Paybill/provider/b2_paybill_provider.dart';
import 'package:frontend/features/payment/b2Pochi/provider/b2_pochi_provider.dart';
import 'package:frontend/features/payment_accounts/presentation/widgets/payment_accounts_dropdown.dart';
import 'package:frontend/features/payment_accounts/provider/selected_payment_account_provider.dart';
import 'package:toastification/toastification.dart';

class B2CustomerScreen extends ConsumerStatefulWidget {
  const B2CustomerScreen({super.key});

  ConsumerState<B2CustomerScreen> createState() => _B2CustomerScreenState();
}

class _B2CustomerScreenState extends ConsumerState<B2CustomerScreen> {
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _receiverTillController = TextEditingController();
  final TextEditingController _accountRefController = TextEditingController();
  final TextEditingController _remarksController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    String? selectedCommandId;
    final selectedAccount = ref.watch(selectedAccountProvider);
    final theme = Theme.of(context);
    final b2CustomerRef = ref.watch(b2cProvider);
    ref.listen<AsyncValue<bool>>(b2cProvider, (previous, next) {
      if (next is AsyncData && next.value == true) {
        _amountController.clear();
        _receiverTillController.clear();
        _accountRefController.clear();
        _remarksController.clear();
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.success,
          title: "B2C Payment Success",
          description:
              "B2C payment has been submitted and is now being processed.",
        );
      } else if (next is AsyncError) {
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.error,
          title: "B2C Payment Failed",
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
                              "Business To B2C Transaction",
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
                            CommandIdDropdown(
                              onSelected: (commandId) {
                                setState(() {
                                  selectedCommandId = commandId;
                                });
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
                                    label: "Pochi",
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
                              label: b2CustomerRef is AsyncLoading
                                  ? "Processing payment..."
                                  : "B2C",
                              height: 50,
                              onPressed: b2CustomerRef is AsyncLoading
                                  ? () {}
                                  : () {
                                      ref
                                          .read(b2cProvider.notifier)
                                          .submitB2c(
                                            selectedAccount!.shortCode,
                                            selectedCommandId!,
                                            _amountController.text.trim(),
                                            _receiverTillController.text.trim(),
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
              // Expanded(child: B2PaybillPaymentResponse()),
            ],
          ),
        ),
      ),
    );
  }
}
