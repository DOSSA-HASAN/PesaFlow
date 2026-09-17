import "package:flutter/material.dart";

class ErrorService extends ChangeNotifier {
  String? _message;

  String? get message => _message;

  void ShowError(String message){
    _message = message;
    notifyListeners();
  }

  void clear(){
    _message = null;
    notifyListeners();
  }

}