export type StockMovementType =
    | 'stock_in'
    | 'stock_out'
    | 'sale'
    | 'sale_reversal'
    | 'adjustment'
    | 'return';

export enum StockMovementTypeEnum {
    STOCK_IN = 'stock_in',
    STOCK_OUT = 'stock_out',
    SALE = 'sale',
    SALE_REVERSAL = 'sale_reversal',
    ADJUSTMENT = 'adjustment',
    RETURN = 'return',
}
