import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App, { NOT_IMPLEMENTED } from './App';
import { createHarness } from './test/harness';

afterEach(() => vi.restoreAllMocks());

describe('App', () => {
    it('renders without console warnings or errors', () => {
        // The original had two children under <AnimatePresence mode="wait">; framer-motion warned.
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        createHarness().renderWithSource(<App />);
        expect(warn).not.toHaveBeenCalled();
        expect(error).not.toHaveBeenCalled();
    });

    it('says the data is simulated', () => {
        createHarness().renderWithSource(<App />);
        const status = screen.getByTestId('engine-status');
        expect(status).toHaveTextContent('Simulation');
        expect(status).toHaveTextContent('4 simulated workflows');
        expect(screen.getByText('UI prototype')).toBeInTheDocument();
        expect(screen.queryByText(/live engine/i)).not.toBeInTheDocument();
    });

    it('switches sections from the sidebar', async () => {
        const user = userEvent.setup();
        createHarness().renderWithSource(<App />);
        expect(screen.getByRole('heading', { name: 'Executive Dashboard' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'SOP Intelligence' }));
        expect(await screen.findByRole('heading', { name: 'SOP Intelligence' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'SOP Intelligence' })).toHaveAttribute('aria-current', 'page');

        await user.click(screen.getByRole('button', { name: 'Stream Monitor' }));
        expect(await screen.findByRole('heading', { name: 'Stream Monitor' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'System Config' }));
        expect(await screen.findByRole('heading', { name: 'System Config' })).toBeInTheDocument();
    });

    it('filters bottlenecks and suggestions from the search box', async () => {
        const user = userEvent.setup();
        createHarness().renderWithSource(<App />);
        const box = screen.getByRole('searchbox');

        await user.type(box, 'invoice');
        expect(screen.getByText('Invoice Approval Delay')).toBeInTheDocument();
        expect(screen.queryByText('Client Onboarding Sync')).not.toBeInTheDocument();
        expect(screen.getByText('Automate Invoice Entry')).toBeInTheDocument();
        expect(screen.queryByText('Slack Approval Workflow')).not.toBeInTheDocument();
        expect(screen.getByText('1 of 3 shown')).toBeInTheDocument();

        await user.clear(box);
        await user.type(box, 'zzz');
        expect(screen.getByText(/No bottlenecks match/)).toBeInTheDocument();
        expect(screen.getByText(/No suggestions match/)).toBeInTheDocument();
    });

    it('shows a finding as a toast', () => {
        const h = createHarness();
        h.renderWithSource(<App />);
        act(() => h.emitFinding({ id: 1, text: 'Workflow drift detected in Engineering.', type: 'alert' }));
        const toasts = screen.getByRole('status');
        expect(within(toasts).getByText('Workflow drift detected in Engineering.')).toBeInTheDocument();
        expect(within(toasts).getByText('Simulated finding')).toBeInTheDocument();
    });

    it('controls that do nothing are disabled and say so', () => {
        createHarness().renderWithSource(<App />);
        for (const name of ['Notifications', 'Global Scan']) {
            const button = screen.getByRole('button', { name });
            expect(button).toBeDisabled();
            expect(button).toHaveAttribute('title', NOT_IMPLEMENTED);
        }
    });
});
