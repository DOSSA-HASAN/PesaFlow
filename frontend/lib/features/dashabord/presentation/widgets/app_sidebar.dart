import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/features/dashabord/models/nav_item.dart';
import 'package:frontend/features/dashabord/providers/navigation_provider.dart';
import 'package:frontend/features/login/provider/user_provider.dart';

class AppSidebar extends ConsumerWidget {
  const AppSidebar({super.key});

  static const List<NavItem> _allNavItems = [
    NavItem(title: "STK Prompt", icon: Icons.mobile_friendly_rounded),
    NavItem(title: "Buy Goods", icon: Icons.security_update_good_sharp),
    NavItem(title: "Paybill", icon: Icons.payments_rounded),
    NavItem(title: "Pochi", icon: Icons.payments_rounded),
    NavItem(title: "B2C", icon: Icons.payments_rounded),
    NavItem(title: "User Management", icon: Icons.people_alt),
    NavItem(title: "Add User", icon: Icons.person_add_rounded),
    NavItem(title: "Role Management", icon: Icons.shield_rounded),
  ];

  // TODO: filter nav items based on permissions
  final allowedItems = _allNavItems;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final currentIndex = ref.watch(currentNavIndex);
    final user = ref.watch(userProvider);
    final safeIndex = allowedItems.isEmpty
        ? 0
        : currentIndex.clamp(0, allowedItems.length - 1);
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border(right: BorderSide(color: theme.colorScheme.onSecondary.withOpacity(0.1))),
        color: theme.colorScheme.onPrimaryContainer,
      ),
      child:
        ListView.builder(
          itemCount: allowedItems.length,
          itemBuilder: (context, index) {
            final item = allowedItems[index];
            return InkWell(
              onTap: () {
                ref.read(currentNavIndex.notifier).state = index;
              },
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: currentIndex == index
                      ? theme.colorScheme.onSecondaryContainer.withOpacity(0.07)
                      : Colors.transparent,
                  borderRadius: currentIndex == index
                      ? BorderRadius.circular(4)
                      : BorderRadius.zero,
                  border: currentIndex == index
                      ? Border(
                          left: BorderSide(
                            color: theme.colorScheme.primary,
                            width: 3,
                          ),
                        )
                      : Border(),
                ),
                child: Row(
                  children: [
                    Icon(
                      item.icon,
                      color: currentIndex == index
                          ? theme.colorScheme.onSecondary.withOpacity(0.8)
                          : theme.colorScheme.onSecondary.withOpacity(0.4),
                      size: 20,
                    ),
                    const SizedBox(width: 20),
                    Text(
                      item.title,
                      style: TextStyle(
                        color: currentIndex == index
                            ? theme.colorScheme.onSecondary.withOpacity(0.8)
                            : theme.colorScheme.onSecondary.withOpacity(0.4),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
    );
  }
}
