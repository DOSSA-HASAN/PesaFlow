import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/features/payment/b2Paybill/data/models/b2_paybill_callback_request.dart';

final b2PaybillCallbackProvider =
    StateNotifierProvider<
      B2PaybillCallbackNotifier,
      AsyncValue<B2PaybillCallbackRequest?>
    >((ref) {
      return B2PaybillCallbackNotifier();
    });

class B2PaybillCallbackNotifier
    extends StateNotifier<AsyncData<B2PaybillCallbackRequest?>> {
  B2PaybillCallbackNotifier() : super(const AsyncData(null));

  void updateCallbackData(B2PaybillCallbackRequest data) {
    final request = B2PaybillCallbackRequest(
      message: data.message,
      reference: data.reference,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      partyA: data.partyA,
      partyB: data.partyB,
      resultDescription: data.resultDescription,
    );

    print(
      "Printing callback request data for widget file: ${request.toJson()}",
    );
    state = AsyncData(request);
  }
}
