import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BlogPost } from "@shared/schema";
import { Search } from "lucide-react";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog-posts?published=true");
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  const { data: searchResults } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/blog-posts/search/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to search posts");
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const displayPosts = searchQuery.trim() ? (searchResults || []) : (posts || []);
  const totalPages = Math.ceil(displayPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = displayPosts.slice(startIndex, startIndex + postsPerPage);

  const featuredPost = displayPosts[0];
  const regularPosts = displayPosts.slice(1);

  return (
    <>
      <Header />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-primary mb-4 elvish-shadow">
              Chronicles of Middle-earth
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of tales, wisdom, and adventures from across the realms
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search chronicles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-card/80 border-border"
                data-testid="input-search"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Featured Post Skeleton */}
                <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm parchment-border animate-pulse" data-testid="skeleton-featured">
                  <div className="md:flex">
                    <div className="md:w-2/3 h-64 md:h-80 bg-muted"></div>
                    <div className="md:w-1/3 p-8 space-y-4">
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-8 bg-muted rounded"></div>
                      <div className="h-20 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </Card>

                {/* Regular Posts Skeletons */}
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-card/80 backdrop-blur-sm parchment-border animate-pulse" data-testid={`skeleton-post-${i}`}>
                    <div className="w-full h-48 bg-muted"></div>
                    <CardContent className="p-6 space-y-4">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : displayPosts.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery.trim() ? (
                <>
                  <p className="text-lg text-muted-foreground mb-4">No chronicles found for "{searchQuery}"</p>
                  <p className="text-muted-foreground">Try a different search term or browse all chronicles below.</p>
                </>
              ) : (
                <>
                  <p className="text-lg text-muted-foreground mb-4">No tales have been published yet.</p>
                  <p className="text-muted-foreground">Check back soon for new adventures!</p>
                </>
              )}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Featured Post */}
                {featuredPost && !searchQuery.trim() && (
                  <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden parchment-border hover-glow transition-all duration-300" data-testid={`card-featured-${featuredPost.id}`}>
                    <div className="md:flex">
                      <div className="md:w-2/3">
                        {featuredPost.featuredImage && (
                          <img 
                            src={featuredPost.featuredImage} 
                            alt={featuredPost.title} 
                            className="w-full h-64 md:h-full object-cover"
                            data-testid={`img-featured-${featuredPost.id}`}
                          />
                        )}
                      </div>
                      <div className="md:w-1/3 p-8">
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold">Featured</span>
                          <span className="mx-3">•</span>
                          <span data-testid={`text-featured-date-${featuredPost.id}`}>
                            {new Date(featuredPost.createdAt!).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <h3 className="font-cinzel text-2xl font-bold text-primary mb-4" data-testid={`text-featured-title-${featuredPost.id}`}>
                          {featuredPost.title}
                        </h3>
                        {featuredPost.excerpt && (
                          <p className="text-muted-foreground mb-6" data-testid={`text-featured-excerpt-${featuredPost.id}`}>
                            {featuredPost.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                              <span className="text-primary-foreground text-sm">👤</span>
                            </div>
                            <span className="text-sm font-semibold" data-testid={`text-featured-author-${featuredPost.id}`}>
                              Author
                            </span>
                          </div>
                          <Link href={`/blog/${featuredPost.slug}`}>
                            <Button 
                              variant="link" 
                              className="text-accent hover:text-primary font-semibold p-0"
                              data-testid={`button-featured-read-${featuredPost.id}`}
                            >
                              Read Story →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Regular Posts */}
                {(searchQuery.trim() ? paginatedPosts : regularPosts.slice(startIndex, startIndex + postsPerPage - 1)).map((post) => (
                  <Card key={post.id} className="bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden parchment-border hover-glow transition-all duration-300" data-testid={`card-post-${post.id}`}>
                    {post.featuredImage && (
                      <img 
                        src={post.featuredImage} 
                        alt={post.title} 
                        className="w-full h-48 object-cover"
                        data-testid={`img-post-${post.id}`}
                      />
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <span className="mr-2">📅</span>
                        <span data-testid={`text-date-${post.id}`}>
                          {new Date(post.createdAt!).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="mx-2">•</span>
                        <span>5 min read</span>
                      </div>
                      <h3 className="font-cinzel text-xl font-semibold text-primary mb-3" data-testid={`text-title-${post.id}`}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4" data-testid={`text-excerpt-${post.id}`}>
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">By Author</span>
                        <Link href={`/blog/${post.slug}`}>
                          <Button 
                            variant="link" 
                            className="text-accent hover:text-primary font-semibold p-0"
                            data-testid={`button-read-more-${post.id}`}
                          >
                            Read More →
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    data-testid="button-prev-page"
                  >
                    ← Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    data-testid="button-next-page"
                  >
                    Next →
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
