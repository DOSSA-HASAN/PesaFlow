import 'package:dio/dio.dart';
import 'package:frontend/features/payment/stk/data/models/stk_request.dart';

class StkRepository {
  final Dio _dio;

  StkRepository(this._dio);

  Future<Response> stkPrompt(StkRequest req) async {
    final response = await _dio.post("/mpesa/stk/initiate", data: req);

    return response;
  }
}
