import 'package:flutter/cupertino.dart';

class NavItem {
  final String title;
  final IconData icon;
  final String? requiredPermission;

  const NavItem({required this.title, required this.icon, this.requiredPermission});
}
