import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/payment/b2C/data/models/b2c_request.dart';
import 'package:frontend/features/payment/b2C/data/repository/b2c_repository.dart';

final dioProvider = Provider<Dio>((ref) {
  return DioClient().instance;
});

final b2cRepositoryProvider = Provider<B2cRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return B2cRepository(dio);
});

final b2cProvider = StateNotifierProvider<B2CNotifier, AsyncValue<bool>>((ref) {
  final repository = ref.watch(b2cRepositoryProvider);
  return B2CNotifier(repository, ref);
});

class B2CNotifier extends StateNotifier<AsyncValue<bool>> {
  B2cRepository _repository;
  Ref _ref;

  B2CNotifier(this._repository, this._ref) : super(const AsyncData(false));

  Future<void> submitB2c(
    String shortCode,
    String commandId,
    String amount,
    String receiver,
  ) async {
    state = AsyncLoading();
    try {
      final request = B2cRequest(
        shortCode: shortCode,
        commandId: commandId,
        amount: amount,
        receiver: receiver,
      );

      final response = await _repository.b2c(request);
      if (response.statusCode == 200) {
        state = AsyncData(true);
      }
    } catch (e, stackTrace) {
      state = AsyncError(e, stackTrace);
    }
  }
}
