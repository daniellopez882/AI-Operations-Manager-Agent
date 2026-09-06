import { ChevronRight, Cpu, Database, Shield, User, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { NOT_IMPLEMENTED } from '../App';
import type { SettingsSection } from '../lib/data';
import { useDataSource } from '../lib/DataSourceContext';

const ICONS: Record<SettingsSection['id'], LucideIcon> = { account: User, ai: Cpu, system: Database };

const Settings = () => {
    const sections = useDataSource().getSettingsSections();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10 max-w-5xl mx-auto"
        >
            <div>
                <h2 className="text-4xl font-bold text-white font-outfit mb-3 tracking-tight">System Config</h2>
                <p className="text-slate-400 font-medium">What a configuration screen would hold. None of it is wired to anything.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {sections.map((section, idx) => {
                    const Icon = ICONS[section.id];
                    return (
                        <motion.section
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-8 rounded-[2.5rem] border border-white/[0.03] shadow-xl relative overflow-hidden"
                            aria-label={section.title}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-slate-800/50 rounded-2xl text-primary-400 border border-white/5">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white font-outfit tracking-tight">{section.title}</h3>
                            </div>

                            <div className="space-y-3">
                                {section.items.map((item) => (
                                    <div
                                        key={item.label}
                                        className="group flex items-center justify-between p-5 bg-slate-900/20 rounded-2xl border border-white/[0.02]"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-[15px] font-bold text-slate-200">{item.label}</span>
                                            <span className="text-xs text-slate-500 mt-1">{item.desc}</span>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-800" />
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    );
                })}

                <div className="flex gap-4 pt-10 border-t border-white/[0.03]">
                    <div className="flex-1 p-6 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Shield size={14} /> Danger Zone
                        </h4>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-500">There is no stored state to reset in this prototype.</p>
                            <button
                                className="px-5 py-2.5 bg-rose-600/10 text-rose-400/50 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-not-allowed"
                                disabled
                                title={NOT_IMPLEMENTED}
                            >
                                Reset Agent
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
