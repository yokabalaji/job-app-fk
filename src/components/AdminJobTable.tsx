
import React, { useState } from 'react';
import { useJobs, Job } from '../contexts/JobsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const AdminJobTable = () => {
  const { jobs, updateJob, deleteJob } = useJobs();
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    title: '',
    company: '',
    description: ''
  });

  console.log(jobs, "jobs");

  const handleEditClick = (job: Job) => {
    setEditingJob(job);
    setEditForm({
      title: job.title,
      company: job.company,
      description: job.description
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    if (!editForm.title.trim() || !editForm.company.trim() || !editForm.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // updateJob(editingJob._id, {
    //   title: editForm.title.trim(),
    //   company: editForm.company.trim(),
    //   description: editForm.description.trim(),
    //   _id: ''
    // });

    updateJob(editingJob._id, {
      ...editingJob,
      title: editForm.title.trim(),
      company: editForm.company.trim(),
      description: editForm.description.trim(),
    });


    toast.success('Job updated successfully!');
    setIsEditDialogOpen(false);
    setEditingJob(null);
  };

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    deleteJob(jobId);
    toast.success(`Job "${jobTitle}" deleted successfully!`);
  };

  // const truncateText = (text: string, maxLength: number = 50) => {
  //   if (text.length <= maxLength) return text;
  //   return text.substring(0, maxLength) + '...';
  // };

  const truncateText = (text: string | undefined, maxLength: number = 50) => {
    if (!text) return '';
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Manage Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">
                    {truncateText(job.title, 30)}
                  </TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell className="max-w-xs">
                    {truncateText(job.description, 60)}
                  </TableCell>
                  <TableCell>{formatDate(job.datePosted)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/job/${job._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Dialog open={isEditDialogOpen && editingJob?._id === job._id} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(job)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>Edit Job</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <label htmlFor="edit-title" className="text-sm font-medium">
                                Job Title
                              </label>
                              <Input
                                id="edit-title"
                                value={editForm.title}
                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="edit-company" className="text-sm font-medium">
                                Company Name
                              </label>
                              <Input
                                id="edit-company"
                                value={editForm.company}
                                onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="edit-description" className="text-sm font-medium">
                                Job Description
                              </label>
                              <Textarea
                                id="edit-description"
                                value={editForm.description}
                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                required
                                rows={6}
                                className="resize-none"
                              />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                                Update Job
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Job</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{job.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteJob(job._id, job.title)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No jobs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminJobTable;
