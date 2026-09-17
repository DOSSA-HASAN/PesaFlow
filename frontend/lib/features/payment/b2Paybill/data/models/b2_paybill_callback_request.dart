class B2PaybillCallbackRequest {
  final String message;
  final String reference;
  final String status;
  final String amount;
  final String currency;
  final String partyA;
  final String partyB;
  final String resultDescription;

  B2PaybillCallbackRequest({
    required this.message,
    required this.reference,
    required this.status,
    required this.amount,
    required this.currency,
    required this.partyA,
    required this.partyB,
    required this.resultDescription,
  });

  Map<String, dynamic> toJson() {
    return {
      "message": message,
      "reference": reference,
      "status": status,
      "amount": amount,
      "currency": currency,
      "partyA": partyA,
      "partyB": partyB,
      "resultDescription": resultDescription,
    };
  }

  factory B2PaybillCallbackRequest.fromJson(Map<String, dynamic> json) {
    return B2PaybillCallbackRequest(
      message: json["message"] ?? "No Message Found",
      reference: json["reference"] ?? "No Reference Found",
      status: json["status"] ?? "Status Unknown",
      amount: json["amount"] ?? "0.00",
      currency: json["currency"] ?? "KES",
      partyA: json["partyA"] ?? "Internal Business ShortCode",
      partyB: json["partyB"] ?? "External Receiver ShortCode",
      resultDescription:
      json["resultDescription"] ?? "No Result Description Provided",
    );
  }
}
