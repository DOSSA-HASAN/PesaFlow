import "package:flutter/material.dart";
import "package:frontend/features/user_management/presentation/widgets/user_table_row.dart";

class TableData extends StatefulWidget {
  const TableData({super.key});

  @override
  State<TableData> createState() => _TableDataState();
}

class _TableDataState extends State<TableData> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).colorScheme;
    return Column(
      children: [
        // rows
        Container(
          margin: const EdgeInsets.only(top: 4),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
          decoration: BoxDecoration(
            border: Border.symmetric(
              horizontal: BorderSide(
                color: theme.onSecondary.withOpacity(0.06),
              ),
            ),
            color: theme.onSecondary.withOpacity(0.04),
          ),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(
                  "USER",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: theme.onSecondary.withOpacity(0.4),
                  ),
                  textAlign: TextAlign.start,
                ),
              ),
              Expanded(
                flex: 1,
                child: Text(
                  "ROLE",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: theme.onSecondary.withOpacity(0.4),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              Expanded(
                flex: 2,
                child: Text(
                  "PERMISSIONS",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: theme.onSecondary.withOpacity(0.4),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              Expanded(
                flex: 2,
                child: Text(
                  "STATUS",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: theme.onSecondary.withOpacity(0.4),
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              Expanded(
                flex: 2,
                child: Text(
                  "ACTIONS",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: theme.onSecondary.withOpacity(0.4),
                  ),
                  textAlign: TextAlign.end,
                ),
              ),
            ],
          ),
        ),
        UserTableRow(
          email: "dev@gmail.com",
          role: "Developer",
          permissionsLength: 8,
          isActive: false,
        ),
        UserTableRow(
          email: "dev@gmail.com",
          role: "Developer",
          permissionsLength: 8,
          isActive: true,
        ),
        UserTableRow(
          email: "dev@gmail.com",
          role: "Developer",
          permissionsLength: 8,
          isActive: true,
        ),
        UserTableRow(
          email: "dev@gmail.com",
          role: "Developer",
          permissionsLength: 8,
          isActive: true,
        ),
      ],
    );
  }
}
