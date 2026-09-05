import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NOT_IMPLEMENTED } from '../App';
import { createHarness } from '../test/harness';
import SOPAnalysis, { AUDIT_MS } from './SOPAnalysis';
import Settings from './Settings';
import WorkflowMonitor from './WorkflowMonitor';

describe('SOPAnalysis', () => {
    it('selects a procedure and shows its simulated score', async () => {
        const user = userEvent.setup();
        createHarness().renderWithSource(<SOPAnalysis query="" />);
        expect(screen.getByText('Select a procedure')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /Monthly Financial Closing/ }));
        const detail = screen.getByTestId('sop-detail');
        expect(within(detail).getByText('42%')).toBeInTheDocument();
        expect(within(detail).getByText('Gap Detected')).toBeInTheDocument();
        expect(within(detail).getByText('5 Structural Bottlenecks')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Monthly Financial Closing/ })).toHaveAttribute('aria-pressed', 'true');
    });

    it('filters the repository by the query', () => {
        createHarness().renderWithSource(<SOPAnalysis query="release" />);
        expect(screen.getByText('Release Management Process')).toBeInTheDocument();
        expect(screen.queryByText('Monthly Financial Closing')).not.toBeInTheDocument();
        expect(screen.getByText('1 shown')).toBeInTheDocument();
    });

    describe('the simulated audit', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('is a delay that changes nothing, and is cancelled on unmount', () => {
            const clear = vi.spyOn(globalThis, 'clearTimeout');
            const { unmount } = createHarness().renderWithSource(<SOPAnalysis query="" />);
            const button = screen.getByRole('button', { name: /Simulate audit/ });

            act(() => button.click());
            expect(screen.getByRole('button', { name: /Simulating/ })).toBeDisabled();
            act(() => vi.advanceTimersByTime(AUDIT_MS));
            expect(screen.getByRole('button', { name: /Simulate audit/ })).toBeEnabled();

            act(() => screen.getByRole('button', { name: /Simulate audit/ }).click());
            const before = clear.mock.calls.length;
            unmount();
            expect(clear.mock.calls.length).toBeGreaterThan(before);
        });
    });

    it('marks the controls that do nothing', async () => {
        const user = userEvent.setup();
        createHarness().renderWithSource(<SOPAnalysis query="" />);
        expect(screen.getByRole('button', { name: /Import SOP/ })).toBeDisabled();
        await user.click(screen.getByRole('button', { name: /Customer Support/ }));
        const apply = screen.getByRole('button', { name: /Apply Fix Routine/ });
        expect(apply).toBeDisabled();
        expect(apply).toHaveAttribute('title', NOT_IMPLEMENTED);
    });
});

describe('WorkflowMonitor', () => {
    it('renders the initial events and prepends new ones from the feed', () => {
        const h = createHarness();
        h.renderWithSource(<WorkflowMonitor />);
        expect(screen.getByText('SIMULATED FEED')).toBeInTheDocument();
        expect(screen.queryByText(/LIVE TRAFFIC/)).not.toBeInTheDocument();

        const rowsBefore = screen.getAllByRole('row').slice(1); // skip the header
        expect(rowsBefore).toHaveLength(3);
        expect(rowsBefore[0]).toHaveTextContent('Invoice Processing');

        act(() =>
            h.emitEvent({ id: 99, time: '15:00:00', user: 'Emily W.', action: 'Brand New Thing', status: 'Warning', latency: '3m' }),
        );
        const rowsAfter = screen.getAllByRole('row').slice(1);
        expect(rowsAfter).toHaveLength(4);
        expect(rowsAfter[0]).toHaveTextContent('Brand New Thing');
        expect(rowsAfter[0]).toHaveTextContent('Warning');
    });

    it('does not pretend to execute anything', () => {
        createHarness().renderWithSource(<WorkflowMonitor />);
        const button = screen.getByRole('button', { name: /Execute Strategy/ });
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('title', NOT_IMPLEMENTED);
    });
});

describe('Settings', () => {
    it('describes what is not there instead of inventing it', () => {
        createHarness().renderWithSource(<Settings />);
        expect(screen.getByText(/None configured/)).toBeInTheDocument();
        expect(screen.getByText(/No authentication is implemented/)).toBeInTheDocument();
        expect(screen.queryByText(/Claude|GPT-4o|12 other connected/)).not.toBeInTheDocument();
        const reset = screen.getByRole('button', { name: /Reset Agent/ });
        expect(reset).toBeDisabled();
        expect(reset).toHaveAttribute('title', NOT_IMPLEMENTED);
    });
});
