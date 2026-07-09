import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:frontend/core/widgets/toast_util.dart';
import 'package:frontend/features/payment/b2BuyGoods/data/models/b2_buy_goods_callback_request.dart';
import 'package:frontend/features/payment/b2BuyGoods/provider/b2_buy_goods_callback_provider.dart';
import "package:socket_io_client/socket_io_client.dart" as IO;
import 'package:toastification/toastification.dart';

class SocketService {
  IO.Socket? _socket;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  void connectSockets(BuildContext context) async {
    print("🔌 SocketService: connectSockets triggered.");

    // 1. Clean up any existing instances from hot restarts
    if (_socket != null) {
      print("🧹 Disposing lingering socket connection...");
      _socket?.destroy();
      _socket = null;
    }

    // 2. Read the token with a short programmatic fallback delay if it's missing
    String? token = await _secureStorage.read(key: "access_token");

    if (token == null) {
      print(
        "⏳ Token not found instantly. Waiting 500ms for secure storage disk write...",
      );
      await Future.delayed(const Duration(milliseconds: 500));
      token = await _secureStorage.read(key: "access_token");
    }

    if (token == null) {
      print("❌ Sockets Aborted: Token is still null after retry check.");
      return;
    }

    print("🔑 Token successfully retrieved! Setting up connection streams...");

    try {
      // NOTE: If using an Android Emulator, replace localhost with 10.0.2.2
      _socket = IO.io(
        "http://localhost:5213/",
        IO.OptionBuilder()
            .setTransports(["websocket"])
            .disableAutoConnect()
            .setAuth({"token": token})
            .build(),
      );

      _socket?.connect();

      // 3. Setup verbose debug listeners to catch failures immediately
      _socket?.onConnect((_) => print("Sockets connected successfully ✅"));
      _socket?.onConnectError(
        (data) => print("❌ Socket Handshake Error: $data"),
      );
      _socket?.onError((data) => print("💥 General Socket Error: $data"));
      _socket?.onDisconnect((data) => print("🔌 Sockets disconnected: $data"));

      _socket?.on("stk:callback", (data) {
        if (context.mounted) {
          ToastUtil.showPaymentToast(context, data);
        }
      });

      _socket?.on("payment:callback:b2buygoods", (data) {
        if (context.mounted) {
          print("Running sockets for b2buygoods callback");
          print(data);
          try {
            final callbackData = B2BuyGoodsCallbackRequest.fromJson(data);

            ProviderScope.containerOf(context)
                .read(b2BuyGoodsCallbackProvider.notifier)
                .updateCallbackData(callbackData);
          } catch (e, stackTrace) {
            print("Running socket error catch block");
            ToastUtil.showGeneralToast(
              context: context,
              type: ToastificationType.error,
              title: "Business To BuyGoods Callback Error",
              description: e.toString(),
            );
          }
          ToastUtil.showPaymentToast(context, data);
        }
      });
    } catch (e) {
      print("🚨 Exception caught setting up socket client: $e");
    }
  }

  void disconnectSockets() {
    _socket?.disconnect();
    _socket?.destroy();
    _socket = null;
    print("🔌 Sockets cleanly torn down.");
  }
}
