import 'package:dio/dio.dart';
import 'package:frontend/features/payment/b2Pochi/data/models/b2_pochi_request.dart';

class B2PochiRepository {
  final Dio _dio;

  const B2PochiRepository(this._dio);

  Future<Response> b2PochiPayment(B2PochiRequest request) async {
    final response = await _dio.post("/mpesa/b2pochi/initiate", data: request);
    return response;
  }
}