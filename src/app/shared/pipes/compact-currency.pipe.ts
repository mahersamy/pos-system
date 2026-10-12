import { Pipe, PipeTransform } from '@angular/core';

type CurrencyInput = number | string | null | undefined;

const COMPACT_UNITS = [
    { threshold: 1_000_000_000, suffix: 'B' },
    { threshold: 1_000_000, suffix: 'M' },
    { threshold: 1_000, suffix: 'K' },
] as const;

function parseNumber(value: CurrencyInput): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return Number.isNaN(num) ? null : num;
}

function formatNumber(num: number, maxDecimals: number): string {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDecimals,
    }).format(num);
}

export function formatCompactCurrency(
    value: CurrencyInput,
    currencySymbol = '$',
    maxDecimals = 2
): string {
    const num = parseNumber(value);
    if (num === null) {
        return `${currencySymbol}0`;
    }

    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num);

    const unit = COMPACT_UNITS.find(({ threshold }) => abs >= threshold);
    const scaled = unit ? abs / unit.threshold : abs;

    return `${sign}${currencySymbol}${formatNumber(scaled, maxDecimals)}${unit?.suffix ?? ''}`;
}

@Pipe({
    name: 'compactCurrency',
    standalone: true,
})
export class CompactCurrencyPipe implements PipeTransform {
    transform(value: CurrencyInput, currencySymbol = '$', maxDecimals = 2): string {
        return formatCompactCurrency(value, currencySymbol, maxDecimals);
    }
}