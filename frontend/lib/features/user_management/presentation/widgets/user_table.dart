import "package:flutter/material.dart";
import "package:frontend/core/widgets/text_field.dart";
import "package:frontend/features/user_management/presentation/widgets/filter_role_dropdown.dart";
import "package:frontend/features/user_management/presentation/widgets/status_dropdown.dart";
import "package:frontend/features/user_management/presentation/widgets/table_data.dart";

class UserTable extends StatefulWidget {
  const UserTable({super.key});

  @override
  State<UserTable> createState() => _UserTableState();
}

class _UserTableState extends State<UserTable> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).colorScheme;
    return Container(
      // padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4),
        // color: theme.onSecondary.withOpacity(0.01),
        border: Border.all(color: theme.onTertiary.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          // table header + filter options + search bar
          Padding(
            padding: const EdgeInsets.all(15),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Expanded(
                  flex: 3,
                  child: CustomTextField(
                    label: "",
                    hintText: "Search by name, email, or phone number",
                    prefixIcon: Icon(Icons.search_rounded),
                  ),
                ),
                const SizedBox(width: 30),
                Expanded(flex: 1, child: RoleDropdown()),
                const SizedBox(width: 10),
                Expanded(flex: 1, child: StatusDropdown()),
                const SizedBox(width: 10),
                IconButton(
                  style: IconButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4),
                    ),
                    backgroundColor: theme.onSecondary.withOpacity(0.04),
                    foregroundColor: theme.onSecondary.withOpacity(0.7),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 14,
                    ),
                  ),
                  icon: Icon(Icons.tune_rounded),
                  onPressed: () {
                    print("Clicked more filters");
                  },
                ),
                const SizedBox(width: 10),
                IconButton(
                  style: IconButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4),
                    ),
                    backgroundColor: theme.primary,
                    foregroundColor: theme.onTertiary,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 14,
                    ),
                  ),
                  onPressed: () {
                    print("Searching for users");
                  },
                  icon: Icon(Icons.search_rounded),
                ),
              ],
            ),
          ),
          TableData(),
        ],
      ),
    );
  }
}
