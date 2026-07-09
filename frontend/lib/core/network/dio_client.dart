import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DioClient {
  final Dio _dio;
  final FlutterSecureStorage _secureStorage;

  // Singleton instance setup or standard constructor
  DioClient({FlutterSecureStorage? secureStorage})
      : _secureStorage = secureStorage ?? const FlutterSecureStorage(),
        _dio = Dio(
          BaseOptions(
            baseUrl: 'https://snipping-mangy-encircle.ngrok-free.dev/api', // Replace with your actual backend URL base
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 13),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          ),
        ) {
    // Inject our authorization workflow into the interceptor stack
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // 1. Fetch the latest secure token directly from disk storage hardware
          final String? accessToken = await _secureStorage.read(key: 'access_token');

          // 2. If the token exists, cleanly inject it into the Authorization header slot
          if (accessToken != null && accessToken.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $accessToken';
          }

          // 3. Let the request continue its journey out to the server
          return handler.next(options);
        },
        onError: (DioException e, handler) async {
          // Optional: If backend returns a 401 Unauthorized, you can catch it here
          // to trigger auto-logout or fire your refreshToken logic later!
          return handler.next(e);
        },
      ),
    );
  }

  // Getter to expose our preconfigured client to our Riverpod dioProvider
  Dio get instance => _dio;
}