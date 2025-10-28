import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TransactionType = 'income' | 'expense';

interface Transaction {
  type: TransactionType;
  amount: number;
  category: string;
  date: Date;
  memo: string;
}

interface PeriodOption {
  value: string;
  label: string;
  start?: Date;
  end?: Date;
}

interface ChartRow {
  key: string;
  category: string;
  type: TransactionType;
  amount: number;
  share: number;
}

interface ChartSummary {
  total: number;
  rows: ChartRow[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly typeLabels: Record<TransactionType, string> = {
    income: '収入',
    expense: '支出'
  };

  readonly periodOptions: PeriodOption[] = [
    { value: 'all', label: '全期間' },
    {
      value: '2024',
      label: '2024年',
      start: new Date(2024, 0, 1),
      end: new Date(2024, 11, 31, 23, 59, 59, 999)
    },
    {
      value: '2025',
      label: '2025年',
      start: new Date(2025, 0, 1),
      end: new Date(2025, 11, 31, 23, 59, 59, 999)
    },
    {
      value: '2025-10',
      label: '2025年10月',
      start: new Date(2025, 9, 1),
      end: new Date(2025, 9, 31, 23, 59, 59, 999)
    }
  ];

  readonly incomeCategories: string[] = ['給与', 'ボーナス', '副業', '投資収入'];
  readonly expenseCategories: string[] = ['食費', '住居', '交通', '光熱費', '娯楽', '教育'];

  showModal = false;
  activeTab: 'list' | 'chart' = 'list';
  selectedPeriod = 'all';
  errorMessage: string | null = null;

  transactions: Transaction[] = [];

  form: {
    type: TransactionType;
    amount: number;
    category: string;
    date: string;
    memo: string;
  } = {
    type: 'income',
    amount: 0,
    category: '',
    date: '',
    memo: ''
  };

  get filteredTransactions(): Transaction[] {
    const { start, end } = this.getSelectedPeriod();

    return this.transactions
      .filter((transaction) => {
        if ((start && transaction.date < start) || (end && transaction.date > end)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  get totalIncome(): number {
    return this.filteredTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  get totalExpense(): number {
    return this.filteredTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  get netAssets(): number {
    return this.totalIncome - this.totalExpense;
  }

  get chartSummary(): ChartSummary {
    const totals = new Map<string, ChartRow>();
    let overall = 0;

    for (const transaction of this.filteredTransactions) {
      const key = `${transaction.type}:${transaction.category}`;
      const existing = totals.get(key);

      overall += transaction.amount;

      if (existing) {
        existing.amount += transaction.amount;
        totals.set(key, existing);
      } else {
        totals.set(key, {
          key,
          category: transaction.category,
          type: transaction.type,
          amount: transaction.amount,
          share: 0
        });
      }
    }

    const rows = Array.from(totals.values())
      .map((row) => ({
        ...row,
        share: overall === 0 ? 0 : (row.amount / overall) * 100
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      total: overall,
      rows
    };
  }

  get categoryOptions(): string[] {
    return this.form.type === 'income' ? this.incomeCategories : this.expenseCategories;
  }

  openModal(): void {
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.errorMessage = null;
  }

  switchTab(tab: 'list' | 'chart'): void {
    this.activeTab = tab;
  }

  adjustAmount(delta: number): void {
    const currentValue = Number(this.form.amount) || 0;
    const nextValue = Math.max(0, currentValue + delta);
    this.form.amount = Math.round(nextValue);
  }

  submitTransaction(): void {
    const amount = Number(this.form.amount);

    if (!this.form.type || !this.form.category || !this.form.date || !Number.isFinite(amount) || amount <= 0) {
      this.errorMessage = '必須項目を入力してください。';
      return;
    }

    const newTransaction: Transaction = {
      type: this.form.type,
      amount,
      category: this.form.category,
      date: new Date(this.form.date),
      memo: this.form.memo.trim()
    };

    this.transactions = [...this.transactions, newTransaction];
    this.closeModal();
  }

  selectPeriod(value: string): void {
    this.selectedPeriod = value;
  }

  trackByTransaction(_index: number, transaction: Transaction): string {
    return `${transaction.type}-${transaction.category}-${transaction.date.toISOString()}-${transaction.amount}-${transaction.memo}`;
  }

  private getSelectedPeriod(): PeriodOption {
    return this.periodOptions.find((option) => option.value === this.selectedPeriod) ?? this.periodOptions[0];
  }

  private resetForm(): void {
    this.form = {
      type: 'income',
      amount: 0,
      category: '',
      date: '',
      memo: ''
    };
    this.errorMessage = null;
  }
}
