import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    ACTIONS,
    FINDINGS,
    INITIAL_EVENTS,
    USERS,
    createSimulatedDataSource,
    formatClock,
    mulberry32,
} from './simulation';

describe('mulberry32', () => {
    it('is deterministic and stays in [0, 1)', () => {
        const a = mulberry32(42);
        const b = mulberry32(42);
        const xs = Array.from({ length: 100 }, () => a());
        const ys = Array.from({ length: 100 }, () => b());
        expect(xs).toEqual(ys);
        expect(xs.every((x) => x >= 0 && x < 1)).toBe(true);
        expect(new Set(xs).size).toBeGreaterThan(90);
    });
});

describe('formatClock', () => {
    it('renders 24h HH:MM:SS with padding, independent of locale', () => {
        expect(formatClock(new Date(2025, 0, 1, 14, 20, 5))).toBe('14:20:05');
        expect(formatClock(new Date(2025, 0, 1, 9, 5, 7))).toBe('09:05:07');
    });
});

describe('createSimulatedDataSource', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    const fixedNow = () => new Date(2025, 0, 1, 14, 20, 5);

    it('says what it is', () => {
        const src = createSimulatedDataSource();
        expect(src.status.mode).toBe('simulation');
        expect(src.status.description).toMatch(/generated in the browser/i);
    });

    it('serves the catalogues', () => {
        const src = createSimulatedDataSource();
        expect(src.getStats()).toHaveLength(4);
        expect(src.getBottlenecks()).toHaveLength(3);
        expect(src.getSuggestions()).toHaveLength(3);
        expect(src.getSops()).toHaveLength(3);
        expect(src.getSettingsSections().map((s) => s.id)).toEqual(['account', 'ai', 'system']);
        expect(src.getInitialEvents()).toEqual(INITIAL_EVENTS);
    });

    it('emits one event per interval with monotonic ids and the injected clock', () => {
        const src = createSimulatedDataSource({ rng: mulberry32(1), now: fixedNow, eventIntervalMs: 1000 });
        const seen: { id: number; time: string; user: string; action: string; latency: string }[] = [];
        const unsubscribe = src.subscribeEvents((e) => seen.push(e));

        vi.advanceTimersByTime(3000);
        expect(seen.map((e) => e.id)).toEqual([4, 5, 6]); // continues after the 3 initial events
        expect(seen.every((e) => e.time === '14:20:05')).toBe(true);
        expect(seen.every((e) => USERS.includes(e.user) && ACTIONS.includes(e.action))).toBe(true);
        expect(seen.every((e) => /^\d+m$/.test(e.latency))).toBe(true);

        unsubscribe();
        vi.advanceTimersByTime(5000);
        expect(seen).toHaveLength(3);
    });

    it('warning probability drives the event status', () => {
        const allWarn = createSimulatedDataSource({ rng: () => 0, eventIntervalMs: 10 });
        const allOk = createSimulatedDataSource({ rng: () => 0.999, eventIntervalMs: 10 });
        const a: string[] = [];
        const b: string[] = [];
        allWarn.subscribeEvents((e) => a.push(e.status));
        allOk.subscribeEvents((e) => b.push(e.status));
        vi.advanceTimersByTime(50);
        expect(a).toEqual(['Warning', 'Warning', 'Warning', 'Warning', 'Warning']);
        expect(b).toEqual(['Healthy', 'Healthy', 'Healthy', 'Healthy', 'Healthy']);
    });

    it('findings follow the probability and get monotonic ids', () => {
        const always = createSimulatedDataSource({ rng: () => 0, findingIntervalMs: 10 });
        const never = createSimulatedDataSource({ rng: () => 0.999, findingIntervalMs: 10 });
        const got: { id: number; text: string; type: string }[] = [];
        const none: unknown[] = [];
        const stop = always.subscribeFindings((f) => got.push(f));
        never.subscribeFindings((f) => none.push(f));
        vi.advanceTimersByTime(30);
        expect(got.map((f) => f.id)).toEqual([1, 2, 3]);
        expect(got.every((f) => f.type === 'alert' && FINDINGS.includes(f.text))).toBe(true);
        expect(none).toHaveLength(0);
        stop();
        vi.advanceTimersByTime(30);
        expect(got).toHaveLength(3);
    });
});
