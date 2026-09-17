import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/payment/stk/data/models/stk_request.dart';
import 'package:frontend/features/payment/stk/data/repository/stk_repository.dart';
import 'package:frontend/providers/error_provider.dart';

final dioProvider = Provider<Dio>((ref) {
  return DioClient().instance;
});

final stkRepository = Provider<StkRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return StkRepository(dio);
});

final stkProvider = StateNotifierProvider<StkNotifier, AsyncValue<bool>>((ref) {
  final repository = ref.watch(stkRepository);
  return StkNotifier(repository, ref);
});

class StkNotifier extends StateNotifier<AsyncValue<bool>> {
  final StkRepository _repository;
  final Ref _ref;

  StkNotifier(this._repository, this._ref) : super(const AsyncData(false));

  Future<void> stkPrompt(String shortCode,
      String amount,
      String phoneNumber,
      String? reference,
      String? description,) async {
    state = AsyncLoading();
    try {
      final request = StkRequest(
          shortCode: shortCode,
          amount: amount,
          phoneNumber: phoneNumber,
          accountRef: reference,
          description: description
      );
      print("STK Request: ${request.toJson()}");
      final response = await _repository.stkPrompt(request);

      if (response.statusCode == 200) {
        state = AsyncData(true);
      } else {
        throw Exception("An Error Occurred. Could not prompt!");
      }
    } catch (e, stackTrace) {
      if (e is DioException) {
        final message = e.response?.data["message"] ?? e.message;

        state = AsyncError(message, stackTrace);
        _ref.read(errorProvider.notifier).showError(message);
      } else {
        state = AsyncError(e, stackTrace);
        _ref.read(errorProvider.notifier).showError(e.toString());
      }
    }
  }
}
