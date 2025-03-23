
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { 
  Check, X, Clock, Trophy, BarChart, Book, AlertTriangle, ArrowLeft, 
  CheckCircle2, XCircle, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { resultAPI, handleApiError } from "@/lib/api";
import { useAuthContext } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from 'react';

const ResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['result', id],
    queryFn: () => id ? resultAPI.getResult(id).then(res => res.data.result) : null,
  });

  useEffect(() => {
    if (error) {
      handleApiError(error, "Failed to load result");
    }
  }, [error]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 mb-8" />
      </div>
    </MainLayout>
  );

  if (!data) return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Result Not Found</h1>
        <p className="mb-6">The result you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => navigate('/results')}>View My Results</Button>
      </div>
    </MainLayout>
  );
  
  const result = data;
  const test = result.test;
  
  // Format time taken
  const formatTimeTaken = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 1) return `${secs} seconds`;
    return `${mins} min${mins > 1 ? 's' : ''} ${secs} sec${secs > 1 ? 's' : ''}`;
  };
  
  // Determine result color based on score percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Get grade based on score percentage
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };
  
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => navigate('/results')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Results
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Test Result: {test.title}</h1>
          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <Book className="h-4 w-4" /> {test.subject}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" /> Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-1 flex items-end gap-2">
                <span className={getScoreColor(result.scorePercentage)}>
                  {result.score}
                </span>
                <span className="text-gray-400 text-xl">/ {result.totalPossible}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-lg ${getScoreColor(result.scorePercentage)}`}>
                  {result.scorePercentage.toFixed(1)}%
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(result.scorePercentage)}`}>
                  Grade: {getGrade(result.scorePercentage)}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" /> Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Correct: {result.score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span>Incorrect: {result.totalPossible - result.score}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium">
                <div className="mb-1">
                  <span>Time Taken: {formatTimeTaken(result.timeTaken)}</span>
                </div>
                <div>
                  <span>Time Limit: {test.timeLimit} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Question Analysis</h2>
        
        <div className="space-y-6 mb-8">
          {test.questions.map((question, index) => {
            const userAnswer = result.answers.find(a => a.question === question._id);
            const isCorrect = userAnswer && userAnswer.selectedOption === question.correctAnswer;
            const selectedOption = question.options.find(opt => opt.value === userAnswer?.selectedOption);
            const correctOption = question.options.find(opt => opt.value === question.correctAnswer);
            
            return (
              <Card key={question._id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Question {index + 1}
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </CardTitle>
                    <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {isCorrect ? '+1' : '0'} point
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-lg">{question.text}</p>
                  
                  <div className="space-y-2">
                    {question.options.map(option => (
                      <div 
                        key={option.value}
                        className={`p-3 rounded-md flex items-center gap-3 ${
                          option.value === question.correctAnswer
                            ? 'bg-green-50 border border-green-200'
                            : option.value === userAnswer?.selectedOption && !isCorrect
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {option.value === question.correctAnswer ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : option.value === userAnswer?.selectedOption && !isCorrect ? (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        ) : (
                          <HelpCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span>{option.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  {question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                      <p className="font-medium mb-1">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/results')}>
            Back to Results
          </Button>
          <Button onClick={() => navigate('/tests')}>
            Take Another Test
          </Button>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ResultPage;
