import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/user_management/data/models/get_roles_request.dart';
import 'package:frontend/features/user_management/data/repository/get_roles_repository.dart';

final dioProvider = Provider<Dio>((ref) {
  return DioClient().instance;
});

final getRolesRepositoryProvider = Provider<GetRolesRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return GetRolesRepository(dio);
});

final getRolesNotifierProvider =
    StateNotifierProvider<GetRolesNotifier, AsyncValue<List<GetRolesRequest>>>((
      ref,
    ) {
      final repository = ref.watch(getRolesRepositoryProvider);
      return GetRolesNotifier(repository, ref);
    });

class GetRolesNotifier
    extends StateNotifier<AsyncValue<List<GetRolesRequest>>> {
  final GetRolesRepository _repository;
  final Ref _ref;

  GetRolesNotifier(this._repository, this._ref) : super(AsyncData([]));

  Future<List<GetRolesRequest>> submitGetRoles() async {
    state = AsyncLoading();
    try {
      final response = await _repository.getRoles();
      if (response.statusCode == 200) {
        final backendData = response.data["data"] as List;
        final roles = backendData
            .map((json) => GetRolesRequest.fromJson(json))
            .toList();
        state = AsyncData(roles);
        return roles;
      }

      state = AsyncData([]);
      return [];
    } catch (e, stackTrace) {
      state = AsyncError(e, stackTrace);
      return [];
    }
  }
}
