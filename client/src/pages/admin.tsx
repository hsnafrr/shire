import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RichTextEditor from "../components/ui/rich-text-editor";
import { insertBlogPostSchema, type InsertBlogPost, type BlogPost, type ContactMessage } from "@shared/schema";
import { Edit, Trash2, Plus, Users, Eye, Heart, MessageSquare, Crown, Settings, BarChart3 } from "lucide-react";

type AdminSection = "posts" | "create" | "edit" | "settings" | "analytics" | "messages";

export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>("posts");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  // Fetch all blog posts (including drafts for admin)
  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    retry: false,
  });

  // Fetch contact messages
  const { data: messages, isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
    retry: false,
  });

  const form = useForm<InsertBlogPost>({
    resolver: zodResolver(insertBlogPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      authorId: "",
      published: false,
      tags: [],
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      await apiRequest("POST", "/api/blog-posts", data);
    },
    onSuccess: () => {
      toast({
        title: "Chronicle created successfully!",
        description: "Your tale has been saved to the archives.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      form.reset();
      setActiveSection("posts");
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
        title: "Failed to create chronicle",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async (data: { id: string; post: Partial<InsertBlogPost> }) => {
      await apiRequest("PUT", `/api/blog-posts/${data.id}`, data.post);
    },
    onSuccess: () => {
      toast({
        title: "Chronicle updated successfully!",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      setEditingPost(null);
      setActiveSection("posts");
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
        title: "Failed to update chronicle",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Chronicle deleted",
        description: "The tale has been removed from the archives.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
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
        title: "Failed to delete chronicle",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBlogPost) => {
    const tags = data.tags;
    const tagsArray = typeof tags === 'string' 
      ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : (tags as string[]) || [];

    const postData = {
      ...data,
      tags: tagsArray,
    };

    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, post: postData });
    } else {
      createPostMutation.mutate(postData);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      featuredImage: post.featuredImage || "",
      authorId: post.authorId,
      published: post.published || false,
      tags: post.tags || [],
    });
    setActiveSection("edit");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this chronicle? This action cannot be undone.")) {
      deletePostMutation.mutate(id);
    }
  };

  const renderAdminNavigation = () => (
    <div className="mb-8">
      <div className="bg-card/80 backdrop-blur-sm rounded-xl p-2 parchment-border">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setActiveSection("posts")}
            variant={activeSection === "posts" ? "default" : "ghost"}
            className={`px-6 py-3 font-cinzel font-semibold transition-all duration-200 ${
              activeSection === "posts" 
                ? "bg-primary text-primary-foreground" 
                : "text-primary hover:bg-primary/10"
            }`}
            data-testid="button-nav-posts"
          >
            <Edit className="w-4 h-4 mr-2" />
            Manage Posts
          </Button>
          <Button
            onClick={() => {
              setActiveSection("create");
              setEditingPost(null);
              form.reset();
            }}
            variant={activeSection === "create" ? "default" : "ghost"}
            className={`px-6 py-3 font-cinzel font-semibold transition-all duration-200 ${
              activeSection === "create" 
                ? "bg-primary text-primary-foreground" 
                : "text-primary hover:bg-primary/10"
            }`}
            data-testid="button-nav-create"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
          <Button
            onClick={() => setActiveSection("messages")}
            variant={activeSection === "messages" ? "default" : "ghost"}
            className={`px-6 py-3 font-cinzel font-semibold transition-all duration-200 ${
              activeSection === "messages" 
                ? "bg-primary text-primary-foreground" 
                : "text-primary hover:bg-primary/10"
            }`}
            data-testid="button-nav-messages"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
          <Button
            onClick={() => setActiveSection("analytics")}
            variant={activeSection === "analytics" ? "default" : "ghost"}
            className={`px-6 py-3 font-cinzel font-semibold transition-all duration-200 ${
              activeSection === "analytics" 
                ? "bg-primary text-primary-foreground" 
                : "text-primary hover:bg-primary/10"
            }`}
            data-testid="button-nav-analytics"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button
            onClick={() => setActiveSection("settings")}
            variant={activeSection === "settings" ? "default" : "ghost"}
            className={`px-6 py-3 font-cinzel font-semibold transition-all duration-200 ${
              activeSection === "settings" 
                ? "bg-primary text-primary-foreground" 
                : "text-primary hover:bg-primary/10"
            }`}
            data-testid="button-nav-settings"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPostsSection = () => (
    <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-cinzel text-2xl font-bold text-primary">Published Chronicles</CardTitle>
          <Button
            onClick={() => {
              setActiveSection("create");
              setEditingPost(null);
              form.reset();
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-new-post"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {postsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border-b border-border pb-4" data-testid={`skeleton-post-${i}`}>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-cinzel font-semibold text-primary">Title</th>
                  <th className="text-left py-3 font-cinzel font-semibold text-primary">Date</th>
                  <th className="text-left py-3 font-cinzel font-semibold text-primary">Status</th>
                  <th className="text-left py-3 font-cinzel font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id} data-testid={`row-post-${post.id}`}>
                    <td className="py-4" data-testid={`text-post-title-${post.id}`}>{post.title}</td>
                    <td className="py-4 text-muted-foreground" data-testid={`text-post-date-${post.id}`}>
                      {new Date(post.createdAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4">
                      <Badge variant={post.published ? "default" : "secondary"} data-testid={`badge-post-status-${post.id}`}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(post)}
                          className="text-accent hover:text-primary"
                          data-testid={`button-edit-${post.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          className="text-destructive hover:text-destructive/80"
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No chronicles have been written yet.</p>
            <Button
              onClick={() => {
                setActiveSection("create");
                setEditingPost(null);
                form.reset();
              }}
              className="bg-primary text-primary-foreground"
              data-testid="button-create-first-post"
            >
              <Plus className="w-4 h-4 mr-2" />
              Write Your First Chronicle
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCreateEditSection = () => (
    <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow">
      <CardHeader>
        <CardTitle className="font-cinzel text-2xl font-bold text-primary">
          {editingPost ? "Edit Chronicle" : "Create New Chronicle"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Post Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel font-semibold text-primary">Chronicle Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Enter your tale's title..."
                      className="bg-background border-border"
                      data-testid="input-post-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured Image URL */}
            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel font-semibold text-primary">Featured Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      value={field.value || ''}
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="bg-background border-border"
                      data-testid="input-post-image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Excerpt */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel font-semibold text-primary">Excerpt</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      value={field.value || ''}
                      rows={3}
                      placeholder="A brief summary of your tale..."
                      className="bg-background border-border resize-none"
                      data-testid="textarea-post-excerpt"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content Editor */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel font-semibold text-primary">Chronicle Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write your chronicle here..."
                      data-testid="editor-post-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel font-semibold text-primary">Tags</FormLabel>
                  <FormControl>
                    <Input 
                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="adventure, courage, friendship (comma-separated)"
                      className="bg-background border-border"
                      data-testid="input-post-tags"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-cinzel font-semibold text-primary">Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value === "published")} value={field.value ? "published" : "draft"}>
                      <SelectTrigger className="bg-background border-border" data-testid="select-post-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Save as Draft</SelectItem>
                        <SelectItem value="published">Publish Now</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <Button 
                type="submit"
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
                className="bg-primary text-primary-foreground font-cinzel font-semibold hover:bg-primary/90"
                data-testid="button-save-post"
              >
                {createPostMutation.isPending || updatePostMutation.isPending ? (
                  "Saving..."
                ) : editingPost ? (
                  "Update Chronicle"
                ) : (
                  "Save Chronicle"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setActiveSection("posts");
                  setEditingPost(null);
                  form.reset();
                }}
                className="border-border text-foreground font-cinzel font-semibold hover:bg-muted"
                data-testid="button-cancel-post"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderMessagesSection = () => (
    <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow">
      <CardHeader>
        <CardTitle className="font-cinzel text-2xl font-bold text-primary">Contact Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {messagesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border-b border-border pb-4" data-testid={`skeleton-message-${i}`}>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="border border-border rounded-lg p-4 bg-background" data-testid={`card-message-${message.id}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-primary" data-testid={`text-message-name-${message.id}`}>{message.name}</h4>
                  <span className="text-sm text-muted-foreground" data-testid={`text-message-date-${message.id}`}>
                    {new Date(message.createdAt!).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span data-testid={`text-message-email-${message.id}`}>{message.email}</span>
                  <span className="mx-2">•</span>
                  <Badge variant="outline" data-testid={`badge-message-subject-${message.id}`}>{message.subject}</Badge>
                </div>
                <p className="text-foreground" data-testid={`text-message-content-${message.id}`}>{message.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No messages have been received yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAnalyticsSection = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow text-center" data-testid="card-stat-posts">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-cinzel text-2xl font-bold text-primary">{posts?.length || 0}</h4>
            <p className="text-muted-foreground">Total Chronicles</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow text-center" data-testid="card-stat-published">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-cinzel text-2xl font-bold text-primary">
              {posts?.filter(p => p.published).length || 0}
            </h4>
            <p className="text-muted-foreground">Published</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow text-center" data-testid="card-stat-messages">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-cinzel text-2xl font-bold text-primary">{messages?.length || 0}</h4>
            <p className="text-muted-foreground">Messages</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow text-center" data-testid="card-stat-drafts">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-cinzel text-2xl font-bold text-primary">
              {posts?.filter(p => !p.published).length || 0}
            </h4>
            <p className="text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow">
        <CardHeader>
          <CardTitle className="font-cinzel text-2xl font-bold text-primary">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts?.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border" data-testid={`activity-post-${post.id}`}>
                <div>
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {post.published ? "Published" : "Saved as draft"} on {new Date(post.createdAt!).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsSection = () => (
    <Card className="bg-card/80 backdrop-blur-sm parchment-border hover-glow">
      <CardHeader>
        <CardTitle className="font-cinzel text-2xl font-bold text-primary">Portal Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Site Settings */}
          <div>
            <h4 className="font-cinzel text-xl font-semibold text-primary mb-4">Site Configuration</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-foreground mb-2">Site Title</label>
                <Input 
                  defaultValue="Welcome to The Shire" 
                  className="bg-background border-border"
                  data-testid="input-site-title"
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-2">Site Description</label>
                <Input 
                  defaultValue="A Middle-earth Blog" 
                  className="bg-background border-border"
                  data-testid="input-site-description"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <h4 className="font-cinzel text-xl font-semibold text-primary mb-4">Theme Settings</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-foreground mb-2">Default Theme</label>
                <Select defaultValue="light">
                  <SelectTrigger className="bg-background border-border" data-testid="select-default-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Parchment (Light)</SelectItem>
                    <SelectItem value="dark">Night Sky (Dark)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-2">Posts Per Page</label>
                <Input 
                  type="number" 
                  defaultValue="6" 
                  min="1" 
                  max="20"
                  className="bg-background border-border"
                  data-testid="input-posts-per-page"
                />
              </div>
            </div>
          </div>

          {/* Save Settings */}
          <div className="pt-4">
            <Button 
              className="bg-primary text-primary-foreground font-cinzel font-semibold hover:bg-primary/90"
              data-testid="button-save-settings"
            >
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "posts":
        return renderPostsSection();
      case "create":
      case "edit":
        return renderCreateEditSection();
      case "messages":
        return renderMessagesSection();
      case "analytics":
        return renderAnalyticsSection();
      case "settings":
        return renderSettingsSection();
      default:
        return renderPostsSection();
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Header />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Admin Header */}
            <div className="text-center mb-12">
              <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-primary mb-6 elvish-shadow">
                <Crown className="inline-block w-12 h-12 mr-4 mb-2" />
                Scribe's Portal
              </h2>
              <p className="text-xl text-muted-foreground">
                Manage the chronicles of Middle-earth
              </p>
            </div>

            {/* Admin Navigation */}
            {renderAdminNavigation()}

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
