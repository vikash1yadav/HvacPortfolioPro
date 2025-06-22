import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { apiRequest } from "@/lib/queryClient";
import { insertBlogPostSchema, insertBlogCategorySchema, insertBlogTagSchema } from "@shared/schema";
import type { BlogPost, BlogCategory, BlogTag, InsertBlogPost, InsertBlogCategory, InsertBlogTag } from "@shared/schema";

export default function BlogManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog/posts"],
    retry: false,
  });

  const { data: categories } = useQuery<BlogCategory[]>({
    queryKey: ["/api/blog/categories"],
    retry: false,
  });

  const { data: tags } = useQuery<BlogTag[]>({
    queryKey: ["/api/blog/tags"],
    retry: false,
  });

  const postForm = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      isPublished: false,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      authorId: "",
      categoryId: undefined,
    },
  });

  const categoryForm = useForm<InsertBlogCategory>({
    resolver: zodResolver(insertBlogCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const tagForm = useForm<InsertBlogTag>({
    resolver: zodResolver(insertBlogTagSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      await apiRequest("POST", "/api/admin/blog/posts", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      setIsPostDialogOpen(false);
      postForm.reset();
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
        description: "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBlogPost> }) => {
      await apiRequest("PUT", `/api/admin/blog/posts/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      setIsPostDialogOpen(false);
      setEditingPost(null);
      postForm.reset();
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
        description: "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/blog/posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
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
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertBlogCategory) => {
      await apiRequest("POST", "/api/admin/blog/categories", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/categories"] });
      setIsCategoryDialogOpen(false);
      categoryForm.reset();
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
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const createTagMutation = useMutation({
    mutationFn: async (data: InsertBlogTag) => {
      await apiRequest("POST", "/api/admin/blog/tags", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/tags"] });
      setIsTagDialogOpen(false);
      tagForm.reset();
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
        description: "Failed to create tag",
        variant: "destructive",
      });
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const onPostSubmit = (data: InsertBlogPost) => {
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data });
    } else {
      createPostMutation.mutate(data);
    }
  };

  const onCategorySubmit = (data: InsertBlogCategory) => {
    createCategoryMutation.mutate(data);
  };

  const onTagSubmit = (data: InsertBlogTag) => {
    createTagMutation.mutate(data);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    postForm.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      imageUrl: post.imageUrl || "",
      isPublished: post.isPublished || false,
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      metaKeywords: post.metaKeywords || "",
      authorId: post.authorId || "",
      categoryId: post.categoryId || undefined,
    });
    setIsPostDialogOpen(true);
  };

  const handleDeletePost = (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      deletePostMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Blog Posts</h3>
            <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-brand-blue hover:bg-blue-700"
                  onClick={() => {
                    setEditingPost(null);
                    postForm.reset();
                  }}
                >
                  <i className="fas fa-plus mr-2"></i>New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...postForm}>
                  <form onSubmit={postForm.handleSubmit(onPostSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={postForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter post title..."
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (!editingPost) {
                                    postForm.setValue("slug", generateSlug(e.target.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={postForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="post-url-slug" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={postForm.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3} 
                              {...field} 
                              placeholder="Brief description of the post..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={postForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder="Write your blog post content here..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={postForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter image URL..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={postForm.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="SEO optimized title..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={postForm.control}
                        name="metaKeywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Keywords</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="keyword1, keyword2, keyword3" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={postForm.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SEO Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={2} 
                              {...field} 
                              placeholder="SEO meta description..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={postForm.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Published</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Make this post visible on the website
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsPostDialogOpen(false);
                          setEditingPost(null);
                          postForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-brand-blue hover:bg-blue-700"
                        disabled={createPostMutation.isPending || updatePostMutation.isPending}
                      >
                        {createPostMutation.isPending || updatePostMutation.isPending
                          ? "Saving..." 
                          : editingPost ? "Update" : "Create"
                        }
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Posts List */}
          {postsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{post.title}</h4>
                            {post.isPublished ? (
                              <Badge className="bg-green-100 text-green-800">Published</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{post.excerpt}</p>
                          <p className="text-sm text-gray-500">
                            Published on {formatDate(post.publishedAt || post.createdAt)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <i className="fas fa-blog text-4xl text-gray-300 mb-4"></i>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h4>
                    <p className="text-gray-600">Start by creating your first blog post.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Categories</h3>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-blue hover:bg-blue-700">
                  <i className="fas fa-plus mr-2"></i>Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                </DialogHeader>
                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4">
                    <FormField
                      control={categoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter category name..."
                              onChange={(e) => {
                                field.onChange(e);
                                categoryForm.setValue("slug", generateSlug(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={categoryForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="category-slug" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={categoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3} 
                              {...field} 
                              placeholder="Category description..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCategoryDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-brand-blue hover:bg-blue-700"
                        disabled={createCategoryMutation.isPending}
                      >
                        {createCategoryMutation.isPending ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Slug: {category.slug}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <i className="fas fa-folder text-4xl text-gray-300 mb-4"></i>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h4>
                <p className="text-gray-600">Create categories to organize your blog posts.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tags" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tags</h3>
            <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-blue hover:bg-blue-700">
                  <i className="fas fa-plus mr-2"></i>Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Tag</DialogTitle>
                </DialogHeader>
                <Form {...tagForm}>
                  <form onSubmit={tagForm.handleSubmit(onTagSubmit)} className="space-y-4">
                    <FormField
                      control={tagForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tag Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter tag name..."
                              onChange={(e) => {
                                field.onChange(e);
                                tagForm.setValue("slug", generateSlug(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={tagForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="tag-slug" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsTagDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-brand-blue hover:bg-blue-700"
                        disabled={createTagMutation.isPending}
                      >
                        {createTagMutation.isPending ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags && tags.length > 0 ? (
              tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="px-3 py-1">
                  {tag.name}
                </Badge>
              ))
            ) : (
              <div className="w-full text-center py-12">
                <i className="fas fa-tags text-4xl text-gray-300 mb-4"></i>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No tags yet</h4>
                <p className="text-gray-600">Create tags to label your blog posts.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
