class PaymentAccountModel {
  final String id;
  final String shortCode;
  final String branchName;
  final String type;
  final bool isBlocked;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const PaymentAccountModel({
    required this.id,
    required this.shortCode,
    required this.branchName,
    required this.type,
    required this.isBlocked,
    this.createdAt,
    this.updatedAt,
  });

  factory PaymentAccountModel.fromJson(Map<String, dynamic> json) {
    return PaymentAccountModel(
      id: json["id"],
      shortCode: json["shortCode"],
      branchName: json["branchName"],
      type: json["type"],
      isBlocked: json["isBlocked"] != true ? false : true,
      createdAt: json["createdAt"] != null
          ? DateTime.tryParse(json["createdAt"])
          : null,
      updatedAt: json["updatedAt"] != null
          ? DateTime.tryParse(json["updatedAt"])
          : null,
    );
  }

  Map<String, dynamic> toJson(){
    return {
      "id": id,
      "shortCode": shortCode,
      "branchName": branchName,
      "type": type,
      "isBlocked": isBlocked,
      "createdAt": createdAt,
      "updatedAt": updatedAt
    };
  }
}
