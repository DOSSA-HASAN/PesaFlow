import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/features/payment/b2BuyGoods/data/models/b2_buy_goods_callback_request.dart";
import "package:frontend/features/payment/b2BuyGoods/provider/b2_buy_goods_callback_provider.dart";
import "package:frontend/features/payment/b2BuyGoods/provider/b2_buy_goods_provider.dart";

class B2BuyGoodsPaymentResponse extends ConsumerStatefulWidget {
  const B2BuyGoodsPaymentResponse({super.key});

  @override
  ConsumerState<B2BuyGoodsPaymentResponse> createState() =>
      _B2BuyGoodsPaymentResponseState();
}

class _B2BuyGoodsPaymentResponseState
    extends ConsumerState<B2BuyGoodsPaymentResponse> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final _b2BuyGoodsCallbackRef = ref.watch(b2BuyGoodsProvider);
    late B2BuyGoodsCallbackRequest _data;

    ref.listen<
      AsyncValue<B2BuyGoodsCallbackRequest?>
    >(b2BuyGoodsCallbackProvider, (previous, next) {
      next.whenOrNull(
        data: (callbackData) {
          if (callbackData == null) {
            return Container(
              decoration: BoxDecoration(
                border: Border(
                  left: BorderSide(
                    color: theme.colorScheme.onSecondary.withOpacity(0.05),
                  ),
                ),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.receipt_long,
                    size: 50,
                    color: theme.colorScheme.onSecondary.withOpacity(0.3),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    "No Active Transaction",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 20,
                      color: theme.colorScheme.onSecondary.withOpacity(0.5),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "Initiate a Business-to-Buy-Goods payment. Real time response and transaction details will stream here.",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: theme.colorScheme.onSecondary.withOpacity(0.3),
                    ),
                  ),
                ],
              ),
            );
          } else {
            _data = callbackData;
          }
        },
      );
    });
    return Container(
      decoration: BoxDecoration(
        border: Border(
          left: BorderSide(
            color: theme.colorScheme.onSecondary.withOpacity(0.05),
          ),
        ),
      ),
      child: Column(
        children: [
          Container(
            child: Row(
              children: [
                Row(
                  children: [
                    Icon(Icons.network_cell_rounded),
                    Text("PAYMENT RESPONSE"),
                  ],
                ),
                Container(child: Text(_data.status.toString().toUpperCase())),
              ],
            ),
          ),
          const SizedBox(height: 20),
          _informationRow(field: "Reference", info: _data.reference),
          _informationRow(field: "Status", info: _data.status),
          _informationRow(field: "Amount", info: _data.amount),
          _informationRow(field: "Sender Short Code", info: _data.partyA),
          _informationRow(field: "Receiver Short Code", info: _data.partyB),
          _informationRow(
            field: "Result Description",
            info: _data.resultDescription,
          ),
          const SizedBox(height: 10),
          Text(
            "Initiate a Business-to-Buy-Goods payment. Real time response and transaction details will stream here.",
            textAlign: TextAlign.center,
            style: TextStyle(
              color: theme.colorScheme.onSecondary.withOpacity(0.3),
            ),
          ),
        ],
      ),
    );
  }

  static Widget _informationRow({required String field, required String info}) {
    return Container(child: Row(children: [Text(field), Text(info)]));
  }
}
