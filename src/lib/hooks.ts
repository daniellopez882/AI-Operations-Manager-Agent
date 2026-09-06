import { useEffect, useRef, useState } from 'react';
import type { DataSource, Finding, WorkflowEvent } from './data';

/** The newest `limit` events, newest first, live from the source. */
export function useEventFeed(source: DataSource, limit = 8): WorkflowEvent[] {
    const [events, setEvents] = useState<WorkflowEvent[]>(() => source.getInitialEvents());
    useEffect(() => {
        setEvents(source.getInitialEvents());
        return source.subscribeEvents((event) => {
            setEvents((prev) => [event, ...prev].slice(0, limit));
        });
    }, [source, limit]);
    return events;
}

/**
 * Findings shown as toasts, each dismissed after `ttlMs`. Pending dismissals
 * are cleared on unmount (the old code left timeouts running).
 */
export function useFindings(source: DataSource, ttlMs = 5000): Finding[] {
    const [findings, setFindings] = useState<Finding[]>([]);
    const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
    useEffect(() => {
        const pending = timers.current;
        const unsubscribe = source.subscribeFindings((finding) => {
            setFindings((prev) => [...prev, finding]);
            const handle = setTimeout(() => {
                pending.delete(handle);
                setFindings((prev) => prev.filter((f) => f.id !== finding.id));
            }, ttlMs);
            pending.add(handle);
        });
        return () => {
            unsubscribe();
            pending.forEach(clearTimeout);
            pending.clear();
        };
    }, [source, ttlMs]);
    return findings;
}

/** Case-insensitive substring match over the given fields. */
export function matches(query: string, ...fields: string[]): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return fields.some((f) => f.toLowerCase().includes(q));
}
