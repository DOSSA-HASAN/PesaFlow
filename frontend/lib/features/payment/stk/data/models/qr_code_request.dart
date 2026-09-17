class QrCodeRequest {
  final String shortCode;
  final String refNo;
  final String amount;

  QrCodeRequest({
    required this.shortCode,
    required this.refNo,
    required this.amount,
  });

  Map<String, dynamic> toJson() {
    return {"shortCode": shortCode, "RefNo": refNo, "amount": amount};
  }
}
