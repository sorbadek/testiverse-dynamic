
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, handleApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, BarChart, Clock, ClipboardList, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Result {
  _id: string;
  test: {
    _id: string;
    title: string;
    subject: string;
    totalPoints: number;
  };
  score: number;
  percentage: number;
  isPassed: boolean;
  duration: number;
  answers: any[];
  createdAt: string;
}

const Results = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { redirectTo: "/results" } });
    }
  }, [user, navigate]);

  const fetchUserResults = async () => {
    if (!user) return [];
    const response = await api.get('/results/user');
    return response.data.results;
  };

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['user-results'],
    queryFn: fetchUserResults,
    enabled: !!user,
  });

  useEffect(() => {
    if (error) {
      handleApiError(error, "Failed to load your test results");
    }
  }, [error]);

  const handleViewDetails = (resultId: string) => {
    navigate(`/result/${resultId}`);
  };

  const handleRetakeTest = (testId: string) => {
    navigate(`/test/${testId}`);
  };

  if (!user) {
    return null;
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
          <h1 className="text-4xl font-bold mb-4">Your Test Results</h1>
          <p className="text-lg text-gray-600">
            Track your performance across all completed tests
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="space-y-2 mb-4 md:mb-0">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results?.length > 0 ? (
          <div className="space-y-6">
            {results.map((result: Result) => (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-primary" />
                        {result.test.title}
                      </CardTitle>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                        result.isPassed 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {result.isPassed ? (
                          <><Check className="h-4 w-4" /> Passed</>
                        ) : (
                          <><X className="h-4 w-4" /> Failed</>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 md:mb-0">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-4 w-4 text-gray-500" />
                          <div className="text-sm">
                            <p className="text-gray-500">Score</p>
                            <p className="font-medium">{result.score}/{result.test.totalPoints} ({result.percentage}%)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div className="text-sm">
                            <p className="text-gray-500">Time Taken</p>
                            <p className="font-medium">{Math.floor(result.duration / 60)}m {result.duration % 60}s</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4 text-gray-500" />
                          <div className="text-sm">
                            <p className="text-gray-500">Subject</p>
                            <p className="font-medium">{result.test.subject}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          variant="outline"
                          onClick={() => handleViewDetails(result._id)}
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleRetakeTest(result.test._id)}
                        >
                          Retake Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileCheck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold">No results yet</h3>
            <p className="text-gray-500 mt-2 mb-6">
              You haven't completed any tests. Take a test to see your results here.
            </p>
            <Button onClick={() => navigate("/tests")}>Browse Tests</Button>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Results;
