import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle, Clock, FileSearch, MessageSquare, RefreshCw, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { NOT_IMPLEMENTED } from '../App';
import type { Sop } from '../lib/data';
import { useDataSource } from '../lib/DataSourceContext';
import { matches } from '../lib/hooks';

export const AUDIT_MS = 2000;

const SOPAnalysis = ({ query }: { query: string }) => {
    const source = useDataSource();
    const [auditing, setAuditing] = useState(false);
    const [selectedSOP, setSelectedSOP] = useState<Sop | null>(null);
    const auditTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sopList = source.getSops().filter((s) => matches(query, s.title, s.health));

    // The "audit" is a delay; it changes nothing. Cancelled on unmount.
    const runAudit = () => {
        setAuditing(true);
        auditTimer.current = setTimeout(() => setAuditing(false), AUDIT_MS);
    };
    useEffect(() => () => {
        if (auditTimer.current) clearTimeout(auditTimer.current);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10 max-w-7xl mx-auto"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold text-white font-outfit mb-3 tracking-tight">SOP Intelligence</h2>
                    <p className="text-slate-400 font-medium">Procedure scores and findings. Simulated: no document is analysed.</p>
                </div>
                <button
                    onClick={runAudit}
                    disabled={auditing}
                    className="px-8 py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-800 text-white rounded-[1.25rem] font-bold flex items-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 glow-primary shadow-xl shadow-primary-900/20"
                >
                    {auditing ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <RefreshCw size={20} />
                        </motion.div>
                    ) : (
                        <Zap size={20} fill="white" />
                    )}
                    <span className="tracking-wide uppercase text-xs">{auditing ? 'Simulating...' : 'Simulate audit'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Repository</h3>
                        <span className="text-[10px] font-bold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full">{sopList.length} shown</span>
                    </div>
                    <ul className="space-y-3" aria-label="Procedures">
                        {sopList.map((sop) => (
                            <li key={sop.id}>
                            <motion.button
                                onClick={() => setSelectedSOP(sop)}
                                aria-pressed={selectedSOP?.id === sop.id}
                                whileHover={{ x: 5 }}
                                className={`w-full text-left p-5 rounded-[2rem] border transition-all relative overflow-hidden group ${
                                    selectedSOP?.id === sop.id
                                        ? 'bg-primary-600/10 border-primary-500/40 shadow-xl shadow-primary-900/10'
                                        : 'bg-slate-900/30 border-white/[0.03] hover:border-white/10'
                                }`}
                            >
                                {selectedSOP?.id === sop.id && (
                                    <motion.div layoutId="sopGlow" className="absolute inset-0 bg-gradient-to-tr from-primary-600/10 to-transparent pointer-events-none" />
                                )}
                                <div className="font-bold text-white mb-2 leading-snug group-hover:text-primary-400 transition-colors">{sop.title}</div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                        <Clock size={12} className="text-slate-600" /> {sop.lastAnalyzed}
                                    </div>
                                    <div
                                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${
                                            sop.health === 'Critical' ? 'text-rose-400' : sop.health === 'Excellent' ? 'text-emerald-400' : 'text-primary-400'
                                        }`}
                                    >
                                        <div
                                            className={`w-1 h-1 rounded-full ${
                                                sop.health === 'Critical' ? 'bg-rose-500' : sop.health === 'Excellent' ? 'bg-emerald-500' : 'bg-primary-500'
                                            }`}
                                        />
                                        {sop.health} Health
                                    </div>
                                </div>
                            </motion.button>
                            </li>
                        ))}
                        {sopList.length === 0 && <li className="text-sm text-slate-500 px-2">No procedures match “{query}”.</li>}
                    </ul>
                    <button
                        className="w-full py-4 border-2 border-dashed border-slate-800/50 rounded-[2rem] text-slate-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-slate-900/10 cursor-not-allowed"
                        disabled
                        title={NOT_IMPLEMENTED}
                    >
                        <span className="text-lg">+</span> Import SOP
                    </button>
                </div>

                <div className="lg:col-span-3">
                    {selectedSOP ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel rounded-[3rem] border border-white/[0.03] overflow-hidden shadow-2xl relative"
                            data-testid="sop-detail"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-[100px] pointer-events-none"></div>

                            <div className="p-10 border-b border-white/[0.03] bg-gradient-to-b from-white/[0.01] to-transparent">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 rounded-full border border-primary-500/20 mb-3">
                                            <Zap size={10} className="text-primary-400" fill="currentColor" />
                                            <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Simulated inspection</span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white font-outfit tracking-tight">{selectedSOP.title}</h3>
                                    </div>
                                    <div className="p-4 bg-slate-900/80 rounded-[1.5rem] border border-white/5 backdrop-blur-md">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Efficiency Index</span>
                                        <div className="flex items-end gap-1">
                                            <span className="text-2xl font-bold text-white font-outfit leading-none">{selectedSOP.score}%</span>
                                            <div className={`text-[10px] font-bold ${selectedSOP.score > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {selectedSOP.score > 80 ? 'Optimal' : 'Gap Detected'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="px-5 py-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                                        <div className="p-1 bg-emerald-500/10 rounded-md">
                                            <CheckCircle className="text-emerald-400" size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-300">Illustrative findings</span>
                                    </div>
                                    <div
                                        className={`px-5 py-2.5 rounded-2xl flex items-center gap-3 border transition-colors ${
                                            selectedSOP.inefficiencies > 0 ? 'bg-rose-500/5 border-rose-500/10' : 'bg-slate-800/5 border-slate-800/50 opacity-50'
                                        }`}
                                    >
                                        <div className={`p-1 rounded-md ${selectedSOP.inefficiencies > 0 ? 'bg-rose-500/10' : 'bg-slate-800'}`}>
                                            <AlertTriangle className={selectedSOP.inefficiencies > 0 ? 'text-rose-400' : 'text-slate-600'} size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-300">{selectedSOP.inefficiencies} Structural Bottlenecks</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Example observations</h4>
                                        <div className="space-y-4">
                                            <div className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/[0.02] flex gap-5 group hover:border-primary-500/20 transition-all">
                                                <div className="p-3 bg-primary-600/10 rounded-2xl text-primary-400 h-fit">
                                                    <MessageSquare size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[15px] font-bold text-white mb-1.5">Fragmented comms loop</div>
                                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                        Steps 4–7 involve manual handoffs. A real engine would propose an integration here.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/[0.02] flex gap-5 group hover:border-amber-500/20 transition-all">
                                                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 h-fit">
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[15px] font-bold text-white mb-1.5">Static access logic</div>
                                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                                        Credential verification is static; the recommendation would be a dynamic OAuth2 flow.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">ROI projection (illustrative)</h4>
                                        <div className="p-8 bg-gradient-to-br from-primary-600/[0.08] to-transparent border border-primary-500/20 rounded-[2.5rem] relative group">
                                            <div className="absolute top-4 right-4 text-primary-500 opacity-20 group-hover:opacity-100 transition-opacity">
                                                <Zap size={32} />
                                            </div>
                                            <div className="text-3xl font-bold text-white font-outfit mb-2">4.2 Hrs</div>
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                                                Example weekly time saved. Not computed from anything.
                                            </p>
                                            <button
                                                className="w-full py-4 bg-slate-800 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed"
                                                disabled
                                                title={NOT_IMPLEMENTED}
                                            >
                                                Apply Fix Routine <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-20 glass-panel rounded-[3rem] border border-dashed border-white/5 text-center group">
                            <div className="w-24 h-24 bg-slate-900/50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/[0.03] group-hover:scale-110 transition-transform duration-500">
                                <FileSearch size={40} className="text-slate-700 opacity-40" />
                            </div>
                            <p className="text-2xl font-bold text-white font-outfit mb-3">Select a procedure</p>
                            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">Pick one from the list to see its simulated score and example findings.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SOPAnalysis;
