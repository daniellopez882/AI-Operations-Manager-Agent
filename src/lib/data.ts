/**
 * The data the dashboard renders, and the seam it comes through.
 *
 * Every component reads from a `DataSource`. The only implementation in this
 * repository is the in-process simulation in `simulation.ts`; a real backend
 * would implement the same interface. Nothing in the UI knows which one it is
 * talking to, and `status.mode` says so on screen.
 */

export type Trend = 'positive' | 'negative' | 'neutral';

export interface Stat {
    label: string;
    value: string;
    change: string;
    type: Trend;
}

export type Impact = 'High' | 'Medium' | 'Low';
export type BottleneckStatus = 'Flagged' | 'Analyzing' | 'Resolved';

export interface Bottleneck {
    id: number;
    title: string;
    impact: Impact;
    department: string;
    status: BottleneckStatus;
}

export interface Suggestion {
    id: number;
    title: string;
    tool: string;
    saving: string;
}

export type SopHealth = 'Excellent' | 'Good' | 'Critical';

export interface Sop {
    id: number;
    title: string;
    lastAnalyzed: string;
    health: SopHealth;
    inefficiencies: number;
    score: number;
}

export type EventStatus = 'Healthy' | 'Warning';

export interface WorkflowEvent {
    id: number;
    time: string;
    user: string;
    action: string;
    status: EventStatus;
    latency: string;
}

export type FindingType = 'info' | 'alert';

export interface Finding {
    id: number;
    text: string;
    type: FindingType;
}

export interface SettingsItem {
    label: string;
    desc: string;
}

export interface SettingsSection {
    id: 'account' | 'ai' | 'system';
    title: string;
    items: SettingsItem[];
}

export interface EngineStatus {
    /** `simulation` is the only mode that exists today. */
    mode: 'simulation' | 'live';
    activeWorkflows: number;
    description: string;
}

export type Unsubscribe = () => void;

export interface DataSource {
    readonly status: EngineStatus;
    getStats(): Stat[];
    getBottlenecks(): Bottleneck[];
    getSuggestions(): Suggestion[];
    getSops(): Sop[];
    getSettingsSections(): SettingsSection[];
    getInitialEvents(): WorkflowEvent[];
    /** Called with each new event until unsubscribed. */
    subscribeEvents(onEvent: (event: WorkflowEvent) => void): Unsubscribe;
    /** Called with each new finding until unsubscribed. */
    subscribeFindings(onFinding: (finding: Finding) => void): Unsubscribe;
}
