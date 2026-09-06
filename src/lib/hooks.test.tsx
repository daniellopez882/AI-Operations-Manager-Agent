import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DataSource, Finding, WorkflowEvent } from './data';
import { matches, useEventFeed, useFindings } from './hooks';
import { INITIAL_EVENTS, SIMULATION_STATUS } from './simulation';

/** A DataSource whose feeds are driven by hand. */
function stubSource() {
    const eventSubs: ((e: WorkflowEvent) => void)[] = [];
    const findingSubs: ((f: Finding) => void)[] = [];
    let unsubscribed = 0;
    const source: DataSource = {
        status: SIMULATION_STATUS,
        getStats: () => [],
        getBottlenecks: () => [],
        getSuggestions: () => [],
        getSops: () => [],
        getSettingsSections: () => [],
        getInitialEvents: () => INITIAL_EVENTS,
        subscribeEvents: (cb) => {
            eventSubs.push(cb);
            return () => {
                unsubscribed += 1;
            };
        },
        subscribeFindings: (cb) => {
            findingSubs.push(cb);
            return () => {
                unsubscribed += 1;
            };
        },
    };
    return {
        source,
        emitEvent: (e: WorkflowEvent) => eventSubs.forEach((cb) => cb(e)),
        emitFinding: (f: Finding) => findingSubs.forEach((cb) => cb(f)),
        unsubscribedCount: () => unsubscribed,
    };
}

const event = (id: number): WorkflowEvent => ({
    id,
    time: '00:00:00',
    user: 'u',
    action: 'a',
    status: 'Healthy',
    latency: '1m',
});

describe('useEventFeed', () => {
    it('starts with the initial events, prepends new ones, caps the list, unsubscribes', () => {
        const stub = stubSource();
        const { result, unmount } = renderHook(() => useEventFeed(stub.source, 5));
        expect(result.current).toEqual(INITIAL_EVENTS);

        act(() => {
            for (let i = 10; i < 20; i++) stub.emitEvent(event(i));
        });
        expect(result.current.map((e) => e.id)).toEqual([19, 18, 17, 16, 15]);

        unmount();
        expect(stub.unsubscribedCount()).toBe(1);
    });
});

describe('useFindings', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('shows a finding, dismisses it after the ttl, clears timers on unmount', () => {
        const stub = stubSource();
        const clear = vi.spyOn(globalThis, 'clearTimeout');
        const { result, unmount } = renderHook(() => useFindings(stub.source, 1000));

        act(() => stub.emitFinding({ id: 1, text: 'one', type: 'info' }));
        act(() => stub.emitFinding({ id: 2, text: 'two', type: 'alert' }));
        expect(result.current.map((f) => f.id)).toEqual([1, 2]);

        act(() => vi.advanceTimersByTime(1000));
        expect(result.current).toEqual([]);

        act(() => stub.emitFinding({ id: 3, text: 'three', type: 'info' }));
        const before = clear.mock.calls.length;
        unmount();
        expect(clear.mock.calls.length).toBeGreaterThan(before); // pending dismissal cancelled
        expect(stub.unsubscribedCount()).toBe(1);
    });
});

describe('matches', () => {
    it('is a case-insensitive substring match over any field; empty query matches all', () => {
        expect(matches('', 'anything')).toBe(true);
        expect(matches('  ', 'anything')).toBe(true);
        expect(matches('INVOICE', 'Invoice Approval Delay', 'Finance')).toBe(true);
        expect(matches('finance', 'Invoice Approval Delay', 'Finance')).toBe(true);
        expect(matches('zap', 'Invoice Approval Delay', 'Finance')).toBe(false);
    });
});
