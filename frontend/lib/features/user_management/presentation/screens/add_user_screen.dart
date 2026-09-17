import "package:flutter/material.dart";
import "package:flutter/rendering.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/core/widgets/btn.dart";
import "package:frontend/core/widgets/text_field.dart";
import "package:frontend/core/widgets/toast_util.dart";
import "package:frontend/features/payment/stk/provider/stk_provider.dart";
import "package:frontend/features/payment_accounts/presentation/widgets/payment_accounts_dropdown.dart";
import "package:frontend/features/payment_accounts/provider/selected_payment_account_provider.dart";
import "package:frontend/features/user_management/presentation/widgets/filter_role_dropdown.dart";
import "package:frontend/features/user_management/presentation/widgets/role_selection.dart";
import "package:frontend/features/user_management/provider/add_user_provider.dart";
import "package:frontend/features/user_management/provider/roles_provider.dart";
import "package:lucide_icons/lucide_icons.dart";
import "package:toastification/toastification.dart";

class AddUserScreen extends ConsumerStatefulWidget {
  const AddUserScreen({super.key});

  @override
  ConsumerState<AddUserScreen> createState() => _AddUserScreenState();
}

class _AddUserScreenState extends ConsumerState<AddUserScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  final TextEditingController _userPasswordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _userPasswordController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    ref.watch(getRolesNotifierProvider.notifier).submitGetRoles();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final addUserState = ref.watch(addUserNotifierProvider);
    final getRolesState = ref.watch(getRolesNotifierProvider);
    late List<String> roleIds = [];

    ref.listen<AsyncValue<bool>>(addUserNotifierProvider, (next, previous) {
      if (next is AsyncValue<bool> && next.value == true) {
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.success,
          title: "Create User",
          description: "User has been created.",
        );
      }
      if (next is AsyncError<bool>) {
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.error,
          title: "Create User Failed",
          description: "Could not create user: ${next.error}.",
        );
      }
    });

    return Padding(
      padding: const EdgeInsets.all(0),
      child: Center(
        child: Container(
          clipBehavior: Clip.hardEdge,
          height: double.infinity,
          decoration: BoxDecoration(
            color: theme.colorScheme.onPrimary,
            // borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: theme.colorScheme.onSecondary.withOpacity(0.1),
            ),
            boxShadow: [
              BoxShadow(
                color: theme.colorScheme.onSecondary.withOpacity(0.08),
                offset: Offset(1, 1),
                blurRadius: 10,
                // blurRadius: 10,
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                flex: 1,
                child: Container(
                  padding: EdgeInsets.all(30),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Add User",
                        style: TextStyle(
                          color: theme.colorScheme.onSecondary.withOpacity(0.8),
                          fontSize: 30,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "Create a new user and assign them a role for your PesaFlow account.",
                        textAlign: TextAlign.left,
                        style: TextStyle(
                          color: theme.colorScheme.onSecondary.withOpacity(0.5),
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 10),
                      CustomTextField(
                        label: "Email Address",
                        hintText: "example@gmail.com",
                        prefixIcon: Icon(Icons.mail_rounded),
                        controller: _emailController,
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: CustomTextField(
                              label: "Password",
                              hintText: "8 Characters min",
                              prefixIcon: Icon(Icons.password_rounded),
                              controller: _passwordController,
                            ),
                          ),
                          const SizedBox(width: 20),
                          Expanded(
                            child: CustomTextField(
                              label: "Confirm Password",
                              hintText: "Re-enter password",
                              prefixIcon: Icon(Icons.password_rounded),
                              controller: _confirmPasswordController,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Label for role selection
                      Text(
                        "Select role",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: theme.colorScheme.onSecondary.withOpacity(0.7),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(15),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(
                              color: theme.colorScheme.onTertiary.withOpacity(
                                0.1,
                              ),
                            ),
                          ),
                          child: ref
                              .watch(getRolesNotifierProvider)
                              .when(
                                data: (data) {
                                  return ListView.builder(
                                    itemCount: data.length,
                                    itemBuilder: (context, index) {
                                      return RoleSelection(role: data[index]);
                                    },
                                  );
                                },
                                error: (e, stackTrace) {
                                  return Text("$e");
                                },
                                loading: () {
                                  return Center(
                                    child: CircularProgressIndicator(),
                                  );
                                },
                              ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      CustomButton(
                        label: addUserState.isLoading ? "Creating user...": "Create User",
                        onPressed: () {
                          ref
                              .watch(addUserNotifierProvider.notifier)
                              .submitAddUser(
                                _emailController.text.trim().toLowerCase(),
                                _passwordController.text.trim(),
                                roleIds,
                              );
                        },
                        width: 200,
                        height: 200,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
