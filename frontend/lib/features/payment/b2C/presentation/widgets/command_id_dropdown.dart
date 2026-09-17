import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CommandIdDropdown extends ConsumerWidget {
  final ValueChanged<String> onSelected;

  const CommandIdDropdown({super.key, required this.onSelected});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final commandIds = ["SalaryPayment", "BusinessPayment", "PromotionPayment"];
    final theme = Theme.of(context).colorScheme;
    return Column(
      children: [
        // dropdown label
        Text(
          "B2C Command IDs",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            color: theme.onSecondary.withOpacity(0.7),
          ),
        ),

        // dropdown
        Autocomplete<String>(
          optionsBuilder: (TextEditingValue textEditingValue) {
            if (textEditingValue.text.isEmpty) {
              return commandIds;
            }

            return commandIds.where(
              (commandId) => commandId.toLowerCase().contains(textEditingValue.text.toLowerCase()),
            );
          },

          onSelected: (String selection) {
            print("Selected Command ID: ${selection}");
            onSelected(selection);
          },

          fieldViewBuilder:
              (
                BuildContext context,
                TextEditingController controller,
                FocusNode focusNode,
                VoidCallback callback,
              ) {
                return TextField(
                  controller: controller,
                  focusNode: focusNode,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: theme.onSecondary.withOpacity(0.7),
                  ),
                  decoration: InputDecoration(
                    hint: Text(
                      "Click to Select B2C Command ID",
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
        ),
      ],
    );
  }
}
