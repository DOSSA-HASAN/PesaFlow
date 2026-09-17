import 'package:uuid/uuid.dart';

class B2cRequest {
  final String shortCode;
  final String commandId;
  final String amount;
  final String receiver;
  final String? remarks;
  final String idempotencyKey;

  B2cRequest({
    required this.shortCode,
    required this.commandId,
    required this.amount,
    required this.receiver,
    this.remarks,
  }) : idempotencyKey = const Uuid().v4();

  Map<String, dynamic> toJson() {
    return {
      "shortCode": shortCode,
      "commandId": commandId,
      "amount": amount,
      "receiver": receiver,
      if (remarks != null && remarks!.trim().isNotEmpty) "remarks": remarks,
      "idempotencyKey": idempotencyKey,
    };
  }
}
