import 'package:dio/dio.dart';

class DioClient {
  final Dio _dio;

  DioClient() : _dio = Dio() {
    _dio.options = BaseOptions(
      baseUrl: "http://localhost:5123", // Changmuse to ngrok url also
      connectTimeout: const Duration(seconds: 60),
      receiveTimeout: const Duration(seconds: 60),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    );

    // TODO: add dio interceptors if needed
  }

  Dio get instance => _dio;
}
