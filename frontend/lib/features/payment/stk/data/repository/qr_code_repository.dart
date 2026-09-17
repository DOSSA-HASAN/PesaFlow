import 'package:dio/dio.dart';
import 'package:frontend/features/payment/stk/data/models/qr_code_request.dart';

class QrCodeRepository {
  final Dio _dio;

  QrCodeRepository(this._dio);

  Future<Response> generateQrCode(QrCodeRequest req) async {
    final response = await _dio.post("/mpesa/qr/generate", data: req);

    return response;
  }
}
