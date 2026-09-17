import 'package:dio/dio.dart';
import 'package:frontend/features/payment/b2Paybill/data/models/b2_paybill_request.dart';

class B2PaybillRepository {
  final Dio _dio;

  B2PaybillRepository(this._dio);

  Future<Response> b2paybill (B2PaybillRequest data) async{
    final response = await _dio.post("/mpesa/b2paybill/initiate", data: data);
    return response;
  }
}