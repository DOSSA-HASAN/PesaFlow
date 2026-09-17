import "package:flutter/material.dart";

class RoleDropdown extends StatefulWidget {
  const RoleDropdown({super.key});

  @override
  State<RoleDropdown> createState() => _RoleDropdownState();
}

class _RoleDropdownState extends State<RoleDropdown> {
  // should fetch from backend
  final roles = ["All roles", "developer", "admin", "manager", "accountant"];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).colorScheme;
    return DropdownButtonFormField<String>(
      hint: Text("Select Role"),
      initialValue: roles[0],
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
      items: roles.map((role) {
        return DropdownMenuItem<String>(value: role, child: Text(role));
      }).toList(),
      onChanged: (selected) {
        print(selected);
      },
    );
  }
}
