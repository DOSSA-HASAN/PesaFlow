import "package:flutter/material.dart";

class StatusDropdown extends StatefulWidget {
  const StatusDropdown({super.key});

  @override
  State<StatusDropdown> createState() => _StatusDropdownState();
}

class _StatusDropdownState extends State<StatusDropdown> {
  // should fetch from backend
  final statuses = ["All statuses", "Blocked", "Unblocked"];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).colorScheme;
    return DropdownButtonFormField<String>(
      hint: Text("Select Status"),
      initialValue: statuses[0],
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 18,
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(
              color: theme.onSecondary.withOpacity(0.1)),
          borderRadius: BorderRadius.circular(4),
        ),
        border: OutlineInputBorder(borderSide: BorderSide(color: theme.primary)),
        filled: true,
        fillColor: theme.onSecondary.withOpacity(0.04),
      ),
      items: statuses.map((role) {
        return DropdownMenuItem<String>(value: role, child: Text(role));
      }).toList(),
      onChanged: (selected) {
        print(selected);
      },
    );
  }
}
