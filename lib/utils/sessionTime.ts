import { format, toZonedTime } from 'date-fns-tz';

// London session times in EST: 1:00 AM - 10:30 AM
const SESSION_START_HOUR = 1;
const SESSION_START_MINUTE = 0;
const SESSION_END_HOUR = 10;
const SESSION_END_MINUTE = 30;

const EST_TIMEZONE = 'America/New_York';

/**
 * Check if current time is within "optimal trading session" (London session 1:00-10:30 EST)
 */
export function isOptimalSession(date: Date = new Date()): boolean {
    const estDate = toZonedTime(date, EST_TIMEZONE);
    const hours = estDate.getHours();
    const minutes = estDate.getMinutes();

    const currentMinutes = hours * 60 + minutes;
    const startMinutes = SESSION_START_HOUR * 60 + SESSION_START_MINUTE;
    const endMinutes = SESSION_END_HOUR * 60 + SESSION_END_MINUTE;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Get detailed optimal trading session status
 */
export interface OptimalSessionStatus {
    isOptimalSession: boolean;
    currentTime: string;
    currentTimeEST: string;
    sessionStart: string;
    sessionEnd: string;
    timeUntilStart?: string;
    timeUntilEnd?: string;
}

export function getOptimalSessionStatus(date: Date = new Date()): OptimalSessionStatus {
    const estDate = toZonedTime(date, EST_TIMEZONE);
    const isOptimal = isOptimalSession(date);

    const currentTime = format(date, 'HH:mm:ss');
    const currentTimeEST = format(estDate, 'HH:mm:ss zzz', { timeZone: EST_TIMEZONE });
    const sessionStart = `${String(SESSION_START_HOUR).padStart(2, '0')}:${String(SESSION_START_MINUTE).padStart(2, '0')} EST`;
    const sessionEnd = `${String(SESSION_END_HOUR).padStart(2, '0')}:${String(SESSION_END_MINUTE).padStart(2, '0')} EST`;

    const status: OptimalSessionStatus = {
        isOptimalSession: isOptimal,
        currentTime,
        currentTimeEST,
        sessionStart,
        sessionEnd,
    };

    // Calculate time until start/end
    const hours = estDate.getHours();
    const minutes = estDate.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    const startMinutes = SESSION_START_HOUR * 60 + SESSION_START_MINUTE;
    const endMinutes = SESSION_END_HOUR * 60 + SESSION_END_MINUTE;

    if (!isOptimal) {
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
 * Format time display for optimal trading session widget
 */
export function formatOptimalSession(date: Date = new Date()): string {
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
