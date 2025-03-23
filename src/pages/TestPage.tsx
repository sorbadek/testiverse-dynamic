
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { testAPI, resultAPI, handleApiError } from "@/lib/api";
import { useAuthContext } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const TestPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch test details
  const { data: testData, isLoading, error } = useQuery({
    queryKey: ['test', id],
    queryFn: () => id ? testAPI.getTest(id).then(res => res.data.test) : null,
  });

  useEffect(() => {
    if (error) {
      handleApiError(error, "Failed to load test");
    }
  }, [error]);

  // Set up timer when test loads
  useEffect(() => {
    if (testData && testData.timeLimit) {
      setTimeLeft(testData.timeLimit * 60); // Convert minutes to seconds
    }
  }, [testData]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;
    
    if (timeLeft <= 0) {
      submitTest();
      return;
    }
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const submitMutation = useMutation({
    mutationFn: (data: any) => resultAPI.submitTest(data),
    onSuccess: (response) => {
      const resultId = response.data.result._id;
      toast({
        title: "Test Submitted",
        description: "Your test has been submitted successfully!",
      });
      navigate(`/result/${resultId}`);
    },
    onError: (error) => {
      setIsSubmitting(false);
      handleApiError(error, "Failed to submit test");
    }
  });

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < (testData?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = () => {
    if (!testData || !user) return;
    
    setIsSubmitting(true);
    
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000); // in seconds
    
    const answers = Object.entries(selectedAnswers).map(([question, selectedOption]) => ({
      question,
      selectedOption,
    }));
    
    submitMutation.mutate({
      test: testData._id,
      answers,
      timeTaken,
    });
  };

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login', { state: { redirectTo: `/test/${id}` } });
    }
  }, [user, isLoading, navigate, id]);

  if (isLoading) return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-full mb-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );

  if (!testData) return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Test Not Found</h1>
        <p className="mb-6">The test you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/tests')}>Browse Tests</Button>
      </div>
    </MainLayout>
  );

  const currentQuestion = testData.questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / testData.questions.length) * 100;
  const allQuestionsAnswered = testData.questions.every(q => selectedAnswers[q._id]);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{testData.title}</h1>
          <p className="text-gray-600 mb-4">{testData.subject}</p>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className={`font-mono text-lg ${timeLeft && timeLeft < 60 ? 'text-red-500 animate-pulse' : ''}`}>
                {timeLeft !== null ? formatTime(timeLeft) : 'No time limit'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {testData.questions.length}
              </span>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestion._id] || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestion._id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={goToPreviousQuestion} 
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < testData.questions.length - 1 ? (
            <Button onClick={goToNextQuestion}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={submitTest} 
              disabled={isSubmitting || !allQuestionsAnswered}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
          {testData.questions.map((q, idx) => (
            <Button
              key={q._id}
              variant={idx === currentQuestionIndex ? "default" : selectedAnswers[q._id] ? "outline" : "ghost"}
              className={`h-10 w-10 ${selectedAnswers[q._id] ? 'border-green-500 border-2' : ''}`}
              onClick={() => setCurrentQuestionIndex(idx)}
            >
              {idx + 1}
              {selectedAnswers[q._id] && (
                <CheckCircle className="h-3 w-3 absolute top-1 right-1 text-green-500" />
              )}
            </Button>
          ))}
        </div>
        
        {!allQuestionsAnswered && currentQuestionIndex === testData.questions.length - 1 && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">
              You haven't answered all questions. Please go back and complete them before submitting.
            </p>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default TestPage;
