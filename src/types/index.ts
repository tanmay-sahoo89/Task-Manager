export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  avatar?: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
  taskCount?: number;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  users: User[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addComment: (taskId: string, text: string) => void;
  addProject: (project: Omit<Project, 'id' | 'taskCount'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getProjectById: (id: string) => Project | undefined;
  getUserById: (id: string) => User | undefined;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
