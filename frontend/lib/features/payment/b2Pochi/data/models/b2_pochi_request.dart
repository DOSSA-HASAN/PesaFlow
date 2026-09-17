import 'package:uuid/uuid.dart';

class B2PochiRequest {
  final String shortCode;
  final String amount;
  final String reciever;
  final String? remarks;
  final String reference;
  final String idempotencyKey;

  B2PochiRequest({
    required this.shortCode,
    required this.amount,
    required this.reciever,
    this.remarks,
    required this.reference,
  }) : idempotencyKey = const Uuid().v4();

  Map<String, dynamic> toJson(){
    return {
      "shortCode": shortCode,
      "amount": amount,
      "reciever": reciever,
      if(remarks != null && remarks!.trim().isNotEmpty) "remarks": remarks,
      "reference": reference,
      "idempotencyKey": idempotencyKey,
    };
  }
}
