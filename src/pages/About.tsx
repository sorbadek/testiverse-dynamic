
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, Award } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About TestWiz</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Revolutionizing online assessment with our comprehensive computer-based testing platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="text-primary h-6 w-6" />
              </div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                To provide accessible, reliable, and secure testing solutions that empower educators and learners alike.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary h-6 w-6" />
              </div>
              <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                A diverse group of educators, developers, and assessment experts committed to educational excellence.
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary h-6 w-6" />
              </div>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Integrity, innovation, accessibility, and continuous improvement guide everything we do.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="mb-4 text-gray-600">
            Founded in 2023, TestWiz emerged from a simple observation: traditional testing methods weren't meeting the needs of modern education. We set out to create a platform that would make assessment more efficient, accessible, and insightful.
          </p>
          <p className="mb-4 text-gray-600">
            Today, TestWiz serves thousands of educators and students worldwide, facilitating millions of assessments annually. Our platform continues to evolve based on user feedback and educational research.
          </p>
          <p className="text-gray-600">
            We're committed to supporting educational achievement through technology that enhances, rather than replaces, the human elements of teaching and learning.
          </p>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default About;
