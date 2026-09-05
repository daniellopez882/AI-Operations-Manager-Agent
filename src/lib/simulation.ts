/**
 * The in-process simulation: the only `DataSource` this repository has.
 *
 * It is what the old components did inline — fixed catalogues plus timers
 * drawing from `Math.random()` — pulled out so it can be tested and swapped.
 * Randomness and the clock are injectable; ids come from a counter, not
 * `Date.now()`, so two events in the same millisecond cannot share a React key.
 */

import type {
    Bottleneck,
    DataSource,
    EngineStatus,
    SettingsSection,
    Sop,
    Stat,
    Suggestion,
    WorkflowEvent,
} from './data';

export interface SimulationOptions {
    /** Uniform [0, 1) generator. Defaults to `Math.random`. */
    rng?: () => number;
    /** Clock. Defaults to `() => new Date()`. */
    now?: () => Date;
    eventIntervalMs?: number;
    findingIntervalMs?: number;
    /** Probability that a finding tick produces a finding. */
    findingProbability?: number;
    /** Probability that an event is a Warning. */
    warningProbability?: number;
}

/** Small deterministic PRNG (mulberry32) for tests and reproducible demos. */
export function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function formatClock(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export const STATS: Stat[] = [
    { label: 'Tasks Analyzed', value: '1,284', change: '+12%', type: 'positive' },
    { label: 'Total Bottlenecks', value: '12', change: '-4', type: 'negative' },
    { label: 'Active SOPs', value: '45', change: '+3', type: 'neutral' },
    { label: 'Efficiency Gain', value: '24%', change: '+5%', type: 'positive' },
];

export const BOTTLENECKS: Bottleneck[] = [
    { id: 1, title: 'Invoice Approval Delay', impact: 'High', department: 'Finance', status: 'Flagged' },
    { id: 2, title: 'Client Onboarding Sync', impact: 'Medium', department: 'Operations', status: 'Analyzing' },
    { id: 3, title: 'Code Review Latency', impact: 'Medium', department: 'Engineering', status: 'Flagged' },
];

export const SUGGESTIONS: Suggestion[] = [
    { id: 1, title: 'Automate Invoice Entry', tool: 'Zapier + OpenAI', saving: '15 hrs/week' },
    { id: 2, title: 'SOP Document Synthesizer', tool: 'Custom Script', saving: '8 hrs/week' },
    { id: 3, title: 'Slack Approval Workflow', tool: 'Slack Workflow Builder', saving: '10 hrs/week' },
];

export const SOPS: Sop[] = [
    { id: 1, title: 'Customer Support Onboarding', lastAnalyzed: '2 days ago', health: 'Good', inefficiencies: 2, score: 84 },
    { id: 2, title: 'Monthly Financial Closing', lastAnalyzed: '1 week ago', health: 'Critical', inefficiencies: 5, score: 42 },
    { id: 3, title: 'Release Management Process', lastAnalyzed: 'Today', health: 'Excellent', inefficiencies: 0, score: 98 },
];

/** Honest labels: this prototype has no model, no integrations and no accounts. */
export const SETTINGS_SECTIONS: SettingsSection[] = [
    {
        id: 'account',
        title: 'Account',
        items: [
            { label: 'Profile', desc: 'No accounts exist in this prototype; the header persona is a placeholder.' },
            { label: 'Security', desc: 'No authentication is implemented.' },
        ],
    },
    {
        id: 'ai',
        title: 'Analysis Engine',
        items: [
            { label: 'Model', desc: 'None configured — findings and scores are simulated in-process.' },
            { label: 'Sensitivity', desc: 'Would tune how aggressively a real engine flags inefficiencies.' },
            { label: 'Autonomy', desc: 'Would set thresholds for automated remediation. Nothing is automated here.' },
        ],
    },
    {
        id: 'system',
        title: 'Integrations',
        items: [
            { label: 'Connected tools', desc: 'None. Tool names in suggestions are illustrative.' },
            { label: 'Data sources', desc: 'The only source is the built-in simulation (see status in the sidebar).' },
        ],
    },
];

export const INITIAL_EVENTS: WorkflowEvent[] = [
    { id: 1, time: '14:20:05', user: 'Alex M.', action: 'Invoice Processing', status: 'Healthy', latency: '45m' },
    { id: 2, time: '14:18:12', user: 'Sarah K.', action: 'Client Briefing', status: 'Healthy', latency: '12m' },
    { id: 3, time: '14:15:30', user: 'System', action: 'Daily Backup', status: 'Warning', latency: '2h' },
];

export const USERS = ['Alex M.', 'Sarah K.', 'John D.', 'Emily W.', 'System'];
export const ACTIONS = ['Data Entry', 'Reviewing Pull Request', 'Meeting', 'Support Ticket', 'Email Sync'];
export const FINDINGS = [
    'Delay detected in the Customer Support cycle.',
    'New automation opportunity found in Finance.',
    'Workflow drift detected in Engineering.',
    "SOP 'Monthly Closing' is reaching critical inefficiency.",
];

export const SIMULATION_STATUS: EngineStatus = {
    mode: 'simulation',
    activeWorkflows: 4,
    description: 'All figures are generated in the browser. No data leaves this page.',
};

export function createSimulatedDataSource(options: SimulationOptions = {}): DataSource {
    const rng = options.rng ?? Math.random;
    const now = options.now ?? (() => new Date());
    const eventIntervalMs = options.eventIntervalMs ?? 4000;
    const findingIntervalMs = options.findingIntervalMs ?? 10000;
    const findingProbability = options.findingProbability ?? 0.3;
    const warningProbability = options.warningProbability ?? 0.15;

    let nextEventId = INITIAL_EVENTS.length + 1;
    let nextFindingId = 1;
    const pick = <T,>(items: T[]): T => items[Math.floor(rng() * items.length)];

    const nextEvent = (): WorkflowEvent => ({
        id: nextEventId++,
        time: formatClock(now()),
        user: pick(USERS),
        action: pick(ACTIONS),
        status: rng() < warningProbability ? 'Warning' : 'Healthy',
        latency: `${Math.floor(rng() * 60)}m`,
    });

    return {
        status: SIMULATION_STATUS,
        getStats: () => STATS,
        getBottlenecks: () => BOTTLENECKS,
        getSuggestions: () => SUGGESTIONS,
        getSops: () => SOPS,
        getSettingsSections: () => SETTINGS_SECTIONS,
        getInitialEvents: () => INITIAL_EVENTS,
        subscribeEvents(onEvent) {
            const handle = setInterval(() => onEvent(nextEvent()), eventIntervalMs);
            return () => clearInterval(handle);
        },
        subscribeFindings(onFinding) {
            const handle = setInterval(() => {
                if (rng() < findingProbability) {
                    onFinding({
                        id: nextFindingId++,
                        text: pick(FINDINGS),
                        type: rng() < 0.5 ? 'alert' : 'info',
                    });
                }
            }, findingIntervalMs);
            return () => clearInterval(handle);
        },
    };
}
