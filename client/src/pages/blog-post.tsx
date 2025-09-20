import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BlogPost } from "@shared/schema";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

interface BlogPostPageProps {
  slug: string;
}

export default function BlogPostPage({ slug }: BlogPostPageProps) {
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog-posts/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Post not found");
        }
        throw new Error("Failed to fetch post");
      }
      return response.json();
    },
  });

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="font-cinzel text-3xl font-bold text-primary mb-4">Chronicle Not Found</h1>
            <p className="text-muted-foreground mb-8">The tale you're looking for doesn't exist or has been removed.</p>
            <Link href="/blog">
              <Button className="bg-primary text-primary-foreground" data-testid="button-back-to-blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chronicles
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <header className="text-center mb-12 animate-pulse">
                <div className="mb-6">
                  <div className="h-6 bg-muted rounded w-32 mx-auto"></div>
                </div>
                <div className="h-12 bg-muted rounded mb-6 mx-auto max-w-2xl"></div>
                <div className="flex items-center justify-center space-x-6 text-muted-foreground mb-8">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
              </header>
              <div className="mb-12">
                <div className="w-full h-64 md:h-96 bg-muted rounded-2xl"></div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 parchment-border">
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </article>
        <Footer />
      </>
    );
  }

  if (!post) return null;

  return (
    <>
      <Header />
      
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Post Header */}
            <header className="text-center mb-12">
              <div className="mb-6">
                <Link href="/blog">
                  <Button 
                    variant="ghost" 
                    className="inline-flex items-center text-accent hover:text-primary transition-colors"
                    data-testid="button-back-to-chronicles"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Chronicles
                  </Button>
                </Link>
              </div>
              
              <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-primary mb-6 elvish-shadow" data-testid="text-post-title">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-center space-x-6 text-muted-foreground mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span data-testid="text-post-author">Author</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span data-testid="text-post-date">
                    {new Date(post.createdAt!).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>12 min read</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-12">
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  className="w-full h-64 md:h-96 object-cover rounded-2xl parchment-border shadow-2xl"
                  data-testid="img-post-featured"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 parchment-border">
              <div className="prose prose-lg max-w-none text-foreground">
                {post.excerpt && (
                  <p className="text-xl leading-relaxed mb-6 text-muted-foreground font-medium" data-testid="text-post-excerpt">
                    {post.excerpt}
                  </p>
                )}
                
                <div 
                  className="whitespace-pre-wrap leading-relaxed"
                  data-testid="text-post-content"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.replace(/\n/g, '<br/>') 
                  }}
                />
              </div>
              
              {/* Post Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-muted-foreground hover:text-accent transition-colors" data-testid="button-like-post">
                      ❤️ <span className="ml-1">Like</span>
                    </button>
                    <button className="flex items-center text-muted-foreground hover:text-accent transition-colors" data-testid="button-share-post">
                      📤 <span className="ml-1">Share</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Tags:</span>
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm"
                        data-testid={`tag-${tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
