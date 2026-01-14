import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      email: 'admin@portfolio.com',
      name: 'Jonathan Reyes',
      passwordHash: await hashPassword('admin123'), // Change this password!
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // Create projects from your existing data
  const projects = [
    {
      id: 'SP-24',
      title: 'JACS ShiftPilot',
      description: 'Intelligent volunteer management platform featuring a weighted matching algorithm (Location, Skills, Availability). Built with a robust repository pattern and 82% test coverage.',
      tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
      gallery: [
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800'
      ],
      githubUrl: 'https://github.com/JonaR43/Software_Design_Group_24',
      liveUrl: '#',
      order: 1,
    },
    {
      id: 'SM-02',
      title: 'ShopMauve E-Commerce',
      description: 'Full-stack e-commerce solution with Stripe integration, real-time inventory, and an analytics dashboard. Features a secure JWT-based auth system and a responsive Radix UI frontend.',
      tech: ['React', 'TypeScript', 'Prisma', 'Stripe', 'Tailwind'],
      gallery: [
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
      ],
      githubUrl: 'https://github.com',
      liveUrl: '#',
      order: 2,
    },
    {
      id: 'PV-VR',
      title: 'PutterVerse',
      description: 'Immersive VR Mini Golf experience for Meta Quest. Features physics-driven gameplay, multiple themed courses (Ice Arena, Haunted Mansion), and local multiplayer.',
      tech: ['Unity', 'C#', 'VR/XR', 'Meta Quest'],
      gallery: [
        'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800'
      ],
      githubUrl: 'https://github.com/JonaR43/PutterVerse',
      liveUrl: '#',
      order: 3,
    },
    {
      id: 'BG-PY',
      title: 'Barcode Generator',
      description: 'Desktop automation tool for bulk generating Avery-compatible barcode labels from CSV data. Built with Tkinter for a native drag-and-drop UI and ReportLab for precise PDF rendering.',
      tech: ['Python', 'Tkinter', 'Pandas', 'ReportLab'],
      gallery: [
        'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&q=80&w=800'
      ],
      githubUrl: 'https://github.com/JonaR43/Barcode',
      liveUrl: '#',
      order: 4,
    },
    {
      id: 'CL-FS',
      title: 'Contact List Manager',
      description: 'Full-stack CRUD application for managing personal contacts. Features a Flask (Python) REST API backend and a responsive React (Vite) frontend with real-time updates.',
      tech: ['React', 'Flask', 'Python', 'SQLAlchemy'],
      gallery: [
        'https://images.unsplash.com/photo-1512428559087-560fa5ce7d02?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800'
      ],
      githubUrl: 'https://github.com/JonaR43/Contact-List',
      liveUrl: '#',
      order: 5,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: project,
      create: project,
    });
  }
  console.log(`✅ Created ${projects.length} projects`);

  // Create about section
  const about = await prisma.aboutSection.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Jonathan Reyes',
      tagline: 'Full Stack Engineer & VR Developer. Creating immersive digital experiences.',
      objective: 'Merging technical expertise in CS with psychological insights to build user-centric, scalable applications and immersive VR environments.',
      arsenal: ['React', 'TypeScript', 'Node.js', 'Python', 'C# / Unity', 'PostgreSQL', 'AWS', 'Docker'],
      stats: {
        role: 'Developer',
        focus: 'Full Stack',
        focusSub: 'Web & XR',
        location: 'Houston',
        locationSub: 'Texas',
        status: 'Open',
        statusSub: 'To Work',
      },
      education: [
        {
          degree: 'B.S. Computer Science',
          school: 'University of Houston',
          year: '2025',
        },
        {
          degree: 'B.S. Psychology',
          school: 'University of Houston',
          year: '2022',
        },
      ],
      clearance: 'UH-25',
    },
  });
  console.log('✅ Created about section');

  // Create contact info
  const contact = await prisma.contactInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      email: 'jonathan@example.com',
      github: 'https://github.com/JonaR43',
      linkedin: 'https://linkedin.com/in/jonathan-reyes',
      resume: '#',
    },
  });
  console.log('✅ Created contact info');

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      backgroundColor: '#121212',
      accentColor: '#E07A5F',
      textColor: '#F4F1DE',
    },
  });
  console.log('✅ Created site settings');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
