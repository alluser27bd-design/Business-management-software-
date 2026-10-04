import {
  Receipt,
  Truck,
  Users,
  Package,
  ShoppingCart,
  Building2,
  ArrowLeftRight,
  DollarSign,
  Boxes,
  FileBarChart,
  Scale,
  UserCheck,
  AlertCircle,
  Wallet,
  TrendingUp,
  ShoppingBag,
  ArrowDownLeft,
  Clock,
  Landmark,
  Smartphone,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Receipt':
      return Receipt;
    case 'Truck':
      return Truck;
    case 'Users':
      return Users;
    case 'Package':
      return Package;
    case 'ShoppingCart':
      return ShoppingCart;
    case 'Building2':
      return Building2;
    case 'ArrowLeftRight':
      return ArrowLeftRight;
    case 'DollarSign':
      return DollarSign;
    case 'Boxes':
      return Boxes;
    case 'FileBarChart':
      return FileBarChart;
    case 'Scale':
      return Scale;
    case 'UserCheck':
      return UserCheck;
    case 'AlertCircle':
      return AlertCircle;
    case 'Wallet':
      return Wallet;
    case 'TrendingUp':
      return TrendingUp;
    case 'ShoppingBag':
      return ShoppingBag;
    case 'ArrowDownLeft':
      return ArrowDownLeft;
    case 'Clock':
      return Clock;
    case 'Landmark':
      return Landmark;
    case 'Smartphone':
      return Smartphone;
    case 'ArrowUpRight':
      return ArrowUpRight;
    default:
      return Sparkles;
  }
};
