import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { BlogPost } from "@shared/schema";

export default function Home() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog-posts?published=true");
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-cinzel text-4xl md:text-6xl font-bold text-primary elvish-shadow leading-tight">
                  Adventures from<br/>
                  <span className="text-accent">Middle-earth</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Step into a world of wonder where tales of courage, friendship, and unexpected journeys await. 
                  Discover stories that echo through the ages, from the Shire to the farthest reaches of Middle-earth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/blog">
                    <Button 
                      className="px-8 py-4 bg-primary text-primary-foreground font-cinzel font-semibold hover-glow transition-all duration-300 transform hover:scale-105"
                      data-testid="button-read-tales"
                    >
                      📖 Read Our Tales
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button 
                      variant="outline"
                      className="px-8 py-4 border-2 border-primary text-primary font-cinzel font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      data-testid="button-learn-hobbits"
                    >
                      Learn About Hobbits
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:order-first">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Hobbiton landscape with round doors" 
                  className="rounded-2xl shadow-2xl w-full h-auto parchment-border hover-glow" 
                  data-testid="img-hero-hobbiton"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 parchment-border hover-glow">
              <div className="text-center mb-8">
                <span className="text-accent text-4xl mb-4 block">🪶</span>
                <h3 className="font-cinzel text-3xl md:text-4xl font-bold text-primary mb-4">Chronicles of the Shire</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
              </div>
              
              <div className="prose prose-lg max-w-none text-foreground">
                <p className="text-center text-lg leading-relaxed mb-6">
                  Welcome, dear friend, to our collection of tales and musings from the peaceful lands of the Shire. 
                  Here you'll find stories of courage in small packages, the wisdom found in simple pleasures, 
                  and adventures that prove even the smallest person can make the greatest difference.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl">📜</span>
                    </div>
                    <h4 className="font-cinzel text-xl font-semibold text-primary mb-2">Epic Tales</h4>
                    <p className="text-muted-foreground">Stories of adventure and heroism from across Middle-earth</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl">🍃</span>
                    </div>
                    <h4 className="font-cinzel text-xl font-semibold text-primary mb-2">Shire Wisdom</h4>
                    <p className="text-muted-foreground">Life lessons from the simple folk of the Shire</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl">🏔️</span>
                    </div>
                    <h4 className="font-cinzel text-xl font-semibold text-primary mb-2">Journey Logs</h4>
                    <p className="text-muted-foreground">Travel accounts and discoveries from distant lands</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="font-cinzel text-3xl md:text-4xl font-bold text-primary mb-4">Recent Chronicles</h3>
            <p className="text-lg text-muted-foreground">The latest tales from our scribes</p>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card/80 backdrop-blur-sm parchment-border animate-pulse" data-testid={`skeleton-post-${i}`}>
                  <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-3"></div>
                    <div className="h-6 bg-muted rounded mb-3"></div>
                    <div className="h-16 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No tales have been published yet.</p>
              <p className="text-muted-foreground">Check back soon for new adventures!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {recentPosts.map((post) => (
                <Card key={post.id} className="bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden parchment-border hover-glow transition-all duration-300 transform hover:scale-105" data-testid={`card-post-${post.id}`}>
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
                    </div>
                    <h4 className="font-cinzel text-xl font-semibold text-primary mb-3" data-testid={`text-title-${post.id}`}>
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4" data-testid={`text-excerpt-${post.id}`}>
                        {post.excerpt}
                      </p>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <Button 
                        variant="link" 
                        className="p-0 text-accent hover:text-primary font-semibold"
                        data-testid={`button-read-more-${post.id}`}
                      >
                        Read More →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button 
                className="px-8 py-4 bg-secondary text-secondary-foreground font-cinzel font-semibold hover-glow transition-all duration-300 transform hover:scale-105"
                data-testid="button-view-all-chronicles"
              >
                📚 View All Chronicles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
