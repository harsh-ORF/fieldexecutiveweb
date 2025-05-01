import { cn } from '@/lib/utils';

type OrderStatus = 
  | 'pending'
  | 'approved'
  | 'in_progress'
  | 'loading'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | string;

type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled'
  | string;

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment';
  className?: string;
}

export function StatusBadge({ status, type = 'order', className }: StatusBadgeProps) {
  const getOrderStatusStyles = (status: OrderStatus) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case 'loading':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPaymentStatusStyles = (status: PaymentStatus) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'partially_paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const statusStyles = type === 'order' 
    ? getOrderStatusStyles(status as OrderStatus) 
    : getPaymentStatusStyles(status as PaymentStatus);

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles,
        className
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
}