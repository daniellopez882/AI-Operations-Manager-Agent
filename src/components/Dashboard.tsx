import { AlertCircle, CheckCircle2, ChevronRight, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { NOT_IMPLEMENTED } from '../App';
import { useDataSource } from '../lib/DataSourceContext';
import { matches } from '../lib/hooks';

export default function Dashboard({ query }: { query: string }) {
    const source = useDataSource();
    const stats = source.getStats();
    const bottlenecks = source.getBottlenecks().filter((b) => matches(query, b.title, b.department, b.impact));
    const suggestions = source.getSuggestions().filter((s) => matches(query, s.title, s.tool));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-10"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold text-white font-outfit tracking-tight">Executive Dashboard</h1>
                <p className="text-slate-400 font-medium">Simulated overview of operational health. Figures are illustrative.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="glass-card p-7 rounded-[2rem] relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/5 blur-3xl -mr-10 -mt-10 group-hover:bg-primary-600/10 transition-colors"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em]">{stat.label}</span>
                            <div
                                className={`flex items-center gap-1 font-bold text-[10px] px-2.5 py-1 rounded-full border ${
                                    stat.type === 'positive'
                                        ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                                        : stat.type === 'negative'
                                          ? 'bg-rose-500/5 text-rose-400 border-rose-500/20'
                                          : 'bg-slate-500/5 text-slate-400 border-slate-500/20'
                                }`}
                            >
                                {stat.type === 'positive' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-white font-outfit relative z-10 tabular-nums">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section
                    className="glass-panel p-10 rounded-[3rem] border border-white/[0.03] shadow-2xl relative overflow-hidden"
                    aria-labelledby="bottlenecks-heading"
                >
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-rose-600/5 blur-[80px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 ring-1 ring-rose-500/20">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 id="bottlenecks-heading" className="text-xl font-bold text-white font-outfit tracking-tight">
                                    System Bottlenecks
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    {bottlenecks.length} of {source.getBottlenecks().length} shown
                                </p>
                            </div>
                        </div>
                        <button
                            className="text-[10px] font-bold text-slate-600 bg-white/[0.03] px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest cursor-not-allowed"
                            disabled
                            title={NOT_IMPLEMENTED}
                        >
                            Global Scan
                        </button>
                    </div>

                    <ul className="space-y-5 relative z-10">
                        {bottlenecks.map((item) => (
                            <motion.li
                                key={item.id}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-6 bg-slate-900/30 rounded-[1.5rem] border border-white/[0.02] hover:border-white/10 hover:bg-slate-900/50 transition-all group shadow-lg"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-2 h-2 rounded-full ${item.impact === 'High' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                    <div>
                                        <div className="text-[15px] font-bold text-white group-hover:text-primary-400 transition-colors">{item.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.department}</span>
                                            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                            <span className="text-[10px] font-bold text-slate-400">Impact: {item.impact}</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                            </motion.li>
                        ))}
                        {bottlenecks.length === 0 && <li className="text-sm text-slate-500">No bottlenecks match “{query}”.</li>}
                    </ul>
                </section>

                <section
                    className="glass-panel p-10 rounded-[3rem] border border-white/[0.03] shadow-2xl relative overflow-hidden"
                    aria-labelledby="suggestions-heading"
                >
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-600/5 blur-[80px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-600/10 rounded-2xl text-primary-400 ring-1 ring-primary-500/20">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 id="suggestions-heading" className="text-xl font-bold text-white font-outfit tracking-tight">
                                    Automation Insights
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">Illustrative suggestions; tool names are examples</p>
                            </div>
                        </div>
                    </div>

                    <ul className="space-y-5 relative z-10">
                        {suggestions.map((item) => (
                            <motion.li
                                key={item.id}
                                whileHover={{ scale: 1.02 }}
                                className="group flex items-start gap-6 p-6 bg-gradient-to-r from-primary-600/[0.03] to-transparent hover:from-primary-600/[0.08] rounded-[1.5rem] border border-primary-500/5 hover:border-primary-500/20 transition-all relative overflow-hidden"
                            >
                                <div className="mt-1 p-3.5 bg-primary-600/10 rounded-xl text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-md">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div className="flex-1 relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[15px] font-bold text-white leading-none pt-1">{item.title}</div>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary-500 bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20">
                                            Example
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-500 mb-3 font-medium">
                                        Implementation: <span className="text-slate-300 font-bold">{item.tool}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                        <TrendingDown size={14} className="text-emerald-500" />
                                        <span className="text-[11px] font-bold text-emerald-400">Estimated: {item.saving}</span>
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                        {suggestions.length === 0 && <li className="text-sm text-slate-500">No suggestions match “{query}”.</li>}
                    </ul>
                </section>
            </div>
        </motion.div>
    );
}
