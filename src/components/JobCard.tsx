
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar } from 'lucide-react';
import { Job } from '../contexts/JobsContext';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Link to={`/job/${job.id}`} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-purple-200 group-hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-3">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
              {job.title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Building2 className="h-4 w-4 mr-1" />
            <span className="font-medium">{job.company}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            {truncateDescription(job.description)}
          </p>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Posted on {formatDate(job.datePosted)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default JobCard;
