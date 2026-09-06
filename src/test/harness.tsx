import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { DataSource, Finding, WorkflowEvent } from '../lib/data';
import { DataSourceProvider } from '../lib/DataSourceContext';
import {
    BOTTLENECKS,
    INITIAL_EVENTS,
    SETTINGS_SECTIONS,
    SIMULATION_STATUS,
    SOPS,
    STATS,
    SUGGESTIONS,
} from '../lib/simulation';

/** The simulation's catalogues with hand-driven feeds. */
export function createHarness() {
    const eventSubs: ((e: WorkflowEvent) => void)[] = [];
    const findingSubs: ((f: Finding) => void)[] = [];
    const source: DataSource = {
        status: SIMULATION_STATUS,
        getStats: () => STATS,
        getBottlenecks: () => BOTTLENECKS,
        getSuggestions: () => SUGGESTIONS,
        getSops: () => SOPS,
        getSettingsSections: () => SETTINGS_SECTIONS,
        getInitialEvents: () => INITIAL_EVENTS,
        subscribeEvents: (cb) => {
            eventSubs.push(cb);
            return () => eventSubs.splice(eventSubs.indexOf(cb), 1);
        },
        subscribeFindings: (cb) => {
            findingSubs.push(cb);
            return () => findingSubs.splice(findingSubs.indexOf(cb), 1);
        },
    };
    return {
        source,
        emitEvent: (e: WorkflowEvent) => eventSubs.forEach((cb) => cb(e)),
        emitFinding: (f: Finding) => findingSubs.forEach((cb) => cb(f)),
        renderWithSource: (ui: ReactElement) => render(<DataSourceProvider source={source}>{ui}</DataSourceProvider>),
    };
}
