import 'package:flutter_riverpod/legacy.dart';

// Keep track of the currently selected nav bar
final currentNavIndex = StateProvider<int>((ref) => 0);
