import 'package:dio/dio.dart';
import 'package:frontend/features/user_management/data/models/get_roles_request.dart';

class GetRolesRepository {
  final Dio _dio;

  GetRolesRepository(this._dio);

  Future<Response> getRoles() async {
    final response = await _dio.get("/roles");
    return response;
  }
}
