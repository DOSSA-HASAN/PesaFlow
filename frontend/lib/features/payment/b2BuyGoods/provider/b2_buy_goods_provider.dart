import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/core/widgets/toast_util.dart';
import 'package:frontend/features/payment/b2BuyGoods/data/models/b2_buy_goods_request.dart';
import 'package:frontend/features/payment/b2BuyGoods/data/repository/b2_buy_goods_repository.dart';
import 'package:toastification/toastification.dart';

final dioProvider = Provider<Dio>((ref) {
  return DioClient().instance;
});

final b2BuyGoodsRepository = Provider<B2BuyGoodsRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return B2BuyGoodsRepository(dio);
});

final b2BuyGoodsProvider =
    StateNotifierProvider<B2BuyGoodsNotifier, AsyncValue<bool>>((ref) {
      final repository = ref.watch(b2BuyGoodsRepository);
      return B2BuyGoodsNotifier(repository, ref);
    });

class B2BuyGoodsNotifier extends StateNotifier<AsyncValue<bool>> {
  final B2BuyGoodsRepository _repository;
  final Ref _ref;

  B2BuyGoodsNotifier(this._repository, this._ref)
    : super(const AsyncData(false));

  Future<void> submitB2BuyGoods(
    String shortCode,
    String amount,
    String recieverShortCode,
    String accountReference,
  ) async {
    state = AsyncLoading();
    try {
      final request = B2BuyGoodsRequest(
        shortCode: shortCode,
        amount: amount,
        recieverShortCode: recieverShortCode,
        accountReference: accountReference,
      );
      final success = await _repository.b2BuyGoods(request);
      if (success.statusCode == 200) {
        state = AsyncData(true);
      } else {
        throw Exception("Could not initiate b2-buygoods payment!");
      }
    } catch (e, stackTrace) {
      state = AsyncError(e, stackTrace);
    }
  }
}
