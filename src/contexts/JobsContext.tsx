
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  datePosted: string;
}

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'datePosted'>) => void;
  getJobById: (id: string) => Job | undefined;
}

const JobsContext = createContext<JobsContextType | null>(null);

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};

interface JobsProviderProps {
  children: ReactNode;
}

// Dummy job data
const initialJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user-facing web applications using modern technologies like React, TypeScript, and Tailwind CSS. The ideal candidate should have 5+ years of experience in frontend development and strong problem-solving skills.',
    datePosted: '2024-01-15'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    description: 'Join our fast-growing startup as a Full Stack Engineer. You will work on both frontend and backend technologies including React, Node.js, and PostgreSQL. We offer competitive salary, equity options, and flexible work arrangements.',
    datePosted: '2024-01-14'
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Design Studios',
    description: 'We are seeking a creative UX/UI Designer to design intuitive and engaging user experiences. You should be proficient in Figma, Adobe Creative Suite, and have experience with design systems and user research.',
    datePosted: '2024-01-13'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    description: 'Looking for a DevOps Engineer to help scale our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines required. You will work closely with development teams to ensure smooth deployments and system reliability.',
    datePosted: '2024-01-12'
  }
];

export const JobsProvider: React.FC<JobsProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const savedJobs = localStorage.getItem('jobboard_jobs');
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      setJobs(initialJobs);
      localStorage.setItem('jobboard_jobs', JSON.stringify(initialJobs));
    }
  }, []);

  const addJob = (newJob: Omit<Job, 'id' | 'datePosted'>) => {
    const job: Job = {
      ...newJob,
      id: Date.now().toString(),
      datePosted: new Date().toISOString().split('T')[0]
    };
    
    const updatedJobs = [job, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem('jobboard_jobs', JSON.stringify(updatedJobs));
  };

  const getJobById = (id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
  };

  const value: JobsContextType = {
    jobs,
    addJob,
    getJobById
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};
