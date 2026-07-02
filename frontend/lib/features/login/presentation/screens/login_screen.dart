import "dart:math";

import "package:flutter/material.dart";
import "package:flutter/rendering.dart";
import "package:frontend/core/widgets/btn.dart";
import "package:frontend/core/widgets/text_field.dart";
import "package:frontend/features/login/presentation/widgets/login_error_view.dart";
import "package:frontend/features/login/presentation/widgets/welcome_sidebar.dart";

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Controllers for input fields
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // TODO: What does dispose do why do dispose what happens if u dont do dispose
  @override
  void dispose() {
    super.dispose();
    _emailController.dispose();
    _passwordController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final bool isDesktopView = constraints.maxWidth >= 1024;

          // Show error message if device width is less than 1024px
          if (!isDesktopView) {
            return Container(
              padding: const EdgeInsets.all(32),
              child: Center(
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 400),
                  child: LoginErrorView(
                    title: "Desktop Workspace Required",
                    message:
                        "For financial security and auditing compliance, the M-Pesa Merchant Portal can only be accessed via secure desktop terminals with screen widths above 1024px.",
                    icon: Icons.desktop_access_disabled_rounded,
                  ),
                ),
              ),
            );
          }
          return Row(
            children: [
              // Welcome screen
              // TODO: what does flex 1 do what i did flex 2
              const Expanded(flex: 1, child: WelcomeSidebar()),

              // Login form section
              Expanded(
                flex: 1,
                child: Container(
                  margin: EdgeInsets.all(100),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    // TODO: What does stretch do
                    children: [
                      // Login form
                      Container(
                        padding: EdgeInsets.all(32.0),
                        constraints: BoxConstraints(maxWidth: 400),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: theme.colorScheme.onSurface.withOpacity(
                              0.06,
                            ),
                          ),
                        ),
                        child: Column(
                          // Secure Login Decorative Element
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                vertical: 6,
                                horizontal: 12,
                              ),
                              decoration: BoxDecoration(
                                color: theme.colorScheme.primary.withOpacity(
                                  0.1,
                                ),
                                borderRadius: BorderRadius.circular(30),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.lock_outline_rounded,
                                    size: 15,
                                    color: theme.colorScheme.onSurface,
                                  ),
                                  const SizedBox(width: 10),
                                  Text(
                                    "SECURE LOGIN",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                      letterSpacing: 1,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),
                            Text(
                              "Merchant Portal",
                              style: TextStyle(
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                                color: theme.colorScheme.onSecondary,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              "Manage your business payments securely",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.normal,
                                color: theme.colorScheme.onSecondary.withOpacity(0.5)
                              ),
                            ),
                            const SizedBox(height: 50),
                            CustomTextField(
                              label: "Business Email or Username",
                              hintText: "e.g. cashier@business.com",
                              prefixIcon: Icon(Icons.person_outline_rounded),
                            ),
                            const SizedBox(height: 15),
                            CustomTextField(
                              label: "Password",
                              hintText: "******",
                              prefixIcon: Icon(Icons.lock_open_rounded),
                            ),
                            const SizedBox(height: 15),
                            CustomButton(label: "Login", onPressed: (){}, width: 440, height: 50,)
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
