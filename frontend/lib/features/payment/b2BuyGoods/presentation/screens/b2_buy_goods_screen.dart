import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:frontend/core/widgets/btn.dart";
import "package:frontend/core/widgets/text_field.dart";
import "package:frontend/core/widgets/toast_util.dart";
import "package:frontend/features/payment/b2BuyGoods/presentation/widgets/b2_buy_goods_payment_response.dart";
import "package:frontend/features/payment/b2BuyGoods/provider/b2_buy_goods_provider.dart";
import "package:frontend/features/payment/stk/provider/stk_provider.dart";
import "package:toastification/toastification.dart";

class B2BuyGoodsScreen extends ConsumerStatefulWidget {
  const B2BuyGoodsScreen({super.key});

  @override
  ConsumerState<B2BuyGoodsScreen> createState() => _B2BuyGoodsScreenState();
}

class _B2BuyGoodsScreenState extends ConsumerState<B2BuyGoodsScreen> {
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _receiverTillController = TextEditingController();
  final TextEditingController _accountRefController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final _b2BuyGoodsRef = ref.watch(b2BuyGoodsProvider);
    ref.listen<AsyncValue<bool>>(b2BuyGoodsProvider, (previous, next) {
      if (next is AsyncData && next.value == true) {
        _amountController.clear();
        _receiverTillController.clear();
        _accountRefController.clear();
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.success,
          title: "B2BuyGoods Payment Success",
          description:
              "B2BuyGoods payment has been submitted and is now being processed.",
        );
      } else if (next is AsyncError) {
        print("b2buygoods screeen errorr");
        ToastUtil.showGeneralToast(
          context: context,
          type: ToastificationType.error,
          title: "B2BuyGoods Payment Failed",
          description: next.error.toString(),
        );
      }
    });
    return Container(
      constraints: BoxConstraints(maxWidth: 1000),
      clipBehavior: Clip.hardEdge,
      margin: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        color: theme.colorScheme.onPrimary,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.colorScheme.onSecondary.withOpacity(0.1),
        ),
        boxShadow: [
          BoxShadow(
            color: theme.colorScheme.onSecondary.withOpacity(0.08),
            offset: Offset(1, 1),
            blurRadius: 10,
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            flex: 1,
            child: Column(
              children: [
                Expanded(
                  child: Container(
                    padding: EdgeInsets.all(30),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              Icons.shield_rounded,
                              color: theme.colorScheme.primary,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              "SECURE PAYMENT",
                              style: TextStyle(
                                color: theme.colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          "Business To Buy Goods Transaction",
                          style: TextStyle(
                            color: theme.colorScheme.onSecondary.withOpacity(
                              0.8,
                            ),
                            fontSize: 40,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          "All fields are required. Once submitted wait for confirmation notification.",
                          textAlign: TextAlign.left,
                          style: TextStyle(
                            color: theme.colorScheme.onSecondary.withOpacity(
                              0.5,
                            ),
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 40),
                        Row(
                          // crossAxisAlignment: CrossAxisAlignment.start,
                          // mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Expanded(
                              child: CustomTextField(
                                label: "Payment Amount (KES)",
                                hintText: "12,450",
                                prefixIcon: Icon(Icons.money),
                                controller: _amountController,
                              ),
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              child: CustomTextField(
                                label: "Receiver Till Number",
                                hintText: "600000",
                                prefixIcon: Icon(Icons.numbers_rounded),
                                controller: _receiverTillController,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        CustomTextField(
                          label: "Invoice Number / Account Reference",
                          hintText: "INV-001-7-7-2026",
                          controller: _accountRefController,
                        ),
                        const SizedBox(height: 20),
                        CustomButton(
                          label: _b2BuyGoodsRef is AsyncLoading
                              ? "Processing payment..."
                              : "Buy Goods",
                          width: 400,
                          height: 50,
                          onPressed: _b2BuyGoodsRef is AsyncLoading
                              ? () {}
                              : () {
                                  //TODO: shortcode is hardcoded for now
                                  ref
                                      .read(b2BuyGoodsProvider.notifier)
                                      .submitB2BuyGoods(
                                        "600989",
                                        _amountController.text.trim(),
                                        _receiverTillController.text.trim(),
                                        _accountRefController.text.trim(),
                                      );
                                },
                        ),
                        const SizedBox(height: 30),
                        Flexible(
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(
                                  Icons.info_rounded,
                                  color: theme.colorScheme.primary,
                                ),
                                const SizedBox(width: 20),
                                Expanded(
                                  child: Text(
                                    "Payment transaction to buy goods.",
                                    softWrap: true,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(child: B2BuyGoodsPaymentResponse())
        ],
      ),
    );
  }
}
