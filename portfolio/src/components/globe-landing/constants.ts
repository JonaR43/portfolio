export const COLORS = {
  background: '#121212',
  accent: '#E07A5F',     // Burnt Orange
  text: '#F4F1DE',       // Cream
};

export const SECTIONS = [
  { id: 'about', label: 'ABOUT ME', dir: [1, 0.5, 0.8] },
  { id: 'projects', label: 'PROJECTS', dir: [-1, 0.8, 0.8] },
  { id: 'contact', label: 'CONTACT', dir: [0.2, -1, 0.5] },
];

export const PROJECT_DATA = [
    {
        id: 'DL-01',
        title: 'Esports Data Lake',
        desc: 'Ingesting 5TB of match data daily via serverless pipelines. Normalized disparate data sources into a unified queryable format for analytics teams.',
        tech: ['AWS S3', 'Athena', 'Kinesis', 'Python'],
        gallery: [
            'https://images.unsplash.com/photo-1558494949-efc025793ad2?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com',
        liveUrl: 'https://google.com'
    },
    {
        id: 'OE-99',
        title: 'Odds Engine',
        desc: 'Sub-50ms latency engine for calculating live win probabilities. Uses in-memory caching and optimized Go routines to handle concurrent probability modeling.',
        tech: ['Golang', 'Redis', 'WebSockets', 'Docker'],
        gallery: [
            'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com',
        liveUrl: 'https://google.com'
    },
    {
        id: 'MT-42',
        title: 'Match Telemetry',
        desc: 'Real-time player movement tracking and heatmap generation. Visualizes player density and rotation patterns on a live 2D map.',
        tech: ['Rust', 'Kafka', 'React', 'D3.js'],
        gallery: [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com',
        liveUrl: 'https://google.com'
    }
];