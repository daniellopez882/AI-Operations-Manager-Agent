import { useState } from 'react';
import {
    Activity,
    AlertCircle,
    Bell,
    FileText,
    LayoutDashboard,
    Search,
    Settings as SettingsIcon,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import SOPAnalysis from './components/SOPAnalysis';
import WorkflowMonitor from './components/WorkflowMonitor';
import Settings from './components/Settings';
import { useDataSource } from './lib/DataSourceContext';
import { useFindings } from './lib/hooks';

export type Tab = 'dashboard' | 'sops' | 'workflows' | 'settings';

const NAV: { id: Tab; icon: LucideIcon; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Executive Overview' },
    { id: 'sops', icon: FileText, label: 'SOP Intelligence' },
    { id: 'workflows', icon: Activity, label: 'Stream Monitor' },
    { id: 'settings', icon: SettingsIcon, label: 'System Config' },
];

export const NOT_IMPLEMENTED = 'Not available in this prototype';

function App() {
    const source = useDataSource();
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [query, setQuery] = useState('');
    const findings = useFindings(source);
    const { status } = source;

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
            {/* Sidebar. `w-68` is not a Tailwind width; the sidebar had no width at all. */}
            <aside className="w-72 glass-panel border-r border-slate-800/50 flex flex-col z-20 relative overflow-hidden">
                <div className="absolute -left-20 top-20 w-40 h-80 bg-primary-600/10 blur-[100px] pointer-events-none"></div>

                <div className="p-8">
                    <div className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center glow-primary transform group-hover:rotate-12 transition-transform duration-500">
                            <Zap className="text-white" size={26} fill="white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold font-outfit text-white tracking-tight leading-none">OpsManager</span>
                            <span className="text-[10px] font-bold text-primary-500 tracking-[0.2em] uppercase mt-1">UI prototype</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1.5" aria-label="Sections">
                    {NAV.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            aria-current={activeTab === item.id ? 'page' : undefined}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                                activeTab === item.id
                                    ? 'bg-primary-600/15 text-primary-400 border border-primary-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]'
                                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
                            }`}
                        >
                            <item.icon
                                size={20}
                                className={`transition-colors ${activeTab === item.id ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                            />
                            <span className="font-semibold text-sm">{item.label}</span>
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <div
                        className="p-5 bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-slate-800/50 rounded-[2rem] relative overflow-hidden"
                        data-testid="engine-status"
                    >
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                            {status.mode === 'simulation' ? 'Simulation' : 'Live'}
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            {status.activeWorkflows} simulated workflows. {status.description}
                        </p>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden bg-[#020617] relative">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/5 blur-[120px] pointer-events-none rounded-full"></div>
                <div className="absolute bottom-[-5%] left-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[100px] pointer-events-none rounded-full"></div>
                <div className="absolute inset-0 noise-overlay opacity-[0.02] pointer-events-none"></div>

                <header className="h-24 border-b border-white/[0.03] flex items-center justify-between px-10 bg-[#020617]/40 backdrop-blur-xl z-10">
                    <div className="relative w-[450px] group">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-all duration-300"
                            size={18}
                        />
                        <input
                            type="search"
                            aria-label="Filter bottlenecks, suggestions and SOPs"
                            placeholder="Filter bottlenecks, suggestions, SOPs..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-slate-900/40 border border-white/[0.05] rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary-500/30 focus:bg-slate-900/60 transition-all text-sm text-slate-200 placeholder:text-slate-600"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            className="p-2 text-slate-600 relative cursor-not-allowed"
                            disabled
                            title={NOT_IMPLEMENTED}
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-900/60 border border-slate-800">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-900/20">
                                <span className="text-xs font-bold text-white uppercase">?</span>
                            </div>
                            <span className="text-sm font-bold text-slate-300">No account</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10">
                    {/* One child at a time: that is what mode="wait" requires. */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && <Dashboard key="dashboard" query={query} />}
                        {activeTab === 'sops' && <SOPAnalysis key="sops" query={query} />}
                        {activeTab === 'workflows' && <WorkflowMonitor key="workflows" />}
                        {activeTab === 'settings' && <Settings key="settings" />}
                    </AnimatePresence>
                </div>
            </main>

            {/* Toasts live outside the tab presence; they used to be its second child. */}
            <div
                className="fixed bottom-10 right-10 z-50 flex flex-col gap-3 w-80 pointer-events-none"
                role="status"
                aria-live="polite"
            >
                <AnimatePresence>
                    {findings.map((note) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`pointer-events-auto p-4 rounded-[1.25rem] border shadow-2xl flex items-start gap-3 backdrop-blur-xl ${
                                note.type === 'alert'
                                    ? 'bg-rose-950/40 border-rose-500/30 text-rose-100'
                                    : 'bg-primary-950/40 border-primary-500/30 text-primary-100'
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${note.type === 'alert' ? 'bg-rose-500/20' : 'bg-primary-500/20'}`}>
                                {note.type === 'alert' ? <AlertCircle size={16} /> : <Zap size={16} />}
                            </div>
                            <div className="flex-1">
                                <div className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Simulated finding</div>
                                <div className="text-xs font-semibold leading-relaxed">{note.text}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default App;
