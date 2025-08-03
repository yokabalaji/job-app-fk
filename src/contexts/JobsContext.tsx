import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
// import { isTokenExpired } from '@/lib/auth';

export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  datePosted: string;
}

interface JobsContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'datePosted'>) => void;
  updateJob: (id: string, job: Omit<Job, 'id' | 'datePosted'>) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => Promise<Job | undefined>;
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

const initialJobs: Job[] = [
  {
    _id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    description: 'We are looking for an experienced Frontend Developer...',
    datePosted: '2024-01-15',
  },
  {
    _id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    description: 'Join our fast-growing startup as a Full Stack Engineer...',
    datePosted: '2024-01-14',
  },
];

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const getUserRoleFromToken = (): string => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role || '';
  } catch (err) {
    console.error('Invalid token');
    return '';
  }
};

export const JobsProvider: React.FC<JobsProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://job-app-bk.onrender.com/api/v1/jobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const result = await res.json();
        console.log(result, "result");

        setJobs(result.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        //setJobs(initialJobs);
      }
    };
    fetchJobs()
    setUserRole(getUserRoleFromToken());
  }, []);


  // useEffect(() => {
  //   const checkTokenValidity = () => {
  //     const token = localStorage.getItem('token');
  //     if (!token) return;

  //     if (isTokenExpired(token)) {
  //       alert('Session expired. You will be logged out.');
  //       localStorage.removeItem('jobboard_user');
  //       localStorage.removeItem('token');
  //       window.location.href = '/'; // or use navigate()
  //     } else {
  //       const decoded = jwtDecode<DecodedToken>(token);
  //       const timeLeft = decoded.exp - Math.floor(Date.now() / 1000);

  //       // Optional: notify user before expiry
  //       setTimeout(() => {
  //         alert('Your session is about to expire. Please save your work.');
  //       }, (timeLeft - 60) * 1000); // warn 60s before

  //       // Auto logout at expiry
  //       setTimeout(() => {
  //         alert('Session expired. Logging out.');
  //         localStorage.removeItem('jobboard_user');
  //         localStorage.removeItem('token');
  //         window.location.href = '/';
  //       }, timeLeft * 1000);
  //     }
  //   };

  //   checkTokenValidity();
  // }, []);


  const addJob = async (newJob: Omit<Job, 'id' | 'datePosted'>) => {
    if (userRole !== 'admin') {
      alert('Only admin can add jobs');
      return;
    }

    try {
      const res = await fetch('https://job-app-bk.onrender.com/api/v1/jobs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newJob),
      });

      if (!res.ok) throw new Error('Failed to add job');

      const { data } = await res.json();

      console.log(data, "createdJob");


      const updatedJobs = [data, ...jobs];
      setJobs(updatedJobs);
      localStorage.setItem('jobboard_jobs', JSON.stringify(updatedJobs));
    } catch (err) {
      console.error(err);
      alert('Error adding job');
    }
  };

  const updateJob = async (id: string, updatedJob: Omit<Job, 'id' | 'datePosted'>) => {
    if (userRole !== 'admin') {
      alert('Only admin can update jobs');
      return;
    }

    try {
      const res = await fetch(`https://job-app-bk.onrender.com/api/v1/jobs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedJob),
      });

      if (!res.ok) throw new Error('Failed to update job');

      const {data} = await res.json();

      const updatedJobs = jobs.map((j) => (j._id === id ? data : j));
      console.log(updatedJobs, "updatedJobs");

      setJobs(updatedJobs);
      localStorage.setItem('jobboard_jobs', JSON.stringify(updatedJobs));
    } catch (err) {
      console.error(err);
      alert('Error updating job');
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/jobs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to delete job');

      const updatedJobs = jobs.filter((job) => job._id !== id);
      setJobs(updatedJobs);
      localStorage.setItem('jobboard_jobs', JSON.stringify(updatedJobs));
    } catch (err) {
      console.error(err);
      alert('Error deleting job');
    }
  };

  const getJobById = async (id: string): Promise<Job | undefined> => {
    try {
      const res = await fetch(`https://job-app-bk.onrender.com/api/v1/jobs/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Failed to fetch job');

      const job = await res.json();



      return await job.data;
    } catch (err) {
      console.error(err);
      alert('Error fetching job');
      return undefined;
    }
  };

  const value: JobsContextType = {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};
