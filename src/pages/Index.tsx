
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuthContext } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuthContext();

  return (
    <MainLayout>
      <section className="min-h-[calc(100vh-16rem)] flex flex-col justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                >
                  Revolutionize Your Testing Experience
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                >
                  Create, take, and analyze tests with our intuitive platform.
                  Perfect for educators and students alike.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Button asChild size="lg" className="focus-ring">
                  <Link to={user ? "/tests" : "/register"}>
                    {user ? "Browse Tests" : "Get Started"}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="focus-ring"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <div className="relative h-[350px] w-full lg:h-[400px] xl:h-[500px]">
                <HeroImage />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-xs">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything You Need for Testing
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform provides a comprehensive suite of tools for creating,
                taking, and analyzing tests.
              </p>
            </motion.div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Intuitive Test Creation"
              description="Create tests with multiple question types, time limits, and customizable settings."
              delay={0.1}
            />
            <FeatureCard
              title="Secure Test Taking"
              description="Take tests in a secure environment with anti-cheating features."
              delay={0.2}
            />
            <FeatureCard
              title="Detailed Analytics"
              description="Analyze test results with detailed reports and insights."
              delay={0.3}
            />
            <FeatureCard
              title="Cross-Platform"
              description="Access your tests on any device, including web, iOS, and Android."
              delay={0.4}
            />
            <FeatureCard
              title="Instant Feedback"
              description="Get instant feedback on your test performance with detailed explanations."
              delay={0.5}
            />
            <FeatureCard
              title="Collaboration"
              description="Share tests with colleagues and students for collaborative learning."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Get Started
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Transform Your Testing?
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Join thousands of educators and students who are already using our platform.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg" className="focus-ring">
                <Link to={user ? "/tests" : "/register"}>
                  {user ? "Browse Tests" : "Sign Up Now"}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

const FeatureCard = ({ title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center space-y-2 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft card-hover border border-gray-100 dark:border-gray-700"
    >
      <div className="p-3 rounded-full bg-primary/10 text-primary">
        <div className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-center text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </motion.div>
  );
};

const HeroImage = () => {
  return (
    <div className="relative w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-blue-500/20 to-teal-500/20 rounded-full blur-3xl"
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="w-[90%] h-[80%] rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="w-full h-12 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center px-4"
          >
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="mx-auto text-sm text-gray-500 dark:text-gray-400">
              Test Interface
            </div>
          </motion.div>
          <div className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="w-full h-8 bg-gray-200 dark:bg-gray-600 rounded mb-4"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-6"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7 }}
              className="w-full h-10 bg-gray-200 dark:bg-gray-600 rounded mb-4"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="w-full h-10 bg-gray-200 dark:bg-gray-600 rounded mb-4"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.9 }}
              className="w-full h-10 bg-gray-200 dark:bg-gray-600 rounded mb-4"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              className="w-full h-10 bg-gray-200 dark:bg-gray-600 rounded mb-6"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.1 }}
              className="w-1/4 h-10 bg-primary rounded ml-auto"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
