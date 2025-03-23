
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { FileText, AlertCircle, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-8 flex items-center gap-4">
          <AlertCircle className="h-10 w-10 text-amber-500 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Please Read Carefully</h2>
            <p className="text-gray-700">
              By accessing or using TestWiz, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              1. Agreement to Terms
            </h2>
            <p className="text-gray-600">
              By accessing or using our platform, you agree to be legally bound by these Terms. If you do not agree to these Terms, please do not use our service.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              2. Description of Service
            </h2>
            <p className="mb-4 text-gray-600">
              TestWiz provides a computer-based testing platform for educational institutions, organizations, and individuals. Features include test creation, administration, grading, and analysis.
            </p>
            <p className="text-gray-600">
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time, including the availability of any feature, database, or content.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              3. User Accounts
            </h2>
            <p className="mb-4 text-gray-600">
              To access certain features, you must register for an account. You agree to provide accurate information and to keep your account information updated.
            </p>
            <p className="text-gray-600">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              4. Content Ownership
            </h2>
            <p className="text-gray-600">
              Users retain ownership of any content they create on the platform. By uploading content, you grant TestWiz a non-exclusive, worldwide, royalty-free license to use, reproduce, and display the content solely for the purpose of providing the service.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              5. Prohibited Activities
            </h2>
            <p className="mb-4 text-gray-600">
              When using TestWiz, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Upload harmful or malicious content or code</li>
              <li>Attempt to gain unauthorized access to other accounts or systems</li>
              <li>Use the service for cheating or academic dishonesty</li>
              <li>Engage in any activity that interferes with the proper functioning of the service</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Questions?
            </h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at legal@testwiz.com
            </p>
          </section>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Terms;
