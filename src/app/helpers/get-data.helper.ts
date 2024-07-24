
const getRandomInvoiceNumber = () => {
  const prefix = 'INV';
  const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return prefix + number;
}

type PaymentStatus = 'Paid' | 'Pending' | 'Overdue' | 'Failed';

const getRandomPaymentStatus = (): PaymentStatus => {
  const statuses: PaymentStatus[] = ['Paid', 'Pending', 'Overdue', 'Failed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

const getRandomTotalAmount = (): number => Number((Math.random() * 1000).toFixed(2));


type PaymentMethod = 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Cash';

const getRandomPaymentMethod = (): PaymentMethod => {
  const methods: PaymentMethod[] = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'];
  return methods[Math.floor(Math.random() * methods.length)];
}

export interface Invoice extends Record<string, unknown> {
  invoice: string;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
}

export function generateRandomInvoices(num: number): Invoice[] {
  const invoices: Invoice[] = [];
  for (let i = 0; i < num; i++) {
      invoices.push({
          invoice: getRandomInvoiceNumber(),
          paymentStatus: getRandomPaymentStatus(),
          totalAmount: getRandomTotalAmount(),
          paymentMethod: getRandomPaymentMethod()
      });
  }
  return invoices;
}




