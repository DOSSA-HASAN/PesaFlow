import 'package:uuid/uuid.dart';

class StkRequest {
  final String shortCode;
  final String amount;
  final String phoneNumber;
  final String idempotencyKey;

  StkRequest({
    required this.shortCode,
    required this.amount,
    required this.phoneNumber,
  }) : idempotencyKey = const Uuid().v4();

  Map<String, dynamic> toJson() {
    return {
      "shortCode": "174379",
      "amount": amount,
      "customerPhone": phoneNumber,
      "idempotencyKey": idempotencyKey,
    };
  }
}
