import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/payment/b2Pochi/data/models/b2_pochi_request.dart';
import 'package:frontend/features/payment/b2Pochi/data/repository/b2_pochi_repository.dart';
import 'package:frontend/providers/error_provider.dart';

final dioprovider = Provider<Dio>((ref) {
  return DioClient().instance;
});

final b2PochiRepositoryProvider = Provider<B2PochiRepository>((ref) {
  final dio = ref.watch(dioprovider);
  return B2PochiRepository(dio);
});

final b2PochiProvider =
    StateNotifierProvider<B2PochiNotifier, AsyncValue<bool>>((ref) {
      final repository = ref.watch(b2PochiRepositoryProvider);
      return B2PochiNotifier(repository, ref);
    });

class B2PochiNotifier extends StateNotifier<AsyncValue<bool>> {
  final B2PochiRepository _repository;
  final Ref _ref;

  B2PochiNotifier(this._repository, this._ref) : super(const AsyncData(false));

  Future<void> submitB2Pochi(
    String shortCode,
    String amount,
    String reciever,
    String? remarks,
    String reference,
  ) async {
    try {
      state = AsyncLoading();
      final request = B2PochiRequest(
        shortCode: shortCode,
        amount: amount,
        reciever: reciever,
        remarks: remarks,
        reference: reference,
      );
      final response = await _repository.b2PochiPayment(request);
      if (response.statusCode == 200) {
        state = AsyncData(true);
      } else {
        throw Exception("Could not initiate b2-paybill payment!");
      }
    } catch (e, stackTrace){
      if(e is DioException){
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
