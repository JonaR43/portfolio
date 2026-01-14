import { useQuery } from '@tanstack/react-query';
import { projectsService } from '../services/projects.service';
import { aboutService } from '../services/about.service';
import { contactService } from '../services/contact.service';
import type { Project } from '../types/project.types';
import type { AboutSection } from '../types/about.types';
import type { ContactInfo } from '../types/contact.types';

// Fallback data for when API is unavailable
import { PROJECT_DATA } from '../components/globe-landing/constants';

const FALLBACK_ABOUT: AboutSection = {
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
    { degree: 'B.S. Computer Science', school: 'University of Houston', year: '2025' },
    { degree: 'B.S. Psychology', school: 'University of Houston', year: '2022' },
  ],
  clearance: 'UH-25',
  updatedAt: new Date().toISOString(),
};

const FALLBACK_CONTACT: ContactInfo = {
  id: 'default',
  email: 'jonathan@example.com',
  github: 'https://github.com/JonaR43',
  linkedin: 'https://linkedin.com/in/jonathan-reyes',
  resume: '#',
  twitter: null,
  updatedAt: new Date().toISOString(),
};

// Transform API project to match the format expected by UI components
function transformProject(project: Project) {
  return {
    id: project.id,
    title: project.title,
    desc: project.description,
    tech: project.tech,
    gallery: project.gallery,
    githubUrl: project.githubUrl || '#',
    liveUrl: project.liveUrl || '#',
  };
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getAll(true),
    select: (data) => data.map(transformProject),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: PROJECT_DATA.map(p => ({
      id: p.id,
      title: p.title,
      description: p.desc,
      tech: p.tech,
      gallery: p.gallery,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      order: 0,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  });
}

export function useAbout() {
  return useQuery({
    queryKey: ['about'],
    queryFn: aboutService.get,
    staleTime: 5 * 60 * 1000,
    placeholderData: FALLBACK_ABOUT,
  });
}

export function useContact() {
  return useQuery({
    queryKey: ['contact'],
    queryFn: contactService.get,
    staleTime: 5 * 60 * 1000,
    placeholderData: FALLBACK_CONTACT,
  });
}
