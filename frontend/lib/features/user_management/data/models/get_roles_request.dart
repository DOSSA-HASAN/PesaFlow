import 'dart:convert';

class GetRolesRequest {
  final String id;
  final String name;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final List<dynamic> permissions;

  GetRolesRequest({
    required this.id,
    required this.name,
    this.createdAt,
    this.updatedAt,
    required this.permissions,
  });

  factory GetRolesRequest.fromJson(Map<String, dynamic> json) {
    return GetRolesRequest(
      id: json["id"],
      name: json["name"],
      permissions: json["Permissions"],
      createdAt: json["createdAt"],
      updatedAt: json["updatedAt"]
    );
  }
}
