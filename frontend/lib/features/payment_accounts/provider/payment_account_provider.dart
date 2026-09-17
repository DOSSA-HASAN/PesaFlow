import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/payment_accounts/data/models/payment_account_model.dart';
import 'package:frontend/features/payment_accounts/data/repository/payment_account_repository.dart';
import 'package:frontend/features/payment_accounts/provider/selected_payment_account_provider.dart';

final dioProvider = Provider<Dio>((ref) {
  return DioClient().instance;
});

final paymentAccountsRepositoryProvider = Provider<PaymentAccountRepository>((
  ref,
) {
  final dio = ref.watch(dioProvider);
  return PaymentAccountRepository(dio);
});

final paymentAccountsProvider =
    StateNotifierProvider<
      PaymentAccountNotifier,
      AsyncValue<List<PaymentAccountModel>>
    >((ref) {
      final repository = ref.watch(paymentAccountsRepositoryProvider);
      return PaymentAccountNotifier(repository, ref);
    });

class PaymentAccountNotifier
    extends StateNotifier<AsyncValue<List<PaymentAccountModel>>> {
  final PaymentAccountRepository _repository;
  final Ref _ref;

  PaymentAccountNotifier(this._repository, this._ref)
    : super(const AsyncData([]));

  Future<void> getPaymentAccounts() async {
    try {
      state = AsyncLoading();
      final response = await _repository.getPaymentAccounts();

      if (response.statusCode == 200) {
        final backendData = response.data["data"];
        _ref.watch(selectedAccountProvider.notifier).state = null;
        print(backendData);
        final accounts = (backendData as List)
            .map((account) => PaymentAccountModel.fromJson(account))
            .toList();

        state = AsyncData(accounts);
      }
    } catch (e, stackTrace) {
      state = AsyncError(e, stackTrace);
    }
  }
}
