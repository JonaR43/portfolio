import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { StatBox, TechBadge } from './components/ShareUI';
import { ProjectCard, ProjectDetailView } from './components/ProjectUI';
import { useIsMobile } from './hooks';
import { useProjects, useAbout, useContact } from '../../hooks/usePortfolioData';

const panelVariants: Variants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: "spring", damping: 25, stiffness: 200, delay: 0.6 } },
  exit: { y: '100%', transition: { type: "spring", damping: 30, stiffness: 300, delay: 0 } }
};

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

type ProjectData = { id: string; title: string; desc: string; tech: string[]; gallery: string[]; githubUrl: string; liveUrl: string };

export default function ContentPanel({ activeSection, onClose }: { activeSection: string | null, onClose: () => void }) {
    const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
    const isMobile = useIsMobile();
    const isExpanded = !!activeProject;

    // Fetch data from API
    const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
    const { data: about, isLoading: aboutLoading, error: aboutError } = useAbout();
    const { data: contact, isLoading: contactLoading, error: contactError } = useContact();

    useEffect(() => {
        if (!activeSection) setActiveProject(null);
    }, [activeSection]);

    // Loading component
    const LoadingState = () => (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-sm text-gray-400 tracking-wider">LOADING DATA...</span>
            </div>
        </div>
    );

    // Error component
    const ErrorState = ({ message }: { message: string }) => (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-4xl">⚠</span>
                <span className="font-mono text-sm text-red-400 tracking-wider">CONNECTION ERROR</span>
                <span className="text-gray-500 text-sm max-w-md">{message}</span>
            </div>
        </div>
    );

    return (
        <AnimatePresence mode="wait">
            {activeSection && (
                <>
                    <motion.div key="backdrop" variants={backdropVariants} initial="hidden" animate="visible" exit="exit" onClick={onClose} className="fixed inset-0 z-[9990] bg-black/80 backdrop-blur-[2px]" style={{ pointerEvents: 'auto' }} />
                    <motion.div key="panel" variants={panelVariants} initial="hidden"
                        animate={{ y: 0, height: isExpanded ? '100vh' : '85vh', borderTopLeftRadius: isExpanded ? '0px' : '24px', borderTopRightRadius: isExpanded ? '0px' : '24px', transition: { type: "spring", damping: 25, stiffness: 200, delay: 0.5 } }}
                        exit="exit"
                        style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 10000, backgroundColor: '#0a0a0a', borderTop: '2px solid #E07A5F', overflow: 'hidden', display: 'flex', flexDirection: 'column', pointerEvents: 'auto' }}
                        className="shadow-2xl"
                    >
                        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.03, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />
                        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0f0f0f]" style={{ flexShrink: 0 }}>
                             <button onClick={onClose} className="flex items-center gap-2 text-[#E07A5F] hover:text-white transition-colors group cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                <span className="font-mono text-xs tracking-[0.2em] uppercase">ABORT</span>
                             </button>
                             <div className="flex items-center gap-3">
                                 <div className="w-1.5 h-1.5 bg-[#E07A5F] rounded-full animate-pulse" />
                                 <h2 className="text-lg font-bold tracking-[0.2em] text-[#F4F1DE] uppercase opacity-80 hidden md:block font-mono">// {activeSection}</h2>
                             </div>
                        </div>
                        {/* SCROLL CONTAINER */}
                        <div className="relative z-10 w-full p-6 md:p-12 text-gray-300 font-sans hide-scrollbar" style={{ flex: 1, minHeight: 0, overflowY: 'scroll', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', position: 'relative' }}>
                            {/* FIX: minHeight instead of height to allow scrolling */}
                            <div className="max-w-7xl mx-auto pb-24">
                                {activeSection === 'about' && (
                                    aboutLoading ? <LoadingState /> :
                                    aboutError ? <ErrorState message="Unable to load profile data. Please try again later." /> :
                                    about && (
                                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '32px', marginBottom: '32px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', gap: '24px' }}>
                                            <div>
                                                <h1 style={{ fontSize: isMobile ? '2.5rem' : '3rem', fontWeight: 'bold', color: 'white', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '-0.05em', fontFamily: 'monospace' }}>{about.name.split(' ')[0]} <span style={{ color: '#E07A5F' }}>{about.name.split(' ').slice(1).join(' ')}</span></h1>
                                                <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '600px', lineHeight: '1.75' }}>{about.tagline}</p>
                                            </div>
                                            {!isMobile && (
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'monospace' }}>Clearance Level</div>
                                                    <div style={{ color: '#E07A5F', fontWeight: 'bold', fontSize: '1.25rem', fontFamily: 'monospace' }}>{about.clearance}</div>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                                            <StatBox label="Role" value={about.stats.role} />
                                            <StatBox label="Focus" value={about.stats.focus} sub={about.stats.focusSub} />
                                            <StatBox label="Location" value={about.stats.location} sub={about.stats.locationSub} />
                                            <StatBox label="Status" value={about.stats.status} sub={about.stats.statusSub} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '32px', paddingBottom: isMobile ? '40px' : '0' }}>
                                            <div style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.25rem' }}>⌖</span> OBJECTIVE</h3>
                                                <p style={{ fontSize: '1rem', lineHeight: '2', color: '#d1d5db', fontWeight: '300' }}>{about.objective}</p>
                                            </div>
                                            <div style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.25rem' }}>⚡</span> ARSENAL</h3>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{about.arsenal.map((tech, index) => <TechBadge key={tech} label={tech} index={index} />)}</div>
                                            </div>
                                        </div>

                                        <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: isMobile ? '80px' : '0' }}>
                                            <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '1.25rem' }}>🎓</span> EDUCATION</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                {about.education.map((edu, index) => (
                                                <div key={edu.degree} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderLeft: index === 0 ? '2px solid #E07A5F' : '2px solid rgba(224, 122, 95, 0.3)', paddingLeft: '20px' }}>
                                                    <div>
                                                        <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>{edu.degree}</h4>
                                                        <div style={{ color: '#9ca3af', fontSize: '0.9rem', fontFamily: 'monospace' }}>{edu.school}</div>
                                                    </div>
                                                    <div style={{ color: index === 0 ? '#E07A5F' : '#9ca3af', fontWeight: 'bold', fontFamily: 'monospace' }}>{edu.year}</div>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    )
                                )}
                                {activeSection === 'projects' && (
                                    projectsLoading ? <LoadingState /> :
                                    projectsError ? <ErrorState message="Unable to load projects. Please try again later." /> :
                                    projects && (
                                    <>
                                        {!activeProject ? (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px', marginBottom: '32px' }}>
                                                    <h1 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: '-0.05em', fontFamily: 'monospace' }}>Mission <span style={{ color: '#E07A5F' }}>Logs</span></h1>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#E07A5F', borderRadius: '50%', display: 'inline-block' }} className="animate-pulse" /><span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#E07A5F' }}>STATUS: CLASSIFIED</span></div>
                                                </div>
                                                {/* Force padding bottom on mobile so last card isn't cut off */}
                                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', gap: '48px', paddingBottom: isMobile ? '80px' : '0' }}>
                                                    {projects.map((project) => (<ProjectCard key={project.id} project={project} onClick={() => setActiveProject(project)} />))}
                                                </div>
                                            </div>
                                        ) : (<ProjectDetailView project={activeProject} onBack={() => setActiveProject(null)} />)}
                                    </>
                                    )
                                )}
                                {activeSection === 'contact' && (
                                    contactLoading ? <LoadingState /> :
                                    contactError ? <ErrorState message="Unable to load contact info. Please try again later." /> :
                                    contact && (
                                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '24px 0' : '48px 0' }}>
                                        <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                                            <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(to right, #E07A5F, #9333ea)', borderRadius: '8px', filter: 'blur(20px)', opacity: 0.25 }}></div>
                                            <div style={{ position: 'relative', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: isMobile ? '24px' : '48px', borderRadius: '8px', textAlign: 'center' }}>
                                                <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 'bold', color: 'white', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '-0.05em', fontFamily: 'monospace' }}>Establish <span style={{ color: '#E07A5F' }}>Uplink</span></h1>
                                                <p style={{ color: '#9ca3af', marginBottom: '40px', fontSize: '1.125rem', fontWeight: '300' }}>Secure channels are open. Ready to discuss high-performance architecture.</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', width: '100%' }}>
                                                    {[
                                                        { label: 'Email_Protocol', url: contact.email ? `mailto:${contact.email}` : null },
                                                        { label: 'GitHub_Repo', url: contact.github },
                                                        { label: 'LinkedIn_Feed', url: contact.linkedin },
                                                        { label: 'Resume_DL', url: contact.resume },
                                                    ].filter(item => item.url).map(({ label, url }) => (
                                                        <a key={label} href={url!} target={label === 'Email_Protocol' ? '_self' : '_blank'} rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', borderRadius: '4px', transition: 'all 0.2s', textDecoration: 'none', color: 'inherit' }} className="hover:bg-[#E07A5F] hover:text-black hover:border-[#E07A5F] group">
                                                            <span style={{ fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px' }}>{label}</span>
                                                            <span style={{ fontSize: '14px' }}>→</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}