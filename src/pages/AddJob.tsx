
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobsContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import AdminJobTable from '../components/AdminJobTable';

const AddJob = () => {
  const navigate = useNavigate();
  const { addJob } = useJobs();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.company.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      addJob({
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description.trim(),
        _id: ''
      });

      toast.success('Job posted successfully!');
      setFormData({ title: '', company: '', description: '' });
    } catch (error) {
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Plus className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdmin ? 'Job Management' : 'Post a New Job'}
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? 'Create new jobs and manage existing listings'
              : 'Fill in the details below to create a new job listing'
            }
          </p>
        </div>

        {isAdmin ? (
          <Tabs defaultValue="add-job" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="add-job" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Job
              </TabsTrigger>
              <TabsTrigger value="manage-jobs" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manage Jobs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add-job">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-purple-600" />
                      Job Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Job Title */}
                      <div className="flex items-start gap-4">
                        <Label htmlFor="title" className="w-40 pt-2 text-right">
                          Job Title
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          type="text"
                          placeholder="e.g. Senior Frontend Developer"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="flex-1 text-base"
                        />
                      </div>

                      {/* Company Name */}
                      <div className="flex items-start gap-4">
                        <Label htmlFor="company" className="w-40 pt-2 text-right">
                          Company Name
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          placeholder="e.g. TechCorp Inc."
                          value={formData.company}
                          onChange={handleChange}
                          required
                          className="flex-1 text-base"
                        />
                      </div>

                      {/* Job Description */}
                      <div className="flex items-start gap-4">
                        <Label htmlFor="description" className="w-40 pt-2 text-right">
                          Job Description
                        </Label>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Provide a detailed description of the job role, responsibilities, requirements, and any other relevant information..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="resize-none text-base w-full"
                          />
                          <p className="text-sm text-gray-500">
                            Minimum 50 characters. Be specific about the role and requirements.
                          </p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-end gap-4 pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate('/')}
                          className="w-32"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-32 bg-purple-600 hover:bg-purple-700"
                        >
                          {isSubmitting ? 'Posting...' : 'Post Job'}
                        </Button>
                      </div>
                    </form>

                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="mt-6 bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Tips for a great job posting:</h3>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Be specific about the role and requirements</li>
                      <li>• Include salary range and benefits if possible</li>
                      <li>• Mention remote work options or location details</li>
                      <li>• Keep the description clear and engaging</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="manage-jobs">
              <AdminJobTable />
            </TabsContent>
          </Tabs>
        ) : (
          // Regular user view (non-admin)
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-purple-600" />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="e.g. TechCorp Inc."
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide a detailed description of the job role, responsibilities, requirements, and any other relevant information..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={8}
                      className="resize-none text-base"
                    />
                    <p className="text-sm text-gray-500">
                      Minimum 50 characters. Be specific about the role and requirements.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Job'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-2">Tips for a great job posting:</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Be specific about the role and requirements</li>
                  <li>• Include salary range and benefits if possible</li>
                  <li>• Mention remote work options or location details</li>
                  <li>• Keep the description clear and engaging</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddJob;
