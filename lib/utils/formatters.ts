/**
 * Format currency values
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Format pip values
 */
export function formatPips(value: number): string {
    return `${value.toFixed(1)} pips`;
}

/**
 * Format R:R ratio
 */
export function formatRR(value: number): string {
    return `1:${value.toFixed(2)}`;
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Format price for FX pairs (4 or 2 decimal places depending on pair)
 */
export function formatPrice(value: number, pair: string): string {
    // JPY pairs use 2 decimal places, others use 4-5
    const isJPYPair = pair.includes('JPY');
    const decimals = isJPYPair ? 2 : 5;
    return value.toFixed(decimals);
}

/**
 * Format lot size
 */
export function formatLotSize(value: number): string {
    return value.toFixed(2);
}

/**
 * Format date/time
 */
export function formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
}

/**
 * Format date only
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(d);
}

/**
 * Format time only
 */
export function formatTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(d);
}

/**
 * Get color class for P&L
 */
export function getPnLColor(pnl: number): string {
    if (pnl > 0) return 'text-success';
    if (pnl < 0) return 'text-danger';
    return 'text-neutral';
}

/**
 * Get color class for confluence score
 */
export function getConfluenceColor(score: number): string {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
}

/**
 * Get color class for R:R ratio
 */
export function getRRColor(rr: number): string {
    if (rr >= 2) return 'text-success';
    if (rr >= 1.5) return 'text-warning';
    return 'text-danger';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Calculate position size based on risk parameters
 */
export function calculatePositionSize(
    accountSize: number,
    riskPercentage: number,
    stopPips: number,
    pair: string
): number {
    const riskAmount = accountSize * (riskPercentage / 100);

    // Pip value calculation (simplified - assumes standard lot)
    // For most pairs: 1 pip = $10 per standard lot
    // For JPY pairs: 1 pip = $9.09 per standard lot (approximately)
    const isJPYPair = pair.includes('JPY');
    const pipValue = isJPYPair ? 9.09 : 10;

    const positionSize = riskAmount / (stopPips * pipValue);
    return Math.round(positionSize * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate potential profit
 */
export function calculatePotentialProfit(
    positionSize: number,
    targetPips: number,
    pair: string
): number {
    const isJPYPair = pair.includes('JPY');
    const pipValue = isJPYPair ? 9.09 : 10;

    return positionSize * targetPips * pipValue;
}
