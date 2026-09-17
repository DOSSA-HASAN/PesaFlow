import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/error/network_error_util.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/payment/b2Paybill/data/models/b2_paybill_request.dart';
import 'package:frontend/features/payment/b2Paybill/data/repository/b2_paybill_repository.dart';

final dioProvider = Provider<Dio>((ref) {
  return DioClient().instance;
});

final b2PaybillRepository = Provider<B2PaybillRepository>((ref) {
  final dioClient = ref.watch(dioProvider);
  return B2PaybillRepository(dioClient);
});

final b2PaybillProvider =
    StateNotifierProvider<B2PaybillNotifier, AsyncValue<bool>>((ref) {
      final repository = ref.watch(b2PaybillRepository);
      return B2PaybillNotifier(repository, ref);
    });

class B2PaybillNotifier extends StateNotifier<AsyncValue<bool>> {
  final B2PaybillRepository _repository;
  final Ref _ref;

  B2PaybillNotifier(this._repository, this._ref) : super(const AsyncData(true));

  Future<void> submitB2Paybill(
    String shortCode,
    String amount,
    receiverShortCode,
    String accountRef,
    String remarks,
  ) async {
    state = AsyncLoading();
    try {
      final request = B2PaybillRequest(
        shortCode: shortCode,
        amount: amount,
        receiverShortCode: receiverShortCode,
        accountRef: accountRef,
        remarks: remarks
      );

      final response = await _repository.b2paybill(request);
      if(response.statusCode == 200){
        state = AsyncData(true);
      } else {
        throw Exception("Could not initiate b2paybill transaction");
      }
    } catch (e, stackTrace) {
      final String errorMessage = NetworkErrorUtil.getErrorMessage(e);
      state = AsyncValue.error(errorMessage, stackTrace);
    }
  }
}
