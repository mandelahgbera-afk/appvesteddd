import {
  updateTransaction,
  updateUser,
  updateTrader,
  updateCrypto,
  createActivityLog,
  createAuditLog,
  updateSetting,
  getUserById,
  getTraderById,
  getCryptoBySymbol,
} from '@/lib/supabase';
import type { Transaction, User, Trader, Crypto } from '@/types';

// ============================================
// ADMIN TRANSACTION OPERATIONS
// ============================================

/**
 * Approve a pending deposit transaction
 * Automatically updates user balance
 */
export async function approveDeposit(transactionId: string) {
  try {
    const { transaction, error } = await updateTransaction(transactionId, {
      status: 'approved',
    });

    if (error) throw error;

    // The balance will be updated automatically by the database trigger
    // But let's log this action
    if (transaction) {
      await createAuditLog({
        action: 'APPROVE_DEPOSIT',
        entity_type: 'transaction',
        entity_id: transactionId,
        new_values: { status: 'approved' },
      });

      // Create activity log for user
      const user = await getUserById(transaction.user_id);
      if (user && transaction.crypto_symbol) {
        await createActivityLog({
          user_id: transaction.user_id,
          type: 'receive',
          amount: transaction.amount,
          crypto_symbol: transaction.crypto_symbol,
          usd_value: transaction.amount * 0, // Would need real price
          description: `Deposit approved: ${transaction.amount} ${transaction.crypto_symbol}`,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return { transaction, error: null };
  } catch (error) {
    console.error('[Admin] Approve deposit error:', error);
    return { transaction: null, error };
  }
}

/**
 * Reject a pending deposit transaction
 */
export async function rejectDeposit(transactionId: string) {
  try {
    const { transaction, error } = await updateTransaction(transactionId, {
      status: 'rejected',
    });

    if (error) throw error;

    await createAuditLog({
      action: 'REJECT_DEPOSIT',
      entity_type: 'transaction',
      entity_id: transactionId,
      new_values: { status: 'rejected' },
    });

    return { transaction, error: null };
  } catch (error) {
    console.error('[Admin] Reject deposit error:', error);
    return { transaction: null, error };
  }
}

/**
 * Approve a pending withdrawal transaction
 */
export async function approveWithdrawal(transactionId: string) {
  try {
    const { transaction, error } = await updateTransaction(transactionId, {
      status: 'approved',
    });

    if (error) throw error;

    // The balance will be updated automatically by the database trigger
    if (transaction) {
      await createAuditLog({
        action: 'APPROVE_WITHDRAWAL',
        entity_type: 'transaction',
        entity_id: transactionId,
        new_values: { status: 'approved' },
      });

      // Create activity log for user
      if (transaction.crypto_symbol) {
        await createActivityLog({
          user_id: transaction.user_id,
          type: 'send',
          amount: transaction.amount,
          crypto_symbol: transaction.crypto_symbol,
          usd_value: transaction.amount * 0, // Would need real price
          description: `Withdrawal approved: ${transaction.amount} ${transaction.crypto_symbol} to ${transaction.address}`,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return { transaction, error: null };
  } catch (error) {
    console.error('[Admin] Approve withdrawal error:', error);
    return { transaction: null, error };
  }
}

/**
 * Reject a pending withdrawal transaction
 */
export async function rejectWithdrawal(transactionId: string) {
  try {
    const { transaction, error } = await updateTransaction(transactionId, {
      status: 'rejected',
    });

    if (error) throw error;

    await createAuditLog({
      action: 'REJECT_WITHDRAWAL',
      entity_type: 'transaction',
      entity_id: transactionId,
      new_values: { status: 'rejected' },
    });

    return { transaction, error: null };
  } catch (error) {
    console.error('[Admin] Reject withdrawal error:', error);
    return { transaction: null, error };
  }
}

// ============================================
// ADMIN USER OPERATIONS
// ============================================

/**
 * Manually update user balance (for admin simulation)
 */
export async function updateUserBalance(userId: string, newBalance: number) {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    const { user: updatedUser, error } = await updateUser(userId, {
      balance: newBalance,
    });

    if (error) throw error;

    await createAuditLog({
      action: 'UPDATE_USER_BALANCE',
      entity_type: 'user',
      entity_id: userId,
      old_values: { balance: user.balance },
      new_values: { balance: newBalance },
    });

    return { user: updatedUser, error: null };
  } catch (error) {
    console.error('[Admin] Update user balance error:', error);
    return { user: null, error };
  }
}

/**
 * Manually update user profit/loss (for admin simulation)
 */
export async function updateUserProfitLoss(userId: string, profitLoss: number) {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    const { user: updatedUser, error } = await updateUser(userId, {
      profit_loss: profitLoss,
    });

    if (error) throw error;

    await createAuditLog({
      action: 'UPDATE_USER_PROFIT_LOSS',
      entity_type: 'user',
      entity_id: userId,
      old_values: { profit_loss: user.profit_loss },
      new_values: { profit_loss: profitLoss },
    });

    return { user: updatedUser, error: null };
  } catch (error) {
    console.error('[Admin] Update user profit loss error:', error);
    return { user: null, error };
  }
}

/**
 * Suspend a user account
 */
export async function suspendUser(userId: string) {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    const { user: updatedUser, error } = await updateUser(userId, {
      status: 'suspended',
    });

    if (error) throw error;

    await createAuditLog({
      action: 'SUSPEND_USER',
      entity_type: 'user',
      entity_id: userId,
      old_values: { status: user.status },
      new_values: { status: 'suspended' },
    });

    return { user: updatedUser, error: null };
  } catch (error) {
    console.error('[Admin] Suspend user error:', error);
    return { user: null, error };
  }
}

/**
 * Reactivate a suspended user account
 */
export async function reactivateUser(userId: string) {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    const { user: updatedUser, error } = await updateUser(userId, {
      status: 'active',
    });

    if (error) throw error;

    await createAuditLog({
      action: 'REACTIVATE_USER',
      entity_type: 'user',
      entity_id: userId,
      old_values: { status: user.status },
      new_values: { status: 'active' },
    });

    return { user: updatedUser, error: null };
  } catch (error) {
    console.error('[Admin] Reactivate user error:', error);
    return { user: null, error };
  }
}

// ============================================
// ADMIN TRADER OPERATIONS (Simulation)
// ============================================

/**
 * Update trader performance data for simulation
 * Admin can manually create trading data for copy traders
 */
export async function updateTraderPerformance(
  traderId: string,
  profitLoss: number,
  profitLossPercentage: number,
  performanceData?: Array<{ date: string; value: number }>
) {
  try {
    const trader = await getTraderById(traderId);
    if (!trader) throw new Error('Trader not found');

    const updates: Partial<Trader> = {
      total_profit_loss: profitLoss,
      profit_loss_percentage: profitLossPercentage,
    };

    if (performanceData) {
      updates.performance_data = performanceData;
    }

    const { trader: updatedTrader, error } = await updateTrader(traderId, updates);

    if (error) throw error;

    await createAuditLog({
      action: 'UPDATE_TRADER_PERFORMANCE',
      entity_type: 'trader',
      entity_id: traderId,
      old_values: {
        total_profit_loss: trader.total_profit_loss,
        profit_loss_percentage: trader.profit_loss_percentage,
      },
      new_values: updates,
    });

    return { trader: updatedTrader, error: null };
  } catch (error) {
    console.error('[Admin] Update trader performance error:', error);
    return { trader: null, error };
  }
}

/**
 * Update trader followers count
 */
export async function updateTraderFollowers(traderId: string, followersCount: number) {
  try {
    const trader = await getTraderById(traderId);
    if (!trader) throw new Error('Trader not found');

    const { trader: updatedTrader, error } = await updateTrader(traderId, {
      followers_count: followersCount,
    });

    if (error) throw error;

    await createAuditLog({
      action: 'UPDATE_TRADER_FOLLOWERS',
      entity_type: 'trader',
      entity_id: traderId,
      old_values: { followers_count: trader.followers_count },
      new_values: { followers_count: followersCount },
    });

    return { trader: updatedTrader, error: null };
  } catch (error) {
    console.error('[Admin] Update trader followers error:', error);
    return { trader: null, error };
  }
}

// ============================================
// ADMIN CRYPTO OPERATIONS
// ============================================

/**
 * Update crypto price and related data (for simulation)
 */
export async function updateCryptoPrice(
  symbol: string,
  price: number,
  change24h?: number,
  marketCap?: number
) {
  try {
    const crypto = await getCryptoBySymbol(symbol);
    if (!crypto) throw new Error('Crypto not found');

    const updates: Partial<Crypto> = { price };

    if (change24h !== undefined) updates.change_24h = change24h;
    if (marketCap !== undefined) updates.market_cap = marketCap;

    const { crypto: updatedCrypto, error } = await updateCrypto(crypto.id, updates);

    if (error) throw error;

    await createAuditLog({
      action: 'UPDATE_CRYPTO_PRICE',
      entity_type: 'crypto',
      entity_id: crypto.id,
      old_values: {
        price: crypto.price,
        change_24h: crypto.change_24h,
      },
      new_values: updates,
    });

    return { crypto: updatedCrypto, error: null };
  } catch (error) {
    console.error('[Admin] Update crypto price error:', error);
    return { crypto: null, error };
  }
}

// ============================================
// ADMIN SETTINGS OPERATIONS
// ============================================

/**
 * Update platform settings
 */
export async function updatePlatformSetting(key: string, value: string) {
  try {
    const { setting, error } = await updateSetting(key, value);

    if (error) throw error;

    await createAuditLog({
      action: 'UPDATE_SETTING',
      entity_type: 'admin_settings',
      entity_id: key,
      new_values: { [key]: value },
    });

    return { setting, error: null };
  } catch (error) {
    console.error('[Admin] Update setting error:', error);
    return { setting: null, error };
  }
}

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Simulate trading activity for a user
 * Creates synthetic transaction and activity data
 */
export async function simulateUserTrade(
  userId: string,
  amount: number,
  symbol: string,
  type: 'buy' | 'sell'
) {
  try {
    // Create activity log
    await createActivityLog({
      user_id: userId,
      type: type === 'buy' ? 'send' : 'receive',
      amount,
      crypto_symbol: symbol,
      usd_value: amount * 0, // Would need real price
      description: `${type === 'buy' ? 'Buy' : 'Sell'} ${amount} ${symbol}`,
      timestamp: new Date().toISOString(),
    });

    await createAuditLog({
      action: 'SIMULATE_TRADE',
      entity_type: 'user',
      entity_id: userId,
      new_values: { amount, symbol, type },
    });

    return { error: null };
  } catch (error) {
    console.error('[Admin] Simulate trade error:', error);
    return { error };
  }
}

/**
 * Reset a user's balance and profit/loss to initial state
 */
export async function resetUserAccount(userId: string, initialBalance: number = 10000) {
  try {
    const { user, error } = await updateUser(userId, {
      balance: initialBalance,
      profit_loss: 0,
    });

    if (error) throw error;

    await createAuditLog({
      action: 'RESET_USER_ACCOUNT',
      entity_type: 'user',
      entity_id: userId,
      new_values: { balance: initialBalance, profit_loss: 0 },
    });

    return { user, error: null };
  } catch (error) {
    console.error('[Admin] Reset user account error:', error);
    return { user: null, error };
  }
}
