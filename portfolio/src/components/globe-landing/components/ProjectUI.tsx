import { useState } from 'react';
import { PROJECT_DATA } from '../constants';
import { TechBadge } from './ShareUI';

export const ImageCarousel = ({ images }: { images: string[] }) => {
    const [index, setIndex] = useState(0);

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex((prev) => (prev + 1) % images.length);
    };

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={images[index]} alt="Project Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.9 }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
            {images.length > 1 && (
                <>
                    <button onClick={prev} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid #E07A5F', padding: '12px', cursor: 'pointer', borderRadius: '4px', zIndex: 20 }}>←</button>
                    <button onClick={next} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid #E07A5F', padding: '12px', cursor: 'pointer', borderRadius: '4px', zIndex: 20 }}>→</button>
                </>
            )}
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', backgroundColor: 'black', padding: '4px 12px', fontFamily: 'monospace', fontSize: '12px', color: '#E07A5F', border: '1px solid #E07A5F' }}>
                IMG_0{index + 1} / 0{images.length}
            </div>
        </div>
    );
};

export const ProjectCard = ({ project, onClick }: { project: typeof PROJECT_DATA[0], onClick: (id: string) => void }) => (
    <div onClick={() => onClick(project.id)} className="group" style={{
        display: 'flex', flexDirection: 'column', position: 'relative', height: '100%', minHeight: '400px', cursor: 'pointer',
        background: 'linear-gradient(180deg, rgba(30,30,35,0.8) 0%, rgba(10,10,10,1) 100%)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden',
        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.5)', transition: 'transform 0.3s ease'
    }}>
        <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
            <img src={project.gallery[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.8, transition: 'transform 0.5s ease', filter: 'grayscale(100%) contrast(1.2)' }} className="group-hover:scale-105 group-hover:grayscale-0" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,1), transparent)' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#E07A5F', color: '#000', padding: '4px 12px', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>{project.id}</div>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', fontFamily: '"Share Tech Mono", monospace', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '8px' }}>{project.title}</h3>
            <div style={{ height: '1px', width: '40px', backgroundColor: '#E07A5F', marginBottom: '16px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.875rem', color: '#aaa', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>{project.desc}</p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>{project.tech.map(t => <TechBadge key={t} label={t} />)}</div>
        </div>
    </div>
);

export const ProjectDetailView = ({ project, onBack }: { project: typeof PROJECT_DATA[0], onBack: () => void }) => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#E07A5F', cursor: 'pointer', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '0.1em' }}>← RETURN_TO_LIST</button>
            <div style={{ fontFamily: 'monospace', color: '#666', fontSize: '12px' }}>ID: {project.id} // CLASSIFIED</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px', height: '100%', paddingBottom: '40px' }}>
            <div style={{ height: '100%', maxHeight: '65vh' }}><ImageCarousel images={project.gallery} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', textTransform: 'uppercase', lineHeight: '1.1' }}>{project.title}</h1>
                    <div style={{ height: '2px', width: '60px', backgroundColor: '#E07A5F', marginTop: '16px' }} />
                </div>
                <div>
                    <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '12px', fontSize: '12px' }}>// MISSION_BRIEF</h3>
                    <p style={{ color: '#ccc', lineHeight: '1.8', fontSize: '16px', fontWeight: '300' }}>{project.desc}</p>
                </div>
                <div>
                    <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '12px', fontSize: '12px' }}>// TECH_STACK</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>{project.tech.map(t => <TechBadge key={t} label={t} />)}</div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                    <h3 style={{ color: '#E07A5F', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '12px', fontSize: '12px' }}>// UPLINKS</h3>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none', fontFamily: 'monospace', fontSize: '12px', borderRadius: '4px', transition: 'all 0.2s' }}>GITHUB_REPO</a>
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', padding: '16px', backgroundColor: '#E07A5F', color: 'black', textDecoration: 'none', fontFamily: 'monospace', fontSize: '12px', borderRadius: '4px', fontWeight: 'bold' }}>LIVE_DEMO</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);