import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { insertCompanyContentSchema } from "@shared/schema";
import type { CompanyContent, InsertCompanyContent } from "@shared/schema";

export default function ContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState("hero");

  const { data: companyContent, isLoading } = useQuery<CompanyContent[]>({
    queryKey: ["/api/company-content"],
    retry: false,
  });

  const currentContent = companyContent?.find(content => content.section === activeSection);

  const form = useForm<InsertCompanyContent>({
    resolver: zodResolver(insertCompanyContentSchema),
    defaultValues: {
      section: activeSection,
      title: "",
      description: "",
      content: "",
    },
  });

  // Update form when content changes
  React.useEffect(() => {
    if (currentContent) {
      form.reset({
        section: currentContent.section,
        title: currentContent.title || "",
        description: currentContent.description || "",
        content: currentContent.content || "",
      });
    } else {
      form.reset({
        section: activeSection,
        title: "",
        description: "",
        content: "",
      });
    }
  }, [currentContent, activeSection, form]);

  const updateContentMutation = useMutation({
    mutationFn: async (data: InsertCompanyContent) => {
      await apiRequest("PUT", "/api/admin/company-content", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/company-content"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCompanyContent) => {
    updateContentMutation.mutate(data);
  };

  const sections = [
    { id: "hero", name: "Hero Section", icon: "fas fa-home" },
    { id: "about", name: "About Us", icon: "fas fa-info-circle" },
    { id: "contact", name: "Contact Info", icon: "fas fa-phone" },
    { id: "services", name: "Services Intro", icon: "fas fa-cogs" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Content Management</h3>
      </div>

      {/* Section Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            onClick={() => setActiveSection(section.id)}
            className="h-auto p-4 flex flex-col items-center space-y-2"
          >
            <i className={`${section.icon} text-lg`}></i>
            <span className="text-sm">{section.name}</span>
          </Button>
        ))}
      </div>

      {/* Content Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className={sections.find(s => s.id === activeSection)?.icon}></i>
            <span>Edit {sections.find(s => s.id === activeSection)?.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter title..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4} 
                            {...field} 
                            placeholder="Enter description..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={8} 
                            {...field} 
                            placeholder="Enter additional content..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="bg-brand-blue hover:bg-blue-700"
                disabled={updateContentMutation.isPending}
              >
                {updateContentMutation.isPending ? "Updating..." : "Update Content"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Quick Contact Info Update */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Input defaultValue="(555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input defaultValue="info@arcticsolutions.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
              <Input defaultValue="123 Industrial Blvd, Tech City, TC 12345" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
