
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, Calendar, MapPin } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getJobById } = useJobs();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const job = getJobById(id);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job Listings
        </Link>

        {/* Job Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                  {job.title}
                </CardTitle>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span className="text-xl font-medium">{job.company}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Posted on {formatDate(job.datePosted)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium">
                  Now Hiring
                </Badge>
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Apply Now
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">Company</span>
                  </div>
                  <p className="text-gray-600 ml-6">{job.company}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">Location</span>
                  </div>
                  <p className="text-gray-600 ml-6">Remote / On-site</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">Posted</span>
                  </div>
                  <p className="text-gray-600 ml-6">{formatDate(job.datePosted)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Apply for this position</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-3">
                  Apply Now
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  By clicking Apply, you'll be redirected to the company's application process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
