import 'package:dio/dio.dart';
import 'package:frontend/features/user_management/data/models/add_user_request.dart';

class AddUserRepository {
  final Dio _dio;

  AddUserRepository(this._dio);

  Future<Response> addUser(AddUserRequest request) async {
    final response = await _dio.post("/user", data: request);
    return response;
  }
}
