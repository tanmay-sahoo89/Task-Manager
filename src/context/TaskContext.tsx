import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TaskContextType, Task, Project, User } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { useAuth } from './AuthContext';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const tasksStr = localStorage.getItem(STORAGE_KEYS.TASKS);
    const projectsStr = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);

    if (tasksStr) setTasks(JSON.parse(tasksStr));
    if (projectsStr) setProjects(JSON.parse(projectsStr));
    if (usersStr) setUsers(JSON.parse(usersStr));
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(newTasks));
  };

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newProjects));
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    saveTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(task => task.id !== id));
  };

  const addComment = (taskId: string, text: string) => {
    if (!currentUser) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newComment = {
          id: `comment${Date.now()}`,
          userId: currentUser.id,
          text,
          date: new Date().toISOString(),
        };
        return {
          ...task,
          comments: [...task.comments, newComment],
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });
    saveTasks(updatedTasks);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'taskCount'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj${Date.now()}`,
    };
    saveProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    );
    saveProjects(updatedProjects);
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter(project => project.id !== id));
  };

  const getTaskById = (id: string) => tasks.find(task => task.id === id);
  const getProjectById = (id: string) => projects.find(project => project.id === id);
  const getUserById = (id: string) => users.find(user => user.id === id);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        users,
        addTask,
        updateTask,
        deleteTask,
        addComment,
        addProject,
        updateProject,
        deleteProject,
        getTaskById,
        getProjectById,
        getUserById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};
