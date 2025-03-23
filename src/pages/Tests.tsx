
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, handleApiError } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Search, Clock, Filter, Book } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Test {
  _id: string;
  title: string;
  description: string;
  subject: string;
  timeLimit: number;
  questions: any[];
  creator: {
    name: string;
  };
  createdAt: string;
}

const fetchTests = async () => {
  const response = await api.get('/tests');
  return response.data.tests;
};

const Tests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: fetchTests,
  });

  useEffect(() => {
    if (error) {
      handleApiError(error, "Failed to load tests");
    }
  }, [error]);

  const filteredTests = tests?.filter((test: Test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        test.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = subjectFilter === "" || test.subject.toLowerCase() === subjectFilter.toLowerCase();
    
    return matchesSearch && matchesSubject;
  }) || [];

  const uniqueSubjects = tests ? Array.from(new Set(tests.map((test: Test) => test.subject))) : [];

  const handleStartTest = (testId: string) => {
    if (!user) {
      navigate('/login', { state: { redirectTo: `/test/${testId}` } });
      return;
    }
    
    navigate(`/test/${testId}`);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Available Tests</h1>
          <p className="text-lg text-gray-600">
            Browse and take tests from various subjects to assess your knowledge
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tests by title or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="md:w-1/4">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {uniqueSubjects.map((subject: string) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test: Test) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1">{test.title}</CardTitle>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Book className="h-3 w-3" /> {test.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 mb-4 line-clamp-3">{test.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> 
                        {test.timeLimit} mins
                      </div>
                      <div>{test.questions.length} questions</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleStartTest(test._id)}
                    >
                      Start Test
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold">No tests found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || subjectFilter ? 
                "Try adjusting your search criteria" : 
                "There are no tests available at the moment"}
            </p>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Tests;
