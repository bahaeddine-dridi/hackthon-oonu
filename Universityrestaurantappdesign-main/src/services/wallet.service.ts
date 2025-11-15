import { apiService } from './api.service';
import { API_ENDPOINTS } from '../config/api';

export interface WalletTransaction {
  id: number;
  student_id: number;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export interface WalletData {
  balance: number;
  transactions: WalletTransaction[];
}

export interface RechargeData {
  amount: number;
  payment_reference?: string;
}

class WalletService {
  /**
   * Get wallet data
   */
  async getWallet(page: number = 1): Promise<{ data: WalletData; meta: any }> {
    const response = await apiService.get<WalletData>(
      API_ENDPOINTS.WALLET,
      { page }
    );
    return {
      data: response.data!,
      meta: response.meta,
    };
  }

  /**
   * Recharge wallet
   */
  async rechargeWallet(data: RechargeData): Promise<{ new_balance: number; transaction: WalletTransaction }> {
    const response = await apiService.post<{ new_balance: number; transaction: WalletTransaction }>(
      API_ENDPOINTS.WALLET_RECHARGE,
      data
    );
    return response.data!;
  }
}

export const walletService = new WalletService();
