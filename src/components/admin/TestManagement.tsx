
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Search, Edit, Trash2, Eye, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Test {
  _id: string;
  title: string;
  subject: string;
  isPublished: boolean;
  questions: any[];
  createdAt: string;
}

const TestManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tests, isLoading } = useQuery({
    queryKey: ['admin-tests'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/tests');
        return response.data.tests;
      } catch (error) {
        handleApiError(error, "Failed to load tests");
        return [];
      }
    },
  });

  const deleteTestMutation = useMutation({
    mutationFn: async (testId: string) => {
      await api.delete(`/tests/${testId}`);
    },
    onSuccess: () => {
      toast.success("Test deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      setTestToDelete(null);
    },
    onError: (error) => {
      handleApiError(error, "Failed to delete test");
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ testId, isPublished }: { testId: string; isPublished: boolean }) => {
      await api.patch(`/tests/${testId}/publish`, { isPublished });
    },
    onSuccess: (_, variables) => {
      toast.success(`Test ${variables.isPublished ? 'published' : 'unpublished'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
    },
    onError: (error) => {
      handleApiError(error, "Failed to update test");
    },
  });

  const handleDeleteTest = (testId: string) => {
    setTestToDelete(testId);
  };

  const confirmDeleteTest = () => {
    if (testToDelete) {
      deleteTestMutation.mutate(testToDelete);
    }
  };

  const handleTogglePublish = (testId: string, isCurrentlyPublished: boolean) => {
    togglePublishMutation.mutate({
      testId,
      isPublished: !isCurrentlyPublished,
    });
  };

  const filteredTests = tests?.filter((test: Test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.subject.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tests..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => navigate("/admin/tests/new")}
              className="w-full md:w-auto"
            >
              Create New Test
            </Button>
          </div>

          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Test</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Subject</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Questions</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {isLoading ? (
                    Array(5).fill(0).map((_, index) => (
                      <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle"><Skeleton className="h-5 w-40" /></td>
                        <td className="p-4 align-middle"><Skeleton className="h-5 w-24" /></td>
                        <td className="p-4 align-middle"><Skeleton className="h-5 w-8" /></td>
                        <td className="p-4 align-middle"><Skeleton className="h-5 w-20" /></td>
                        <td className="p-4 align-middle"><Skeleton className="h-5 w-24" /></td>
                        <td className="p-4 align-middle"><Skeleton className="h-8 w-28" /></td>
                      </tr>
                    ))
                  ) : filteredTests.length > 0 ? (
                    filteredTests.map((test: Test) => (
                      <tr key={test._id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-gray-500" />
                            <span className="line-clamp-1">{test.title}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{test.subject}</td>
                        <td className="p-4 align-middle">{test.questions.length}</td>
                        <td className="p-4 align-middle">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                            test.isPublished 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {test.isPublished ? (
                              <><Check className="h-3 w-3" /> Published</>
                            ) : (
                              <><X className="h-3 w-3" /> Draft</>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">{formatDate(test.createdAt)}</td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => navigate(`/admin/tests/${test._id}`)}
                              title="Edit test"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant={test.isPublished ? "default" : "outline"}
                              size="icon"
                              onClick={() => handleTogglePublish(test._id, test.isPublished)}
                              title={test.isPublished ? "Unpublish test" : "Publish test"}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteTest(test._id)}
                              title="Delete test"
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        {searchTerm ? 
                          "No tests found matching your search" : 
                          "No tests have been created yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!testToDelete} onOpenChange={(open) => !open && setTestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the test and all associated results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTest}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TestManagement;
