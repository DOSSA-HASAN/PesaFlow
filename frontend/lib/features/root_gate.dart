import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/core/network/socket_service.dart';
import 'package:frontend/features/dashabord/presentation/widgets/app_sidebar.dart';
import 'package:frontend/features/dashabord/providers/navigation_provider.dart';
import 'package:frontend/features/login/presentation/screens/login_screen.dart';
import 'package:frontend/features/login/provider/user_provider.dart';
import 'package:frontend/features/payment/stk/presentation/screens/stk_screen.dart';

class RootGate extends ConsumerStatefulWidget {
  const RootGate({super.key});

  @override
  ConsumerState<RootGate> createState() => _RootGateState();
}

class _RootGateState extends ConsumerState<RootGate> {
  final SocketService _socketService = SocketService();
  bool _isSocketConnected = false;

  @override
  void dispose() {
    // 3. Clean up and close the pipeline when this structural tree widget tears down
    _socketService.disconnectSockets();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = ref.watch(userProvider);
    final currentIndex = ref.watch(currentNavIndex);

    // 🚀 THE REACTIVE FIX: Listen for changes to the user state down the pipeline.
    // This fires instantly on hot restarts, cold boots, login, and logout!
    ref.listen(userProvider, (previous, next) {
      if (next != null) {
        print(
          "🔄 RootGate: User logged in or verified. Initializing streams...",
        );
        _socketService.connectSockets(context);
      } else {
        print("🔄 RootGate: User logged out. Severing socket streams...");
        _socketService.disconnectSockets();
      }
    });

    if (currentUser == null) {
      return const LoginScreen();
    }

    // 1. Define your view routing matrix in the exact order of allowed sidebar items
    Widget getActiveScreen(int index) {
      // Create a list of views that matches your allowed items list setup
      switch (index) {
        case 1:
          return const Center(child: Text("Dashboard Main Screen View"));
        case 0:
          return const StkScreen(); // 👈 Loads your STK payment view
        case 2:
          return const Center(child: Text("Auditing Logs View"));
        case 3:
          return const Center(child: Text("Settings Workspace View"));
        default:
          return const Center(child: Text("Dashboard Main Screen View"));
      }
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(width: 240, child: const AppSidebar()),
        // 2. Wrap the active view screen in an Expanded block so it takes up the rest of the workspace
        Expanded(child: getActiveScreen(currentIndex)),
      ],
    );
  }
}
