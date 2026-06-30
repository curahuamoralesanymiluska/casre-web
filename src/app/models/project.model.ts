export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'Fullstack' | 'DevOps';
  status: 'Planning' | 'Active' | 'Completed';
  stars: number;
  tags: string[];
  updatedAt: Date;
}
