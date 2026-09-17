import "package:flutter/material.dart";
import 'package:flutter/cupertino.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/core/widgets/btn.dart';
import 'package:frontend/features/payment_accounts/data/models/payment_account_model.dart';
import 'package:frontend/features/payment_accounts/provider/payment_account_provider.dart';
import 'package:frontend/features/payment_accounts/provider/selected_payment_account_provider.dart';

class PaymentAccountsDropdown extends ConsumerWidget {
  final ValueChanged<PaymentAccountModel> onAccountSelected;

  const PaymentAccountsDropdown({super.key, required this.onAccountSelected});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context).colorScheme;
    final accountState = ref.watch(paymentAccountsProvider);
    final selectedAccount = ref.watch(selectedAccountProvider);

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "M-Pesa Shortcode",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            color: theme.onSecondary.withOpacity(0.7),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: accountState.when(
                data: (accounts) {
                  if (accounts.isEmpty) {
                    print("NO ACCOUNTS");
                    return Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        "No Accounts Found",
                        style: TextStyle(
                          color: Colors.red.withOpacity(0.7),
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    );
                  }
                  return Autocomplete<PaymentAccountModel>(
                    initialValue: TextEditingValue(
                      text: selectedAccount != null
                          ? "${selectedAccount.shortCode}  -  ${selectedAccount.branchName}  -  ${selectedAccount.type}"
                          : '',
                    ),
                    displayStringForOption: (account) {
                      return "${account.shortCode}  -  ${account.branchName}  -  ${account.type}";
                    },
                    optionsBuilder: (textEditingValue) {
                      final query = textEditingValue.text.toLowerCase().trim();

                      if (query.isEmpty) {
                        return accounts;
                      }

                      return accounts.where((account) {
                        return account.shortCode.toLowerCase().contains(
                              query,
                            ) ||
                            account.branchName.toLowerCase().contains(query) ||
                            account.type.toLowerCase().contains(query);
                      });
                    },
                    onSelected: (account) {
                      onAccountSelected(account);
                      print(onAccountSelected);
                      print(account);
                    },

                    fieldViewBuilder:
                        (
                          BuildContext context,
                          TextEditingController textEditingController,
                          FocusNode focusNode,
                          VoidCallback onFieldSubmitted,
                        ) {
                          return TextFormField(
                            controller: textEditingController,
                            focusNode: focusNode,
                            onFieldSubmitted: (String value) {
                              onFieldSubmitted();
                            },
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: theme.onSecondary.withOpacity(0.7),
                            ),
                            decoration: InputDecoration(
                              hint: Text(
                                "Click to Select M-pesa Shortcode",
                                style: TextStyle(
                                  color: theme.onTertiary.withOpacity(0.4),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              border: OutlineInputBorder(
                                borderSide: BorderSide(color: theme.primary),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: theme.onSecondary.withOpacity(0.1),
                                ),
                              ),
                              filled: true,
                              fillColor: theme.onSecondary.withOpacity(0.04),
                            ),
                          );
                        },
                  );
                },
                error: (error, stackTrace) {
                  return Container(
                    padding: EdgeInsets.symmetric(vertical: 7),
                    decoration: BoxDecoration(
                      color: theme.onTertiary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Center(
                      child: Text(
                        "Failed to load mpesa shortcodes",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: Colors.red.withOpacity(0.7),
                        ),
                      ),
                    ),
                  );
                },
                loading: () {
                  return Container(
                    padding: EdgeInsets.symmetric(vertical: 7),
                    decoration: BoxDecoration(
                      color: theme.onTertiary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Center(child: CircularProgressIndicator()),
                  );
                },
              ),
            ),
            //
            IconButton(
              color: theme.primary,
              onPressed: () {
                ref.read(paymentAccountsProvider.notifier).getPaymentAccounts();
              },
              icon: Icon(Icons.refresh),
            ),
          ],
        ),
      ],
    );
  }
}
