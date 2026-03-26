# Vested - Quick Reference Card

## Setup (Copy-Paste)

```bash
# 1. Install
pnpm install

# 2. Add .env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# 3. Fix RLS (one time, in Supabase SQL Editor)
# Copy scripts/01-fix-rls-policies.sql → paste → run

# 4. Run
pnpm dev
```

---

## Import Patterns

### Authentication
```typescript
import { useAuth } from '@/contexts/AuthContext';
const { user, login, signup, logout } = useAuth();
```

### Data Fetching
```typescript
import { useTransactions, usePortfolio } from '@/hooks/useUserData';
const { transactions, isLoading, refetch } = useTransactions();
const { holdings, chartData, totalValue } = usePortfolio();
```

### Direct Supabase
```typescript
import { getCryptos, getTraders, createTransaction } from '@/lib/supabase';
const cryptos = await getCryptos();
```

### Admin Operations
```typescript
import { updateUserBalance, approveDeposit } from '@/lib/admin-operations';
await updateUserBalance('user-id', 10000);
await approveDeposit('transaction-id');
```

### Empty States
```typescript
import { EmptyState } from '@/components/EmptyState';
<EmptyState 
  icon={Inbox}
  title="No Transactions"
  description="Make your first deposit"
  action={{ label: "Deposit", onClick: () => {} }}
/>
```

---

## Common Tasks

### Sign User Up
```typescript
const { signup } = useAuth();
const success = await signup('user@example.com', 'pass123', 'John');
```

### Sign User In
```typescript
const { login } = useAuth();
const success = await login('user@example.com', 'pass123');
```

### Get User's Transactions
```typescript
import { useTransactions } from '@/hooks/useUserData';
const { transactions, isLoading } = useTransactions();
```

### Get User's Portfolio
```typescript
import { usePortfolio } from '@/hooks/useUserData';
const { holdings, chartData, totalValue } = usePortfolio();
```

### Create a Deposit
```typescript
import { createTransaction } from '@/lib/supabase';
await createTransaction({
  user_id: userId,
  type: 'deposit',
  amount: 1000,
  crypto_symbol: 'BTC',
  status: 'pending'
});
```

### Approve Deposit (Admin)
```typescript
import { approveDeposit } from '@/lib/admin-operations';
await approveDeposit(transactionId);
```

### Give User Balance (Admin)
```typescript
import { updateUserBalance } from '@/lib/admin-operations';
await updateUserBalance(userId, 50000);
```

### Follow a Trader
```typescript
import { followTrader } from '@/lib/supabase';
await followTrader(userId, traderId);
```

### Get Active Cryptos
```typescript
import { getCryptos } from '@/lib/supabase';
const cryptos = await getCryptos();
```

### Get All Traders
```typescript
import { getTraders } from '@/lib/supabase';
const traders = await getTraders();
```

---

## File Locations

| What | Where |
|------|-------|
| Supabase Functions | `src/lib/supabase.ts` |
| Admin Tools | `src/lib/admin-operations.ts` |
| Data Hooks | `src/hooks/useUserData.ts` |
| Empty State UI | `src/components/EmptyState.tsx` |
| Auth Logic | `src/contexts/AuthContext.tsx` |
| User Dashboard | `src/sections/user/UserDashboard.tsx` |
| Types | `src/types/index.ts` |
| Database Schema | `schema.sql` |
| RLS Fix | `scripts/01-fix-rls-policies.sql` |

---

## Key Functions (40+)

### Auth (src/lib/supabase.ts)
- `signUp(email, password, fullName)`
- `signIn(email, password)`
- `signOut()`
- `getCurrentUser()`

### Users
- `getUserById(userId)`
- `getUserByEmail(email)`
- `updateUser(userId, updates)`
- `getAllUsers()`

### Transactions
- `getTransactionsByUserId(userId)`
- `getAllTransactions()`
- `createTransaction(data)`
- `updateTransaction(id, updates)`

### Cryptos
- `getCryptos()`
- `getCryptoBySymbol(symbol)`
- `updateCrypto(cryptoId, updates)`

### Traders
- `getTraders()`
- `getTraderById(traderId)`
- `updateTrader(traderId, updates)`
- `followTrader(userId, traderId)`
- `unfollowTrader(userId, traderId)`
- `getUserFollowedTraders(userId)`

### Portfolio
- `getUserHoldings(userId)`
- `updateUserHolding(holdingId, updates)`
- `createUserHolding(userId, cryptoId)`
- `getUserChartData(userId)`
- `addChartData(userId, date, value)`

### Activity
- `getActivityLogs(userId)`
- `createActivityLog(data)`

### Settings
- `getSetting(key)`
- `getSettings()`
- `updateSetting(key, value)`

### Email
- `getEmailTemplate(name)`
- `logEmail(data)`

### Audit
- `createAuditLog(data)`
- `getAuditLogs(limit)`

---

## Admin Functions (src/lib/admin-operations.ts)

```typescript
// Approve/Reject
approveDeposit(transactionId)
rejectDeposit(transactionId)
approveWithdrawal(transactionId)
rejectWithdrawal(transactionId)

// Users
updateUserBalance(userId, amount)
updateUserProfitLoss(userId, amount)
suspendUser(userId)
reactivateUser(userId)
resetUserAccount(userId, initialBalance)

// Traders
updateTraderPerformance(traderId, profitLoss, percentage, data)
updateTraderFollowers(traderId, count)

// Cryptos
updateCryptoPrice(symbol, price, change24h, marketCap)

// Settings
updatePlatformSetting(key, value)

// Simulation
simulateUserTrade(userId, amount, symbol, type)
resetUserAccount(userId, initialBalance)
```

---

## Hooks (src/hooks/useUserData.ts)

```typescript
// Transactions
const { transactions, isLoading, error, refetch } = useTransactions();

// Portfolio
const { holdings, chartData, totalValue, isLoading, error, refetch } = usePortfolio();

// Activity
const { activities, isLoading, error, refetch } = useActivity();

// Traders
const { traders, isLoading, error, refetch } = useFollowedTraders();

// Profile
const { profile, isLoading, error, refetch } = useUserProfile();
```

---

## Common Patterns

### Show Data with Loading State
```typescript
const { data, isLoading, error } = useTransactions();

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (data.length === 0) return <EmptyState ... />;
return <DataList data={data} />;
```

### Show Empty State
```typescript
if (transactions.length === 0) {
  return (
    <EmptyState
      icon={Inbox}
      title="No Transactions"
      description="Make your first deposit to start"
      action={{ 
        label: "Make a Deposit",
        onClick: () => onNavigate('deposit')
      }}
    />
  );
}
```

### Refresh Data
```typescript
const { data, refetch } = useTransactions();

const handleCreate = async (item) => {
  await createTransaction(item);
  await refetch(); // Refresh list
};
```

### Handle Errors
```typescript
try {
  await approveDeposit(transactionId);
  showToast('Approved!', 'success');
  await refetch();
} catch (error) {
  console.error('Error:', error);
  showToast('Failed to approve', 'error');
}
```

---

## Database Tables

All with Full RLS Security:

| Table | Purpose |
|-------|---------|
| users | User profiles |
| transactions | Deposits & withdrawals |
| cryptos | Available cryptocurrencies |
| traders | Copy traders |
| user_traders | Follow relationships |
| user_cryptos | Portfolio holdings |
| user_chart_data | Portfolio history |
| activity_logs | User activity |
| super_admin | Admin accounts |
| admin_settings | Platform config |
| email_templates | Email templates |
| email_logs | Email history |
| audit_logs | Admin audit trail |

---

## Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://YOUR.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_KEY

# Find in Supabase → Settings → API
```

---

## Deployment

```bash
# Build
pnpm build

# Deploy to Vercel
vercel --prod

# Or: Connect GitHub repo to Vercel dashboard
```

---

## Debugging Tips

```javascript
// In browser console:

// Check auth
import { getCurrentUser } from '@/lib/supabase';
const user = await getCurrentUser();
console.log(user);

// Check data
import { getTransactionsByUserId } from '@/lib/supabase';
const txs = await getTransactionsByUserId('USER_ID');
console.log(txs);

// Test admin operation
import { updateUserBalance } from '@/lib/admin-operations';
await updateUserBalance('USER_ID', 10000);
```

---

## RLS Policy Quick Check

User can only see:
- Their own transactions ✓
- Their own holdings ✓
- Their own activity ✓
- Public cryptos & traders ✓

Admin can see:
- All users data ✓
- All transactions ✓
- All holdings ✓
- Settings & audit logs ✓

---

## Performance Tips

1. Use hooks instead of direct calls
2. Call `refetch()` only when needed
3. Use loading states for UX
4. Cache data with SWR (future)
5. Paginate large datasets
6. Index frequently filtered columns

---

## Resources

- Docs: QUICKSTART.md, IMPLEMENTATION.md, DEPLOYMENT.md
- Code: src/lib/supabase.ts (primary API)
- Admin: src/lib/admin-operations.ts
- Components: src/components/EmptyState.tsx
- Hooks: src/hooks/useUserData.ts

---

## Quick Deploy Checklist

- [ ] .env variables set
- [ ] RLS migration run in Supabase
- [ ] Local testing complete
- [ ] Sign up/login works
- [ ] Empty states display
- [ ] Admin operations work
- [ ] Ready to ship!

---

**Keep this card handy during development! 🚀**
