import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/core/network/socket_service.dart';
import 'package:frontend/features/dashabord/presentation/widgets/app_sidebar.dart';
import 'package:frontend/features/dashabord/providers/navigation_provider.dart';
import 'package:frontend/features/login/presentation/screens/login_screen.dart';
import 'package:frontend/features/login/provider/user_provider.dart';
import 'package:frontend/features/payment/b2BuyGoods/presentation/screens/b2_buy_goods_screen.dart';
import 'package:frontend/features/payment/b2C/presentation/screens/b2c_screen.dart';
import 'package:frontend/features/payment/b2Paybill/presentation/screens/b2_paybill_screen.dart';
import 'package:frontend/features/payment/b2Pochi/presentation/screens/b2_pochi_screen.dart';
import 'package:frontend/features/payment/stk/presentation/screens/stk_screen.dart';
import 'package:frontend/features/user_management/presentation/screens/add_user_screen.dart';
import 'package:frontend/features/user_management/presentation/screens/user_management_screen.dart';

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

    // if (currentUser == null) {
    //   return const LoginScreen();
    // }

    // 1. Define your view routing matrix in the exact order of allowed sidebar items
    Widget getActiveScreen(int index) {
      // Create a list of views that matches your allowed items list setup
      switch (index) {
        case 0:
          return const StkScreen();
        case 1:
          return const B2BuyGoodsScreen();
        case 2:
          return const B2PaybillScreen();
        case 3:
          return const B2PochiScreen();
        case 4:
          return const B2CustomerScreen();
        case 5:
          return const UserManagementScreen();
        case 6:
          return const AddUserScreen();
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
