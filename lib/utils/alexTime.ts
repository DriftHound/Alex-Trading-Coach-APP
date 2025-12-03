import { format, toZonedTime } from 'date-fns-tz';

// London session times in EST: 1:00 AM - 10:30 AM
const ALEX_TIME_START_HOUR = 1;
const ALEX_TIME_START_MINUTE = 0;
const ALEX_TIME_END_HOUR = 10;
const ALEX_TIME_END_MINUTE = 30;

const EST_TIMEZONE = 'America/New_York';

/**
 * Check if current time is within "Alex Time" (London session 1:00-10:30 EST)
 */
export function isAlexTime(date: Date = new Date()): boolean {
    const estDate = toZonedTime(date, EST_TIMEZONE);
    const hours = estDate.getHours();
    const minutes = estDate.getMinutes();

    const currentMinutes = hours * 60 + minutes;
    const startMinutes = ALEX_TIME_START_HOUR * 60 + ALEX_TIME_START_MINUTE;
    const endMinutes = ALEX_TIME_END_HOUR * 60 + ALEX_TIME_END_MINUTE;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Get detailed Alex Time status
 */
export interface AlexTimeStatus {
    isAlexTime: boolean;
    currentTime: string;
    currentTimeEST: string;
    sessionStart: string;
    sessionEnd: string;
    timeUntilStart?: string;
    timeUntilEnd?: string;
}

export function getAlexTimeStatus(date: Date = new Date()): AlexTimeStatus {
    const estDate = toZonedTime(date, EST_TIMEZONE);
    const isAlex = isAlexTime(date);

    const currentTime = format(date, 'HH:mm:ss');
    const currentTimeEST = format(estDate, 'HH:mm:ss zzz', { timeZone: EST_TIMEZONE });
    const sessionStart = `${String(ALEX_TIME_START_HOUR).padStart(2, '0')}:${String(ALEX_TIME_START_MINUTE).padStart(2, '0')} EST`;
    const sessionEnd = `${String(ALEX_TIME_END_HOUR).padStart(2, '0')}:${String(ALEX_TIME_END_MINUTE).padStart(2, '0')} EST`;

    const status: AlexTimeStatus = {
        isAlexTime: isAlex,
        currentTime,
        currentTimeEST,
        sessionStart,
        sessionEnd,
    };

    // Calculate time until start/end
    const hours = estDate.getHours();
    const minutes = estDate.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    const startMinutes = ALEX_TIME_START_HOUR * 60 + ALEX_TIME_START_MINUTE;
    const endMinutes = ALEX_TIME_END_HOUR * 60 + ALEX_TIME_END_MINUTE;

    if (!isAlex) {
        if (currentMinutes < startMinutes) {
            const diff = startMinutes - currentMinutes;
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            status.timeUntilStart = `${h}h ${m}m`;
        } else {
            // After session end, calculate time until next day's start
            const diff = (24 * 60 - currentMinutes) + startMinutes;
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            status.timeUntilStart = `${h}h ${m}m`;
        }
    } else {
        const diff = endMinutes - currentMinutes;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        status.timeUntilEnd = `${h}h ${m}m`;
    }

    return status;
}

/**
 * Format time display for Alex Time widget
 */
export function formatAlexTime(date: Date = new Date()): string {
    const estDate = toZonedTime(date, EST_TIMEZONE);
    return format(estDate, 'HH:mm:ss zzz', { timeZone: EST_TIMEZONE });
}

/**
 * Get session name based on time
 */
export function getSessionName(date: Date = new Date()): string {
    const estDate = toZonedTime(date, EST_TIMEZONE);
    const hours = estDate.getHours();

    if (hours >= 1 && hours < 10) {
        return 'London Session';
    } else if (hours >= 8 && hours < 12) {
        return 'London/NY Overlap';
    } else if (hours >= 8 && hours < 17) {
        return 'New York Session';
    } else if (hours >= 17 && hours < 20) {
        return 'Asian Session (Early)';
    } else {
        return 'Asian Session';
    }
}
