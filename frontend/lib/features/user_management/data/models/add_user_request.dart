class AddUserRequest {
  final String email;
  final String password;
  final List<String> roleIds;

  // add this in the backend & then enable it in the frontend
  // final String userPassword;

  AddUserRequest({
    required this.email,
    required this.password,
    required this.roleIds,
  });

  Map<String, dynamic> toJson() {
    return {"email": email, "password": password, "roleIds": roleIds};
  }
}
