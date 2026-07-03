import 'package:dio/dio.dart';
import 'package:frontend/core/network/dio_client.dart';
import 'package:frontend/features/login/data/models/login_request.dart';

class LoginRepository {
  // preconfigured network instance
  final Dio _dio = DioClient().instance;

  // Api call
  Future<bool> login(LoginRequest requestDetails) async {
    try {
      print("Calling backend");
      final response = await _dio.post(
          '/api/auth/login', // TODO: check api route if its correct
          data: requestDetails.toJson()
      );

      if(response.statusCode == 200){
        print("Logged in successfully: ${response}");
        return true;
      }

      return false;
    } on DioException catch (e){
      print("❌ An Error occurred while logging in: ${e.message}");
      return false;
    }
  }
}