import 'package:uuid/uuid.dart';

class B2BuyGoodsRequest {
  final String shortCode;
  final String amount;
  final String recieverShortCode;
  final String accountReference;
  final String idempotencyKey;
  final String? remarks;

  B2BuyGoodsRequest({
    required this.shortCode,
    required this.amount,
    required this.recieverShortCode,
    required this.accountReference,
    this.remarks,
  }) : idempotencyKey = const Uuid().v4();

  Map<String, dynamic> toJson() {
    return {
      "shortCode": shortCode,
      "amount": amount,
      "recieverShortCode": recieverShortCode,
      "accountReference": accountReference,
      "idempotencyKey": idempotencyKey,
      if (remarks != null && remarks!.trim().isNotEmpty) "remarks": remarks,
    };
  }
}
