import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService {
  final FlutterSecureStorage _secureStorage;

  const StorageService(this._secureStorage);

  Future<void> saveTokens({
    required String access,
    required String refresh,
  }) async {
    await _secureStorage.write(key: 'access_token', value: access);
    await _secureStorage.write(key: 'refresh_token', value: refresh);
  }

  Future<String?> getAccessToken() async =>
      await _secureStorage.read(key: 'access_token');

  Future<String?> getRefreshToken() async =>
      await _secureStorage.read(key: 'refresh_token');

  void clearAuthSession() async {
    // Deleting both access & refresh token
    await _secureStorage.deleteAll();
  }
}

final storageProvider = Provider<StorageService>((ref) {
  return const StorageService(FlutterSecureStorage());
});
