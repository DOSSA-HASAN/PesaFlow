import "package:flutter/material.dart";
import "package:frontend/core/theme/app_colors.dart";
import "package:frontend/core/widgets/btn.dart";
import "package:frontend/features/user_management/presentation/screens/add_user_screen.dart";
import "package:frontend/features/user_management/presentation/widgets/user_table.dart";

class UserManagementScreen extends StatefulWidget {
  const UserManagementScreen({super.key});

  @override
  State<UserManagementScreen> createState() => _UserManagementScreenState();
}

class _UserManagementScreenState extends State<UserManagementScreen> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.all(0),
      child: Center(
        child: Container(
          padding: EdgeInsets.all(30),
          // constraints: BoxConstraints(maxWidth: 1000),
          clipBehavior: Clip.hardEdge,
          // margin: const EdgeInsets.all(30),
          decoration: BoxDecoration(
            color: theme.onPrimary,
            borderRadius: BorderRadius.circular(0),
            border: Border.all(color: theme.onSecondary.withOpacity(0.1)),
            boxShadow: [
              BoxShadow(
                color: theme.onSecondary.withOpacity(0.08),
                offset: Offset(1, 1),
                blurRadius: 10,
              ),
            ],
          ),
          child: Column(
            children: [
              // title and add user btn row
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: Container(
                      // padding: EdgeInsets.all(30),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "User Management",
                            style: TextStyle(
                              color: theme.onSecondary.withOpacity(0.8),
                              fontSize: 30,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            "Manage users, roles and permissions for your PesaFlow account",
                            textAlign: TextAlign.left,
                            style: TextStyle(
                              color: theme.onSecondary.withOpacity(0.5),
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Expanded(
                    flex: 1,
                    child: CustomButton(
                      label: "Add User",
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => AddUserScreen()));
                        print("Clicked add user...");
                      },
                      width: 200,
                      height: 0,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 30,),
              Row(
                children: [
                  Expanded(child: _informationCard("Total Users", "21")),
                  Expanded(child: _informationCard("Blocked Users", "3")),
                  Expanded(child: _informationCard("Roles", "5")),
                  Expanded(child: _informationCard("Permissions", "78"))
                ],
              ),
              const SizedBox(height: 20),
              Expanded(child: UserTable())
            ],
          ),
        ),
      ),
    );
  }

  static Widget _informationCard(String title, String value) {
    return Card(
      elevation: 1,
      color: AppColors.background,
      shadowColor: null,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.textSecondary.withOpacity(0.5)),),
            const SizedBox(height: 10,),
            Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black.withOpacity(0.8), fontSize: 24),)
          ],
        ),
      ),
    );
  }
}
