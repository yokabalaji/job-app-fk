
import { useEffect, useState } from 'react';
import { Job } from '../contexts/JobsContext';
import JobCard from '../components/JobCard';
import { Input } from '@/components/ui/input';
import { Search, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const JobListings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');


  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      fetchJobs();
    }
  }, [isAuthenticated, user]);

  const fetchJobs = async () => {
    const token = localStorage.getItem("jobboard_user");
    if (!token) {
      console.warn("No token found in localStorage.");
      return; // stop here if not logged in
    }

    const parsed = JSON.parse(token);
    try {
      const res = await fetch("https://job-app-bk.onrender.com/api/v1/jobs", {
        headers: {
          Authorization: `Bearer ${parsed.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(data.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching jobs");
    }
  };


  const filteredJobs = jobs
    .filter(job => job && job.title && job.company && job.description)
    .filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl mb-8 text-purple-100">
            Discover amazing opportunities with top companies
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg bg-white text-gray-900 border-0 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Available
            </h2>
          </div>
          {searchTerm && (
            <p className="text-gray-600">
              Results for "{searchTerm}"
            </p>
          )}
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Briefcase className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search terms or browse all available positions."
                : "No job listings available at the moment."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
