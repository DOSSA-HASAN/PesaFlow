import 'package:flutter_riverpod/legacy.dart';
import 'package:frontend/features/payment_accounts/data/models/payment_account_model.dart';

final selectedAccountProvider = StateProvider<PaymentAccountModel?>((ref){
  return null;
});