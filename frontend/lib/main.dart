import "package:flutter/material.dart";
import "package:frontend/features/dashabord/presentation/widgets/app_sidebar.dart";
import "package:frontend/features/login/presentation/screens/login_screen.dart";
import "package:frontend/features/login/presentation/widgets/login_error_view.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/features/payment/stk/presentation/screens/stk_screen.dart";
import "package:frontend/features/root_gate.dart";
import "package:frontend/providers/error_provider.dart";
import "package:toastification/toastification.dart";
import "core/theme/app_theme.dart";

void main() {
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final error = ref.watch(errorProvider);
    return ToastificationWrapper(
      child: MaterialApp(
        title: "M-Pesa Business Portal",
        debugShowCheckedModeBanner: false,
      
        theme: AppTheme.lightTheme,
      
        home: Scaffold(
          body: LayoutBuilder(
            builder: (context, constraints) {
              final bool isDesktopView = constraints.maxWidth >= 1200;
      
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
              return SizedBox.expand(
                child: Stack(
                  children: [
                    // Widget to show screen based on auth status, if user is not
                    // logged in it shows login screen
                    RootGate(),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
