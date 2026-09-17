// import 'package:dio/dio.dart';
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:flutter_riverpod/legacy.dart';
// import 'package:frontend/core/network/dio_client.dart';
// import 'package:frontend/features/payment/stk/data/models/qr_code_request.dart';
// import 'package:frontend/features/payment/stk/data/repository/qr_code_repository.dart';
// import 'package:frontend/providers/error_provider.dart';
//
// final dioProvider = Provider<Dio>((ref) {
//   return DioClient().instance;
// });
//
// final qrCodeRepository = Provider<QrCodeRepository>((ref) {
//   final dio = ref.watch(dioProvider);
//   return QrCodeRepository(dio);
// });
//
// final qrCodeProvider =
//     StateNotifierProvider<QrCodeNotifier, AsyncValue<String?>>((ref) {
//       final repository = ref.watch(qrCodeRepository);
//       return QrCodeNotifier(repository, ref);
//     });
//
// class QrCodeNotifier extends StateNotifier<AsyncValue<bool>> {
//   final QrCodeRepository _repository;
//   final Ref _ref;
//
//   QrCodeNotifier(this._repository, this._ref) : super(const AsyncData(false));
//
//   Future<String?> submitQrCodeGeneration(
//     String shortCode,
//     String refNo,
//     String amount,
//   ) async {
//     state = AsyncLoading();
//
//     try {
//       final request = QrCodeRequest(
//         shortCode: shortCode,
//         refNo: refNo,
//         amount: amount,
//       );
//       final response = await _repository.generateQrCode(request);
//
//       final qrCode = response.data["data"];
//
//       if (response.statusCode == 200) {
//         state = AsyncData(true);
//       } else {
//         throw Exception("Failed to generate payment QR code");
//       }
//     } catch (e, stackTrace) {
//       state = AsyncError(e, stackTrace);
//       _ref.read(errorProvider.notifier).showError(e.toString());
//     }
//   }
// }
