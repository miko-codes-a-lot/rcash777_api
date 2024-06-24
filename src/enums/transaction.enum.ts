export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum TransactionTypeCategory {
  DEPOSIT = 'DEPOSIT',
  REBATE = 'REBATE',
  REFUND = 'REFUND',
  CASH_BACK = 'CASH_BACK', // discontinued but still here just in case
  BET_DEBIT = 'BET_DEBIT',
  WIN = 'WIN',
  PAYOUT = 'PAYOUT',
  BET_CREDIT = 'BET',
  TIP = 'TIP',
  PARTIAL_REFUND = 'PARTIAL_REFUND',
  BUY_IN = 'BUY_IN',
  CASH_OUT = 'CASH_OUT',
  FREEROUND_WIN = 'FREEROUND_WIN',
  TOURNAMENT_WIN = 'TOURNAMENT_WIN',
  CAMPAIGN_WIN = 'CAMPAIGN_WIN',
  FREEGAME_WIN = 'FREEGAME_WIN',
  CONFISCATE = 'CONFISCATE',
}
