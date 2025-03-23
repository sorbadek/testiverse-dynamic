
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Shield, Lock, Check } from "lucide-react";

const Privacy = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg mb-8 flex items-center gap-4">
          <Shield className="h-12 w-12 text-primary flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Privacy Matters</h2>
            <p className="text-gray-600">
              At TestWiz, we take your privacy seriously. This policy outlines what information we collect, how we use it, and the choices you have regarding your data.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Information We Collect
            </h2>
            <p className="mb-4 text-gray-600">
              We collect several types of information for various purposes to provide and improve our service to you.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Account information (name, email, password)</li>
              <li>Profile information (educational background, preferences)</li>
              <li>Test data (responses, scores, completion times)</li>
              <li>Usage data (features used, time spent, device information)</li>
              <li>Communications (support requests, feedback)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              How We Use Your Information
            </h2>
            <p className="mb-4 text-gray-600">
              We use the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              Your Data Rights
            </h2>
            <p className="mb-4 text-gray-600">
              You have certain rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Access and update your information</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at privacy@testwiz.com
            </p>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Privacy;
