import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";

class RoleSelection extends ConsumerStatefulWidget {
  final role;
  const RoleSelection({super.key, required this.role});

  @override
  ConsumerState<RoleSelection> createState() => _RoleSelectionState();
}

class _RoleSelectionState extends ConsumerState<RoleSelection> {
  late final role = widget.role;
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).colorScheme;
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      child: ExpansionTile(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
          side: BorderSide(color: theme.onTertiary.withOpacity(0.1)),
        ),
        collapsedShape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
          side: BorderSide(color: theme.onTertiary.withOpacity(0.1)),
        ),
        backgroundColor: theme.onTertiary.withOpacity(0.04),
        collapsedBackgroundColor: theme.onTertiary.withOpacity(0.04),
        leading: Checkbox(
          value: true,
          onChanged: (value) {
            print("Selected $value");
          },
        ),
        title: Text(role["name"], style: TextStyle(fontWeight: FontWeight.bold),),
        children: [
          Wrap(
            spacing: 1,
            runSpacing: 1,
            children: [
              ...role["permissions"].map((permission) {
                return SizedBox(
                  width: 250,
                  child: ListTile(title: Text(permission)),
                );
              }),
            ],
          ),
        ],
      ),
    );
  }
}
