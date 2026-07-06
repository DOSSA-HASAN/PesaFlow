import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/core/services/storage_service.dart';
import 'package:frontend/features/login/data/models/login_request.dart';
import 'package:frontend/features/login/data/models/user_model.dart';
import 'package:frontend/features/login/data/repository/login_repository.dart';
import 'package:frontend/features/login/provider/user_provider.dart';
import 'package:frontend/providers/error_provider.dart';

// Why create this func
final dioProvider = Provider<Dio>((ref) {
  return DioClient().instance;
});

// Why create this func
final loginRepositoryProvider = Provider<LoginRepository>((ref) {
  final dio = ref.watch(dioProvider); // Why ref.watch
  return LoginRepository(dio);
});

final loginProvider = StateNotifierProvider<LoginNotifier, AsyncValue<bool>>((
  ref,
) {
  final repository = ref.watch(loginRepositoryProvider); // Why ref.watch
  return LoginNotifier(repository, ref);
});

class LoginNotifier extends StateNotifier<AsyncValue<bool>> {
  final LoginRepository _repository;
  final Ref _ref;

  LoginNotifier(this._repository, this._ref) : super(const AsyncData(false));

  Future<void> loginSubmit(String email, String password) async {
    state = AsyncLoading();
    try {
      final request = LoginRequest(email: email, password: password);
      debugPrint("Email: ${request.email}");
      debugPrint("Password: ${request.password}");
      final response = await _repository.login(request);

      if (response.statusCode == 200) {
        final backendData = response.data["data"];
        final accessToken = backendData["accessToken"];
        final refreshToken = backendData["refreshToken"];
        final UserModel user = UserModel.fromJson(backendData["user"]);

        await _ref
            .read(storageProvider)
            .saveTokens(access: accessToken, refresh: refreshToken);

        _ref.read(userProvider.notifier).setUser(user);

        state = const AsyncData(true);

      } else {
        throw Exception("Authentication failed.");
      }
    } catch (e, stackTrace) {
      state = AsyncError(e, stackTrace);

      String errorMessage = "Login Failed: An unexpected error occurred";

      if (e is DioException) {
        final responseData = e.response?.data;
        if (responseData != null && responseData is Map<String, dynamic>) {
          errorMessage = responseData["message"] ?? "Authentication failed";
        } else {
          errorMessage = "Network connection error";
        }
      } else if (e is Exception) {
        errorMessage = e.toString().replaceAll("Exception: ", "");
      }

      print(e);

      _ref.read(errorProvider.notifier).showError(errorMessage);
    }
  }
}
