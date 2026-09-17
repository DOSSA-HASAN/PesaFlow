import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/user_management/data/models/add_user_request.dart';
import 'package:frontend/features/user_management/data/repository/add_user_repository.dart';

final dioProvider = Provider<Dio>((ref) {
  return DioClient().instance;
});

final addUserRepository = Provider<AddUserRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return AddUserRepository(dio);
});

final addUserNotifierProvider =
    StateNotifierProvider<AddUserNotifier, AsyncValue<bool>>((ref) {
      final repository = ref.watch(addUserRepository);
      return AddUserNotifier(repository, ref);
    });

class AddUserNotifier extends StateNotifier<AsyncValue<bool>> {
  final AddUserRepository _repository;
  final Ref _ref;

  AddUserNotifier(this._repository, this._ref) : super(const AsyncData(false));

  Future<void> submitAddUser(String email, String password, List<String> roleIds) async {
    try {
      state = AsyncLoading();
      final request = AddUserRequest(
        email: email,
        password: password,
        roleIds: roleIds,
      );
      final response = await _repository.addUser(request);
      if(response.statusCode == 200){
        state = AsyncData(true);
      } else {
        throw Exception("Failed to create user");
      }
    } catch (e, stacTrace) {
      print(e);
    }
  }
}
