import { Injectable, signal, computed } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // Private signals for state management
  private readonly projectsState = signal<Project[]>([]);
  private readonly loadingState = signal<boolean>(false);
  private readonly searchFilterState = signal<string>('');
  private readonly categoryFilterState = signal<string>('All');

  // Public readonly signals exposed to components
  public readonly projects = computed(() => this.projectsState());
  public readonly isLoading = computed(() => this.loadingState());
  public readonly searchFilter = computed(() => this.searchFilterState());
  public readonly categoryFilter = computed(() => this.categoryFilterState());

  // Filtered projects computed signal
  public readonly filteredProjects = computed(() => {
    const search = this.searchFilterState().toLowerCase().trim();
    const cat = this.categoryFilterState();
    
    return this.projectsState().filter(project => {
      const matchesSearch = !search || 
        project.name.toLowerCase().includes(search) || 
        project.description.toLowerCase().includes(search) ||
        project.tags.some(tag => tag.toLowerCase().includes(search));
        
      const matchesCategory = cat === 'All' || project.category === cat;
      
      return matchesSearch && matchesCategory;
    });
  });

  constructor() {
    this.loadMockProjects();
  }

  // Setters for filters
  public setSearchFilter(query: string): void {
    this.searchFilterState.set(query);
  }

  public setCategoryFilter(category: string): void {
    this.categoryFilterState.set(category);
  }

  // Action methods
  public addProject(project: Omit<Project, 'id' | 'updatedAt' | 'stars'>): void {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      stars: 0,
      updatedAt: new Date()
    };
    this.projectsState.update(projects => [newProject, ...projects]);
  }

  public toggleStar(id: string): void {
    this.projectsState.update(projects => 
      projects.map(p => p.id === id ? { ...p, stars: p.stars + 1 } : p)
    );
  }

  // Mock loader
  private loadMockProjects(): void {
    this.loadingState.set(true);
    
    const mockData: Project[] = [
      {
        id: '1',
        name: 'Vortex UI Dashboard',
        description: 'A glassmorphic administrative interface built with custom CSS Custom Properties and modular layout architectures.',
        category: 'Frontend',
        status: 'Active',
        stars: 124,
        tags: ['Angular', 'SCSS', 'Vite', 'Glassmorphism'],
        updatedAt: new Date('2026-06-15')
      },
      {
        id: '2',
        name: 'Hyperion API Gateway',
        description: 'High-performance microservice router with built-in rate-limiting, load-balancing, and telemetry reporting endpoints.',
        category: 'Backend',
        status: 'Completed',
        stars: 98,
        tags: ['NodeJS', 'TypeScript', 'Fastify', 'Redis'],
        updatedAt: new Date('2026-05-20')
      },
      {
        id: '3',
        name: 'Atlas Cloud Orchestrator',
        description: 'Multi-cloud deployment controller providing automated scaling, certificate provisioning, and visual topology grids.',
        category: 'DevOps',
        status: 'Planning',
        stars: 45,
        tags: ['Kubernetes', 'Go', 'Terraform', 'AWS'],
        updatedAt: new Date('2026-06-21')
      },
      {
        id: '4',
        name: 'Nexus E-Commerce Engine',
        description: 'Fully headless commerce platform featuring real-time inventory synchronizations, multi-currency support, and Stripe checkouts.',
        category: 'Fullstack',
        status: 'Active',
        stars: 215,
        tags: ['Angular', 'NestJS', 'GraphQL', 'PostgreSQL'],
        updatedAt: new Date('2026-06-18')
      }
    ];

    // Simulate async network delay
    setTimeout(() => {
      this.projectsState.set(mockData);
      this.loadingState.set(false);
    }, 800);
  }
}
