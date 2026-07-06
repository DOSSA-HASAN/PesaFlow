class UserModel {
  final String id;
  final String email;
  final List<dynamic> permissions;

  UserModel({required this.id, required this.email, required this.permissions});

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json["id"] ?? json["_id"] ?? '',
      email: json["email"] ?? '',
      permissions: json["permissions"] ?? [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': this.id,
      'email': this.email,
      'permissions': this.permissions,
    };
  }
}
