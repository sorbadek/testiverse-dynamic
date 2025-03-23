
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import TestManagement from "@/components/admin/TestManagement";
import UserManagement from "@/components/admin/UserManagement";
import AdminOverview from "@/components/admin/AdminOverview";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Check if user is logged in and has admin role
    if (!user) {
      navigate("/login", { state: { redirectTo: "/admin" } });
      return;
    }

    if (user.role !== "admin") {
      toast.error("You don't have permission to access the admin dashboard");
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage tests, users, and monitor system performance
            </p>
          </div>
          <Button onClick={() => navigate("/admin/tests/new")}>
            Create New Test
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <TestManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard;
