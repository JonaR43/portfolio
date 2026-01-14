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
        id: 'SP-24',
        title: 'JACS ShiftPilot',
        desc: 'Intelligent volunteer management platform featuring a weighted matching algorithm (Location, Skills, Availability). Built with a robust repository pattern and 82% test coverage.',
        tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
        gallery: [
            'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com/JonaR43/Software_Design_Group_24',
        liveUrl: '#'
    },
    {
        id: 'SM-02',
        title: 'ShopMauve E-Commerce',
        desc: 'Full-stack e-commerce solution with Stripe integration, real-time inventory, and an analytics dashboard. Features a secure JWT-based auth system and a responsive Radix UI frontend.',
        tech: ['React', 'TypeScript', 'Prisma', 'Stripe', 'Tailwind'],
        gallery: [
            'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com',
        liveUrl: '#'
    },
    {
        id: 'PV-VR',
        title: 'PutterVerse',
        desc: 'Immersive VR Mini Golf experience for Meta Quest. Features physics-driven gameplay, multiple themed courses (Ice Arena, Haunted Mansion), and local multiplayer.',
        tech: ['Unity', 'C#', 'VR/XR', 'Meta Quest'],
        gallery: [
            'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com/JonaR43/PutterVerse',
        liveUrl: '#'
    },
    {
        id: 'BG-PY',
        title: 'Barcode Generator',
        desc: 'Desktop automation tool for bulk generating Avery-compatible barcode labels from CSV data. Built with Tkinter for a native drag-and-drop UI and ReportLab for precise PDF rendering.',
        tech: ['Python', 'Tkinter', 'Pandas', 'ReportLab'],
        gallery: [
            'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com/JonaR43/Barcode',
        liveUrl: '#'
    },
    {
        id: 'CL-FS',
        title: 'Contact List Manager',
        desc: 'Full-stack CRUD application for managing personal contacts. Features a Flask (Python) REST API backend and a responsive React (Vite) frontend with real-time updates.',
        tech: ['React', 'Flask', 'Python', 'SQLAlchemy'],
        gallery: [
            'https://images.unsplash.com/photo-1512428559087-560fa5ce7d02?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800'
        ],
        githubUrl: 'https://github.com/JonaR43/Contact-List',
        liveUrl: '#'
    }
];