import 'package:flutter/material.dart';
import 'package:frontend/features/user_management/presentation/widgets/action_icon_button.dart';

class UserTableRow extends StatelessWidget {
  final String email;
  final String role;
  final int permissionsLength;
  final bool isActive;

  const UserTableRow({
    super.key,
    required this.email,
    required this.role,
    required this.permissionsLength,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 15),
      decoration: BoxDecoration(
        border: Border.all(
          color: theme.onSecondary.withOpacity(0.2),
          width: 0.1,
        ),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              email,
              style: TextStyle(
                color: theme.onTertiary.withOpacity(0.8),
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.start,
            ),
          ),
          Expanded(
            flex: 1,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(4),
                color: theme.onSecondary.withOpacity(0.03),
              ),
              child: Text(
                role,
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ),
          Expanded(
            flex: 2,

            child: Text(
              "$permissionsLength",
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 18),
            ),
          ),
          Expanded(
            flex: 2,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Dot
                CircleAvatar(
                  radius: 5,
                  backgroundColor: isActive ? theme.primary : Colors.red,
                ),
                const SizedBox(width: 8),
                Text(
                  isActive ? "Active" : "Blocked",
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: theme.onTertiary.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 2,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ActionIconButton(
                  icon: Icons.edit_outlined,
                  hint: "Edit user",
                  onPressed: () {
                    print("Editing user...");
                  },
                  hoverColor: theme.primary.withOpacity(0.2),
                ),
                const SizedBox(width: 10),
                ActionIconButton(
                  icon: Icons.health_and_safety_rounded,
                  hint: "Edit permissions",
                  onPressed: () {
                    print("Editing permissions...");
                  },
                  hoverColor: theme.primary.withOpacity(0.2),
                ),
                const SizedBox(width: 10),
                ActionIconButton(
                  icon: Icons.person_off_outlined,
                  hint: "Block user",
                  onPressed: () {
                    print("Blocking user...");
                  },
                  hoverColor: Colors.red.withOpacity(0.2),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
