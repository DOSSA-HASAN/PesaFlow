import 'package:dio/dio.dart';
import 'package:frontend/features/payment/b2BuyGoods/data/models/b2_buy_goods_request.dart';

class B2BuyGoodsRepository {
  final Dio _dio;

  B2BuyGoodsRepository(this._dio);

  Future<Response> b2BuyGoods(B2BuyGoodsRequest req) async {
    final response = await _dio.post("/mpesa/b2buygoods/initiate", data: req);
    return response;
  }
}
