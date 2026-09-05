import { AlertCircle, ArrowUpRight, Clock, Cpu, Terminal, TrendingUp, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { NOT_IMPLEMENTED } from '../App';
import { useDataSource } from '../lib/DataSourceContext';
import { useEventFeed } from '../lib/hooks';

const WorkflowMonitor = () => {
    const source = useDataSource();
    const events = useEventFeed(source, 8);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10 max-w-7xl mx-auto"
        >
            <div>
                <h2 className="text-4xl font-bold text-white font-outfit mb-3 tracking-tight">Stream Monitor</h2>
                <p className="text-slate-400 font-medium">A simulated event feed. Nothing here is observed from a real system.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-panel rounded-[2.5rem] border border-white/[0.03] overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary-600/20">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                className="w-1/3 h-full bg-primary-500 shadow-[0_0_10px_rgba(14,165,233,0.8)]"
                            />
                        </div>

                        <div className="p-8 border-b border-white/[0.03] bg-slate-900/20 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-600/10 rounded-xl text-primary-400">
                                    <Terminal size={20} />
                                </div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Operational Pulse</h3>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-amber-400 font-bold bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/10">
                                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                                SIMULATED FEED
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                                    <thead>
                                        <tr className="text-slate-500">
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Timestamp</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Entity</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Process</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Latency</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence initial={false}>
                                            {events.map((event) => (
                                                <motion.tr
                                                    key={event.id}
                                                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="group bg-slate-900/10 hover:bg-slate-900/40 border border-white/[0.02] transition-all cursor-default"
                                                >
                                                    <td className="px-6 py-5">
                                                        <span className="text-slate-500 font-mono text-[11px] bg-slate-800/50 px-2 py-1 rounded-md">{event.time}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                                {event.user.substring(0, 2)}
                                                            </div>
                                                            <span className="font-bold text-white group-hover:text-primary-400 transition-colors">{event.user}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-slate-300 font-medium">{event.action}</td>
                                                    <td className="px-6 py-5 text-slate-500 text-xs tabular-nums">{event.latency}</td>
                                                    <td className="px-6 py-5 text-right">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                                                event.status === 'Warning'
                                                                    ? 'bg-rose-500/5 text-rose-400 border-rose-500/20'
                                                                    : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                                                            }`}
                                                        >
                                                            <div className={`w-1 h-1 rounded-full ${event.status === 'Warning' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                                            {event.status}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/[0.03] bg-gradient-to-br from-primary-950/20 to-transparent shadow-xl">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">System Health (illustrative)</h3>

                        <div className="space-y-8">
                            <div className="flex justify-between items-center group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-800 rounded-2xl text-slate-400 group-hover:bg-primary-600/20 group-hover:text-primary-400 transition-all">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contributors</div>
                                        <div className="text-xl font-bold text-white font-outfit">24 Active</div>
                                    </div>
                                </div>
                                <div className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold bg-emerald-500/5 px-2 py-1 rounded-lg">
                                    <TrendingUp size={10} /> +2
                                </div>
                            </div>

                            <div className="flex justify-between items-center group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-800 rounded-2xl text-slate-400 group-hover:bg-rose-600/20 group-hover:text-rose-400 transition-all">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wait Time</div>
                                        <div className="text-xl font-bold text-white font-outfit">14.2m</div>
                                    </div>
                                </div>
                                <div className="text-rose-400 flex items-center gap-1 text-[10px] font-bold bg-rose-500/5 px-2 py-1 rounded-lg">
                                    <ArrowUpRight size={10} /> +15%
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/[0.03]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="text-primary-400" size={14} />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Alert threshold</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-primary-400">65%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '65%' }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/[0.03] bg-gradient-to-br from-slate-900/40 to-transparent shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="p-3 bg-primary-600/10 rounded-2xl text-primary-400">
                                <Cpu size={24} />
                            </div>
                            <h3 className="font-bold text-white tracking-tight">Auto-triage</h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed relative z-10">
                            A real engine would propose remediation here. This prototype does not execute anything.
                        </p>
                        <button
                            className="w-full py-4 bg-slate-800 text-slate-500 rounded-[1.25rem] text-[10px] font-bold uppercase tracking-[0.15em] cursor-not-allowed relative z-10"
                            disabled
                            title={NOT_IMPLEMENTED}
                        >
                            Execute Strategy
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WorkflowMonitor;
