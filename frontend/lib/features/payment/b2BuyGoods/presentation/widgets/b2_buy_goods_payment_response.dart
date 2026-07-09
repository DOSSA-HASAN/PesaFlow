import "package:flutter/material.dart";

class B2BuyGoodsPaymentResponse extends StatelessWidget {
  const B2BuyGoodsPaymentResponse({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      decoration: BoxDecoration(
        border: Border(left: BorderSide(color: theme.colorScheme.onSecondary.withOpacity(0.05)))
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.receipt_long, size: 50, color: theme.colorScheme.onSecondary.withOpacity(0.3),),
          const SizedBox(height: 20,),
          Text("No Active Transaction", textAlign: TextAlign.center, style: TextStyle(fontSize: 20, color: theme.colorScheme.onSecondary.withOpacity(0.5), fontWeight: FontWeight.bold),),
          const SizedBox(height: 10,),
          Text(
            "Initiate a Business-to-Buy-Goods payment. Real time response and transaction details will stream here.",
            textAlign: TextAlign.center,
            style: TextStyle(color: theme.colorScheme.onSecondary.withOpacity(0.3)),
          ),
        ],
      ),
    );
  }
}
