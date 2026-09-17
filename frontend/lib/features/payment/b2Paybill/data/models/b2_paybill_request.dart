import 'package:uuid/uuid.dart';

class B2PaybillRequest {
  final String shortCode;
  final String amount;
  final String receiverShortCode;
  final String accountRef;
  final String? remarks;
  final String idempotencyKey;

  B2PaybillRequest({
    required this.shortCode,
    required this.amount,
    required this.accountRef,
    required this.receiverShortCode,
    this.remarks,
  }) : idempotencyKey = const Uuid().v4();
  
  Map<String, dynamic> toJson(){
    return {
      "shortCode": shortCode,
      "amount": amount,
      "accountRef": accountRef,
      "receiverShortCode": receiverShortCode,
      "idempotencyKey": idempotencyKey,
      if(remarks != null && remarks!.trim().isNotEmpty) "remarks": remarks
    };
  }
}
