import 'package:flutter_riverpod/flutter_riverpod.dart';

class ErrorNotifier extends Notifier<String?> {
  @override
  String? build() {
    return null;
  }

  void showError(String message) {
    state = message;
  }

  void clearError() {
    state = null;
  }
}

final errorProvider = NotifierProvider<ErrorNotifier, String?>(
  ErrorNotifier.new,
);
