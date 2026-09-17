import 'package:dio/dio.dart';

class PaymentAccountRepository {
  final Dio _dio;
  
  PaymentAccountRepository(this._dio);
  
  Future<Response> getPaymentAccounts() async {
    final response = await _dio.get("/payment_account");
    return response;
  }
}