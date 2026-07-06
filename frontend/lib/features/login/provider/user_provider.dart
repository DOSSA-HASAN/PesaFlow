import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/features/login/data/models/user_model.dart';

class UserNotifier extends Notifier<UserModel?> {
  @override
  UserModel? build() => null;

  void setUser(UserModel user) {
    state = user;
  }

  void clearUser() {
    state = null;
  }
}

final userProvider = NotifierProvider<UserNotifier, UserModel?>(
  UserNotifier.new,
);
