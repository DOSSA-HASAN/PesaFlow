import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/features/login/data/models/login_request.dart';
import 'package:frontend/features/login/data/repository/login_repository.dart';

final loginProvider = StateNotifierProvider<LoginNotifier, AsyncValue<bool>>((
  ref,
) {
  return LoginNotifier(LoginRepository());
});

class LoginNotifier extends StateNotifier<AsyncValue<bool>> {
  final LoginRepository _repository;

  LoginNotifier(this._repository) : super(const AsyncData(false));

  Future<void> loginSubmit(String email, String password) async {
    state = AsyncLoading();

    final request = LoginRequest(email: email, password: password);
    final success = await _repository.login(request);

    if (success) {
      state = AsyncData(true);
    } else {
      state = AsyncError(
        "Invalid Credentials or Connection Error",
        StackTrace.current,
      );
    }
  }
}
