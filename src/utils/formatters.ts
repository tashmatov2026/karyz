export function formatMoney(amount: number): string {
  if (isNaN(amount)) return '0 сом';
  const parts = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${parts} сом`;
}

export function formatNumber(num: number): string {
  if (isNaN(num)) return '0';
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // If it's already in DD.MM.YYYY format
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
      return dateString;
    }
    return dateString;
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function getCurrentDateFormatted(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}.${month}.${year}`;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPaymentTypeLabel(type: string): string {
  switch (type) {
    case 'salary_deduction':
      return 'Айлыктан кармалды';
    case 'cash':
      return 'Накталай';
    case 'card':
      return 'Банк картасы';
    case 'mbank':
      return 'MBank / Элкарт';
    case 'other':
      return 'Башка';
    default:
      return type || 'Накталай';
  }
}
