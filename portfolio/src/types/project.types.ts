export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  gallery: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  id: string;
  title: string;
  description: string;
  tech: string[];
  gallery: string[];
  githubUrl?: string;
  liveUrl?: string;
  order?: number;
  published?: boolean;
}
