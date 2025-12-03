import { apiClient } from './client';
import type {
    Step1MarketSessionData,
    Step2TrendAnalysisData,
    TrendValidationResponse,
    Step3AOIData,
    AOIValidationResponse,
    Step4PatternData,
    PatternValidationResponse,
    Step5RiskData,
    RiskCalculationResponse,
    Step6JournalData,
    JournalEntryResponse,
    LogOutcomeRequest,
    LogOutcomeResponse,
    JournalAnalysisResponse,
    Trade,
    FileUploadResponse,
    AOIMonitoringConfig,
    AOIMonitoringStatus,
    WeeklyReportConfig,
    WeeklyReportStatus,
    NotificationListResponse,
} from '@/types/api';

// ============================================================================
// Workflow API Methods
// ============================================================================

export const workflowAPI = {
    // Step 1: Log market session
    logMarketSession: async (data: Step1MarketSessionData) => {
        return apiClient.post<{ success: boolean; session_id: string }>(
            '/agents/log_session',
            data
        );
    },

    // Step 2: Validate trend analysis
    validateTrend: async (data: Step2TrendAnalysisData) => {
        return apiClient.post<TrendValidationResponse>(
            '/agents/validate_trend',
            data
        );
    },

    // Step 3: Validate AOI
    validateAOI: async (data: Step3AOIData) => {
        return apiClient.post<AOIValidationResponse>(
            '/agents/validate_aoi',
            data
        );
    },

    // Step 4: Validate pattern
    validatePattern: async (data: Step4PatternData) => {
        return apiClient.post<PatternValidationResponse>(
            '/agents/validate_pattern',
            data
        );
    },

    // Step 5: Calculate risk
    calculateRisk: async (data: Step5RiskData) => {
        return apiClient.post<RiskCalculationResponse>(
            '/agents/calculate_risk',
            data
        );
    },

    // Step 6: Create journal entry
    createJournalEntry: async (data: Step6JournalData) => {
        return apiClient.post<JournalEntryResponse>(
            '/agents/journal_entry',
            data
        );
    },
};

// ============================================================================
// Trade Journal API Methods
// ============================================================================

export const journalAPI = {
    // Get all trades for current user
    getTrades: async () => {
        return apiClient.get<{ trades: Trade[] }>('/agents/trades');
    },

    // Get single trade by ID
    getTrade: async (tradeId: string) => {
        return apiClient.get<{ trade: Trade }>(`/agents/trades/${tradeId}`);
    },

    // Log trade outcome
    logOutcome: async (data: LogOutcomeRequest) => {
        return apiClient.post<LogOutcomeResponse>(
            '/agents/log_outcome',
            data
        );
    },

    // Get journal analysis
    getAnalysis: async () => {
        return apiClient.get<JournalAnalysisResponse>('/agents/journal_analysis');
    },
};

// ============================================================================
// Phase 2: File Upload API Methods
// ============================================================================

export const fileAPI = {
    // Upload screenshot for pattern validation
    uploadScreenshot: async (file: File, pair: string) => {
        return apiClient.uploadFile<FileUploadResponse>(
            '/agents/upload_screenshot',
            file,
            { pair }
        );
    },
};

// ============================================================================
// Phase 2: Monitoring & Notifications API Methods
// ============================================================================

export const monitoringAPI = {
    // Get AOI monitoring status
    getAOIMonitoringStatus: async () => {
        return apiClient.get<AOIMonitoringStatus>('/agents/monitoring/aoi/status');
    },

    // Update AOI monitoring configuration
    updateAOIMonitoring: async (config: AOIMonitoringConfig) => {
        return apiClient.post<{ success: boolean }>(
            '/agents/monitoring/aoi/config',
            config
        );
    },

    // Get weekly report status
    getWeeklyReportStatus: async () => {
        return apiClient.get<WeeklyReportStatus>('/agents/monitoring/report/status');
    },

    // Update weekly report subscription
    updateWeeklyReport: async (config: WeeklyReportConfig) => {
        return apiClient.post<{ success: boolean }>(
            '/agents/monitoring/report/config',
            config
        );
    },

    // Get notifications
    getNotifications: async (limit: number = 20) => {
        return apiClient.get<NotificationListResponse>('/agents/notifications', { limit });
    },

    // Mark notification as read
    markNotificationRead: async (notificationId: string) => {
        return apiClient.patch<{ success: boolean }>(
            `/agents/notifications/${notificationId}/read`,
            {}
        );
    },

    // Mark all notifications as read
    markAllNotificationsRead: async () => {
        return apiClient.post<{ success: boolean }>(
            '/agents/notifications/read_all',
            {}
        );
    },
};

// ============================================================================
// Chart Data API Methods
// ============================================================================

export const chartAPI = {
    // Get price data for a pair
    getPriceData: async (pair: string, timeframe: string = '1H', limit: number = 500) => {
        return apiClient.get<{ data: any[] }>('/agents/chart_data', {
            pair,
            timeframe,
            limit,
        });
    },
};
