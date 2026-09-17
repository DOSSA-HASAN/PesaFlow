import 'package:dio/dio.dart';

class NetworkErrorUtil {
  static String getErrorMessage(Object error) {
    if (error is DioException) {
      if (error.response?.data != null &&
          error.response?.data is Map<String, dynamic>) {
        final responseData = error.response?.data as Map<String, dynamic>;

        return responseData["message"] ?? responseData["error"] ?? responseData["data"];
      }
    }
    return error.toString();
  }
}
