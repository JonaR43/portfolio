export interface AboutSection {
  id: string;
  name: string;
  tagline: string;
  objective: string;
  arsenal: string[];
  stats: {
    role: string;
    focus: string;
    focusSub?: string;
    location: string;
    locationSub?: string;
    status: string;
    statusSub?: string;
  };
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  clearance: string;
  updatedAt: string;
}
