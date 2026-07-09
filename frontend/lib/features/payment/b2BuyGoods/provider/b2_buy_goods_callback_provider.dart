import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/features/payment/b2BuyGoods/data/models/b2_buy_goods_callback_request.dart';

final b2BuyGoodsCallbackProvider =
    StateNotifierProvider<
      B2BuyGoodsCallbackNotifier,
      AsyncData<B2BuyGoodsCallbackRequest?>
    >((ref) {
      return B2BuyGoodsCallbackNotifier();
    });

class B2BuyGoodsCallbackNotifier
    extends StateNotifier<AsyncData<B2BuyGoodsCallbackRequest?>> {
  B2BuyGoodsCallbackNotifier() : super(const AsyncData(null));

  void updateCallbackData(B2BuyGoodsCallbackRequest data) {
    final request = B2BuyGoodsCallbackRequest(
      message: data.message,
      reference: data.reference,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      partyA: data.partyA,
      partyB: data.partyB,
      resultDescription: data.resultDescription,
    );

    print("Printing callback request data for widget file: ${request.toJson()}");
    state = AsyncData(request);
  }
}
