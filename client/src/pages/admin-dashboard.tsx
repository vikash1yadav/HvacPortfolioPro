import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import ContentManagement from "@/components/admin/content-management";
import PortfolioManagement from "@/components/admin/portfolio-management";
import BlogManagement from "@/components/admin/blog-management";
import TeamManagement from "@/components/admin/team-management";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated: isAdminAuthenticated, isLoading: adminLoading, adminUser } = useAdminAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!adminLoading && !isAdminAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to access the admin dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 500);
      return;
    }
  }, [isAdminAuthenticated, adminLoading, toast]);

  // Dashboard statistics
  const { data: portfolioProjects } = useQuery({
    queryKey: ["/api/admin/portfolio"],
    retry: false,
  });

  const { data: blogPosts } = useQuery({
    queryKey: ["/api/admin/blog/posts"],
    retry: false,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["/api/admin/team"],
    retry: false,
  });

  const { data: contactSubmissions } = useQuery({
    queryKey: ["/api/admin/contact-submissions"],
    retry: false,
  });

  if (adminLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdminAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-brand-gray text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-brand-gray">
                  View Site
                </Button>
              </Link>
              <a href="/api/logout">
                <Button className="bg-red-600 hover:bg-red-700">
                  Logout
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <i className="fas fa-briefcase text-brand-blue text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-semibold text-foreground">{Array.isArray(portfolioProjects) ? portfolioProjects.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <i className="fas fa-blog text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
                  <p className="text-2xl font-semibold text-foreground">{Array.isArray(blogPosts) ? blogPosts.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <i className="fas fa-users text-brand-orange text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-semibold text-gray-900">{Array.isArray(teamMembers) ? teamMembers.length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <i className="fas fa-envelope text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inquiries</p>
                  <p className="text-2xl font-semibold text-gray-900">{Array.isArray(contactSubmissions) ? contactSubmissions.filter((s: any) => !s.isRead).length : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Card>
          <Tabs defaultValue="content" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content Management</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="content">
                <ContentManagement />
              </TabsContent>
              <TabsContent value="portfolio">
                <PortfolioManagement />
              </TabsContent>
              <TabsContent value="blog">
                <BlogManagement />
              </TabsContent>
              <TabsContent value="team">
                <TeamManagement />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
