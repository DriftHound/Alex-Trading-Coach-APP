// ============================================================================
// API Request & Response Types
// ============================================================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    name: string;
    created_at: string;
}

// ============================================================================
// Workflow Step Types
// ============================================================================

export interface Step1MarketSessionData {
    pair: string;
    timestamp: string;
    is_alex_time: boolean;
}

export interface Step2TrendAnalysisData {
    pair: string;
    weekly_trend: 'up' | 'down' | 'messy';
    daily_trend: 'up' | 'down' | 'messy';
    four_hour_trend: 'up' | 'down' | 'messy';
}

export interface TrendValidationResponse {
    valid: boolean;
    confidence_score: number;
    warnings: string[];
}

export interface Step3AOIData {
    pair: string;
    aoi_type: 'rectangle' | 'horizontal_ray';
    aoi_coordinates: {
        top: number;
        bottom: number;
        left: number;
        right?: number;
    };
    description: string;
}

export interface AOIValidationResponse {
    valid: boolean;
    prior_respect: string;
    rr_potential: string;
}

export interface Step4PatternData {
    pair: string;
    pattern_type: 'head_and_shoulders' | 'engulfing' | 'other';
    pattern_details: Record<string, any>;
    screenshot_url?: string;
    confluence_factors: string[];
}

export interface PatternValidationResponse {
    valid: boolean;
    confluence_score: number;
    final_approval: boolean;
    warnings: string[];
}

export interface Step5RiskData {
    account_size: number;
    risk_percentage: number;
    stop_pips: number;
    target_pips: number;
    pair: string;
}

export interface RiskCalculationResponse {
    valid: boolean;
    rr_valid: boolean;
    rr_ratio: number;
    position_size: number;
    risk_amount: number;
    potential_profit: number;
}

export interface Step6JournalData {
    pair: string;
    entry: number;
    stop_loss: number;
    take_profit: number;
    position_size: number;
    confluence_score: number;
    direction: 'long' | 'short';
    session_data: Step1MarketSessionData;
    trend_data: Step2TrendAnalysisData;
    aoi_data: Step3AOIData;
    pattern_data: Step4PatternData;
    risk_data: Step5RiskData;
}

export interface JournalEntryResponse {
    success: boolean;
    trade_id: string;
    ai_thesis: string;
}

// ============================================================================
// Trade Journal Types
// ============================================================================

export interface Trade {
    id: string;
    user_id: string;
    pair: string;
    direction: 'long' | 'short';
    entry: number;
    stop_loss: number;
    take_profit: number;
    position_size: number;
    confluence_score: number;
    rr_ratio: number;
    status: 'open' | 'closed';
    outcome?: 'SL-hit' | 'TP-hit' | 'manual-close';
    actual_entry?: number;
    actual_exit?: number;
    pnl?: number;
    ai_thesis: string;
    created_at: string;
    closed_at?: string;
    session_data: Step1MarketSessionData;
    trend_data: Step2TrendAnalysisData;
    aoi_data: Step3AOIData;
    pattern_data: Step4PatternData;
    risk_data: Step5RiskData;
}

export interface LogOutcomeRequest {
    trade_id: string;
    actual_entry?: number;
    actual_exit: number;
    outcome: 'SL-hit' | 'TP-hit' | 'manual-close';
    notes?: string;
}

export interface LogOutcomeResponse {
    success: boolean;
    pnl: number;
    discipline_violation?: boolean;
    violation_message?: string;
}

export interface JournalAnalysisResponse {
    win_rate: number;
    avg_rr: number;
    total_trades: number;
    total_pnl: number;
    recommendations: string[];
    rr_achievement: {
        min_1_2: number; // Percentage achieving 1:2
        target_1_4: number; // Percentage achieving 1:4
    };
    pattern_efficacy: Array<{
        pattern: string;
        win_rate: number;
        avg_rr: number;
        count: number;
    }>;
    session_efficacy: Array<{
        session: string;
        win_rate: number;
        avg_rr: number;
        count: number;
    }>;
}

// ============================================================================
// Phase 2: File Upload & Monitoring Types
// ============================================================================

export interface FileUploadResponse {
    success: boolean;
    screenshot_url: string;
    file_id: string;
}

export interface AOIMonitoringConfig {
    enabled: boolean;
    user_id: string;
}

export interface AOIMonitoringStatus {
    active_aois: Array<{
        id: string;
        pair: string;
        aoi_type: string;
        description: string;
        created_at: string;
    }>;
    is_alex_time: boolean;
    monitoring_enabled: boolean;
}

export interface WeeklyReportConfig {
    enabled: boolean;
    user_id: string;
}

export interface WeeklyReportStatus {
    subscription_enabled: boolean;
    last_report_date?: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: 'aoi_approach' | 'discipline_violation' | 'weekly_report';
    title: string;
    message: string;
    data?: Record<string, any>;
    read: boolean;
    created_at: string;
}

export interface NotificationListResponse {
    notifications: Notification[];
    unread_count: number;
}

// ============================================================================
// Workflow State Types
// ============================================================================

export interface WorkflowState {
    currentStep: number;
    step1Data: Step1MarketSessionData | null;
    step2Data: Step2TrendAnalysisData | null;
    step2Validation: TrendValidationResponse | null;
    step3Data: Step3AOIData | null;
    step3Validation: AOIValidationResponse | null;
    step4Data: Step4PatternData | null;
    step4Validation: PatternValidationResponse | null;
    step5Data: Step5RiskData | null;
    step5Validation: RiskCalculationResponse | null;
    step6Data: Step6JournalData | null;
    step6Validation: JournalEntryResponse | null;
    draftId?: string;
}

// ============================================================================
// Chart Types
// ============================================================================

export interface ChartData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export type ChartType = 'candlestick' | 'line' | 'area';

export interface DrawingShape {
    id: string;
    type: 'rectangle' | 'horizontal_ray';
    coordinates: {
        top: number;
        bottom: number;
        left: number;
        right?: number;
    };
    color: string;
}
