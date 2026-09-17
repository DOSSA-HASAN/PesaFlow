import 'package:dio/dio.dart';
import 'package:frontend/features/payment/b2C/data/models/b2c_request.dart';

class B2cRepository {
  final Dio _dio;

  B2cRepository(this._dio);

  Future<Response> b2c(B2cRequest request) async {
    final response = await _dio.post("/b2c/initiate", data: request);
    return response;
  }
}