import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const TechBadge = ({ label }: { label: string }) => (
    <span style={{
        display: 'inline-block',
        padding: '4px 8px',
        marginRight: '8px',
        marginBottom: '4px',
        borderRadius: '4px',
        backgroundColor: 'rgba(224, 122, 95, 0.05)',
        border: '1px solid rgba(224, 122, 95, 0.2)',
        fontSize: '10px',
        fontFamily: '"Share Tech Mono", monospace',
        color: '#E07A5F',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    }}>
        {label}
    </span>
);

export const StatBox = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
    <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '16px',
        borderRadius: '8px'
    }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#E07A5F', opacity: 0.8 }} />
        <span style={{ display: 'block', fontSize: '10px', color: '#888', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{label}</span>
        <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: 'white', fontFamily: 'monospace' }}>{value}</span>
        {sub && <span style={{ display: 'block', fontSize: '10px', color: '#666', marginTop: '4px', fontFamily: 'monospace' }}>{sub}</span>}
    </div>
);

export function TerminalHeader({ visible }: { visible: boolean }) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toISOString().split('T')[1].split('.')[0] + " Z";
            const dateString = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase();
            setTime(`${dateString} :: ${timeString}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 5000, pointerEvents: 'none', userSelect: 'none' }}
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');`}</style>
            <div style={{ fontFamily: '"Share Tech Mono", monospace' }}>
                <div style={{
                    backgroundColor: 'rgba(26, 27, 30, 0.95)',
                    borderLeft: '3px solid #E07A5F',
                    padding: '12px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
                    width: 'fit-content',
                    backdropFilter: 'blur(8px)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '10px', height: '10px', borderTop: '2px solid #E07A5F', borderRight: '2px solid #E07A5F' }} />
                    <div style={{ position: 'absolute', bottom: '-1px', left: '-1px', width: '10px', height: '10px', borderBottom: '2px solid #E07A5F', borderLeft: '2px solid #E07A5F' }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                        <span style={{ color: '#E07A5F', fontSize: '1.125rem', letterSpacing: '0.1em', fontWeight: 'bold' }}>OP_OVERWATCH</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" style={{ backgroundColor: '#22c55e', width: '6px', height: '6px', borderRadius: '50%' }} />
                             <span style={{ color: '#22c55e', fontSize: '10px', letterSpacing: '0.05em', fontWeight: 'bold' }}>LIVE</span>
                        </div>
                    </div>
                    <div style={{ color: '#F4F1DE', fontSize: '12px', opacity: 0.8, letterSpacing: '0.05em', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
                            <span style={{ color: '#888' }}>LOC</span><span>34.05°N, 118.24°W</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px' }}>
                             <span style={{ color: '#888' }}>CLK</span><span>{time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}