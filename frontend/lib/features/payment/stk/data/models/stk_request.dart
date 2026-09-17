import 'package:uuid/uuid.dart';

class StkRequest {
  final String shortCode;
  final String amount;
  final String phoneNumber;
  final String idempotencyKey;
  final String? accountRef;
  final String? description;

  StkRequest({
    required this.shortCode,
    required this.amount,
    required this.phoneNumber,
    this.accountRef,
    this.description
  }) : idempotencyKey = const Uuid().v4();

  Map<String, dynamic> toJson() {
    return {
      "shortCode": shortCode,
      "amount": amount,
      "customerPhone": phoneNumber,
      "idempotencyKey": idempotencyKey,
      if(accountRef != null && accountRef!.trim().isNotEmpty) "accountRef": accountRef,
      if(description != null && description!.trim().isNotEmpty) "description": description
    };
  }
}
