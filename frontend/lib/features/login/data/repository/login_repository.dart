import 'package:dio/dio.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/login/data/models/login_request.dart';

class LoginRepository {
  final Dio _dio;

  LoginRepository(this._dio);

  Future<Response> login(LoginRequest requestDetails) async {
    final response = await _dio.post("/auth/login", data: requestDetails);

    return response;
  }
}
