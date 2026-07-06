import "dart:math";

import "package:flutter/material.dart";
import "package:flutter/rendering.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/core/widgets/btn.dart";
import "package:frontend/core/widgets/text_field.dart";
import "package:frontend/features/login/presentation/widgets/login_error_view.dart";
import "package:frontend/features/login/presentation/widgets/security_footer.dart";
import "package:frontend/features/login/presentation/widgets/welcome_sidebar.dart";
import "package:frontend/features/login/provider/login_provider.dart";

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
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

    final loginState = ref.watch(loginProvider);

    ref.listen(loginProvider, (previous, next) {
      if (next is AsyncData<bool> && next == true) {
        print("✅ Ref.listen is working...");
      }
    });

    return Scaffold(
      body: Row(
        children: [
          // Welcome screen
          // TODO: what does flex 1 do what i did flex 2
          const Expanded(flex: 1, child: WelcomeSidebar()),

          // Login form section
          Expanded(
            flex: 1,
            child: SingleChildScrollView(
              child: Container(
                margin: EdgeInsets.symmetric(horizontal: 100),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  // mainAxisSize: MainAxisSize.max,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  // TODO: What does stretch do
                  children: [
                    // Login form
                    Container(
                      margin: const EdgeInsets.only(top: 50),
                      padding: EdgeInsets.all(32.0),
                      constraints: BoxConstraints(maxWidth: 400),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: theme.colorScheme.onSurface.withOpacity(0.06),
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
                              color: theme.colorScheme.primary.withOpacity(0.1),
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
                              color: theme.colorScheme.onSecondary.withOpacity(
                                0.5,
                              ),
                            ),
                          ),
                          const SizedBox(height: 50),
                          CustomTextField(
                            label: "Business Email or Username",
                            hintText: "e.g. cashier@business.com",
                            prefixIcon: Icon(Icons.person_outline_rounded),
                            controller: _emailController,
                          ),
                          const SizedBox(height: 15),
                          CustomTextField(
                            label: "Password",
                            hintText: "******",
                            prefixIcon: Icon(Icons.lock_open_rounded),
                            controller: _passwordController,
                          ),
                          const SizedBox(height: 15),
                          CustomButton(
                            label: loginState is AsyncLoading
                                ? "Authenticating..."
                                : "Login",
                            onPressed: loginState is AsyncLoading
                                ? () {}
                                : () {
                                    ref
                                        .read(loginProvider.notifier)
                                        .loginSubmit(
                                          _emailController.text.trim(),
                                          _passwordController.text,
                                        );
                                    print("Email controller: ${_emailController.text}");
                                    print("Password controller: ${_passwordController.text}");
                                  },
                            width: 440,
                            height: 50,
                          ),
                        ],
                      ),
                    ),
                    const SecurityFooter(),
                    const SizedBox(height: 1),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
