
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resultAPI, handleApiError } from "@/lib/api";
import { useAuthContext } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, BarChart2, Calendar, AlertTriangle } from 'lucide-react';

interface Result {
  _id: string;
  test: {
    _id: string;
    title: string;
    subject: string;
  };
  score: number;
  totalPossible: number;
  scorePercentage: number;
  timeTaken: number;
  createdAt: string;
}

const Results = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("recent");
  
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['results'],
    queryFn: () => resultAPI.getUserResults().then(res => res.data.results),
    enabled: !!user,
  });

  useEffect(() => {
    if (error) {
      handleApiError(error, "Failed to load results");
    }
  }, [error]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login', { state: { redirectTo: '/results' } });
    }
  }, [user, isLoading, navigate]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time taken
  const formatTimeTaken = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get color based on score percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  // Filter and sort results based on selected tab
  const filteredResults = results ? [...results].sort((a, b) => {
    if (selectedTab === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (selectedTab === 'best') {
      return b.scorePercentage - a.scorePercentage;
    }
    return 0;
  }) : [];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          
          <Skeleton className="h-10 w-full mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Test Results</h1>
          <p className="text-gray-600">
            View and analyze your previous test attempts
          </p>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full md:w-1/3 grid-cols-2">
            <TabsTrigger value="recent">Most Recent</TabsTrigger>
            <TabsTrigger value="best">Best Scores</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredResults && filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result: Result) => (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{result.test.title}</CardTitle>
                    <p className="text-sm text-gray-500">{result.test.subject}</p>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-gray-400" />
                        <span>Score:</span>
                      </div>
                      <span className={`font-bold text-lg ${getScoreColor(result.scorePercentage)}`}>
                        {result.score}/{result.totalPossible} ({result.scorePercentage.toFixed(1)}%)
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span>Time:</span>
                      </div>
                      <span>{formatTimeTaken(result.timeTaken)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>Date:</span>
                      </div>
                      <span>{formatDate(result.createdAt)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/result/${result._id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold">No results yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't taken any tests yet. Start by taking a test to see your results here.
            </p>
            <Button onClick={() => navigate('/tests')}>
              Browse Tests
            </Button>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Results;
