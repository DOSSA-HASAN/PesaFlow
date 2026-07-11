import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/core/widgets/toast_util.dart";
import "package:frontend/features/payment/b2BuyGoods/data/models/b2_buy_goods_callback_request.dart";
import "package:frontend/features/payment/b2BuyGoods/provider/b2_buy_goods_callback_provider.dart";
import "package:frontend/features/payment/b2BuyGoods/provider/b2_buy_goods_provider.dart";
import "package:toastification/toastification.dart";

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
    final callbackState = ref.watch(b2BuyGoodsCallbackProvider);

    return callbackState.when(
      data: (callbackData) {
        if (callbackData == null) {
          return Container(
            padding: const EdgeInsets.all(20),
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
                  Icons.receipt_long_rounded,
                  color: theme.colorScheme.onSecondary.withOpacity(0.3),
                  size: 80,
                ),
                const SizedBox(height: 20),
                Text(
                  "No Active Transaction",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: theme.colorScheme.onSecondary.withOpacity(0.4),
                  ),
                ),
                Text(
                  "Once you make a Business to BuyGoods transaction, the response will appear here. In case it does not, contact your developer",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.w400,
                    fontSize: 15,
                    color: theme.colorScheme.onSecondary.withOpacity(0.4),
                  ),
                ),
              ],
            ),
          );
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              border: Border(
                left: BorderSide(
                  color: theme.colorScheme.onSecondary.withOpacity(0.1),
                ),
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline_rounded,
                  color: theme.colorScheme.onSecondary.withOpacity(0.3),
                  size: 80,
                ),
                const SizedBox(height: 20),
                Text(
                  "Error receiving payment results",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    color: theme.colorScheme.onSecondary.withOpacity(0.4),
                  ),
                ),
                Text(
                  "An error occurred while trying to fetch the payment results. Contact our developer.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.w400,
                    fontSize: 15,
                    color: theme.colorScheme.onSecondary.withOpacity(0.4),
                  ),
                ),
              ],
            ),
          );
        }

        return Container(
          padding: const EdgeInsets.all(20),
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
                padding: const EdgeInsets.only(bottom: 15),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: theme.colorScheme.onSecondary),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.network_cell_rounded,
                          color: theme.colorScheme.primary,
                          size: 35,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          "PAYMENT RESPONSE",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.onSecondary.withOpacity(
                              0.8,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 5,
                        horizontal: 10,
                      ),
                      decoration: BoxDecoration(
                        color:
                            callbackData.status.toString().toUpperCase() ==
                                "SUCCESS"
                            ? theme.colorScheme.primary.withOpacity(0.2)
                            : Colors.redAccent.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: Text(
                        callbackData.status.toString().toUpperCase(),
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color:
                              callbackData.status.toString().toUpperCase() ==
                                  "SUCCESS"
                              ? theme.colorScheme.primary
                              : Colors.redAccent,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              _informationRow(
                context: context,
                field: "Reference",
                info: callbackData.reference,
              ),
              _informationRow(
                context: context,
                field: "Status",
                info: callbackData.status,
              ),
              _informationRow(
                context: context,
                field: "Amount",
                info: callbackData.amount,
              ),
              _informationRow(
                context: context,
                field: "Sender Short Code",
                info: callbackData.partyA,
              ),
              _informationRow(
                context: context,
                field: "Receiver Short Code",
                info: callbackData.partyB,
              ),
              _informationRow(
                context: context,
                field: "Result Description",
                info: callbackData.resultDescription,
              ),
              const SizedBox(height: 100),
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
      },
      error: (error, stackTrace) => Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          border: Border(
            left: BorderSide(
              color: theme.colorScheme.onSecondary.withOpacity(0.1),
            ),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline_rounded,
              color: theme.colorScheme.onSecondary.withOpacity(0.3),
              size: 80,
            ),
            const SizedBox(height: 20),
            Text(
              "Error receiving payment results",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 20,
                color: theme.colorScheme.onSecondary.withOpacity(0.4),
              ),
            ),
            Text(
              "An error occurred while trying to fetch the payment results. Contact our developer.",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontWeight: FontWeight.w400,
                fontSize: 15,
                color: theme.colorScheme.onSecondary.withOpacity(0.4),
              ),
            ),
          ],
        ),
      ),

      loading: () =>
          CircularProgressIndicator(color: theme.colorScheme.primary),
    );
  }

  static Widget _informationRow({
    required context,
    required String field,
    required String info,
  }) {
    final theme = Theme.of(context);
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            field,
            style: TextStyle(
              color: theme.colorScheme.onSecondary.withOpacity(0.5),
            ),
          ),
          Text(info, style: TextStyle(color: theme.colorScheme.onSecondary)),
        ],
      ),
    );
  }
}
