import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Moon, Sun } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePage = (path: string) => {
    return location === path || (path === '/blog' && location.startsWith('/blog/'));
  };

  return (
    <header className="relative z-10 bg-card/90 backdrop-blur-sm border-b border-border shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <span className="text-accent text-2xl">💍</span>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-primary elvish-shadow">
              Welcome to The Shire
            </h1>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" data-testid="link-nav-home">
              <span className={`font-cinzel font-medium transition-colors duration-200 border-b-2 pb-1 ${
                isActivePage('/') 
                  ? 'text-accent border-accent' 
                  : 'text-primary hover:text-accent border-transparent hover:border-accent'
              }`}>
                🏠 Home
              </span>
            </Link>
            <Link href="/blog" data-testid="link-nav-blog">
              <span className={`font-cinzel font-medium transition-colors duration-200 border-b-2 pb-1 ${
                isActivePage('/blog') 
                  ? 'text-accent border-accent' 
                  : 'text-primary hover:text-accent border-transparent hover:border-accent'
              }`}>
                📜 Blog
              </span>
            </Link>
            <Link href="/about" data-testid="link-nav-about">
              <span className={`font-cinzel font-medium transition-colors duration-200 border-b-2 pb-1 ${
                isActivePage('/about') 
                  ? 'text-accent border-accent' 
                  : 'text-primary hover:text-accent border-transparent hover:border-accent'
              }`}>
                🍃 About Hobbits
              </span>
            </Link>
            <Link href="/contact" data-testid="link-nav-contact">
              <span className={`font-cinzel font-medium transition-colors duration-200 border-b-2 pb-1 ${
                isActivePage('/contact') 
                  ? 'text-accent border-accent' 
                  : 'text-primary hover:text-accent border-transparent hover:border-accent'
              }`}>
                ✉️ Contact
              </span>
            </Link>
            {!isLoading && isAuthenticated && (
              <Link href="/admin" data-testid="link-nav-admin">
                <span className={`font-cinzel font-medium transition-colors duration-200 border-b-2 pb-1 ${
                  isActivePage('/admin') 
                    ? 'text-accent border-accent' 
                    : 'text-primary hover:text-accent border-transparent hover:border-accent'
                }`}>
                  👑 Admin
                </span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full bg-secondary/20 hover:bg-secondary/30 transition-colors"
              data-testid="button-theme-toggle"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5 text-accent" />}
            </Button>
            
            {!isLoading && !isAuthenticated && (
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-login"
              >
                Login
              </Button>
            )}
            
            {!isLoading && isAuthenticated && (
              <Button 
                onClick={() => window.location.href = "/api/logout"}
                variant="outline"
                className="hidden md:inline-flex border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                data-testid="button-logout"
              >
                Logout
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} data-testid="link-mobile-home">
                <span className="font-cinzel font-medium text-primary hover:text-accent transition-colors">
                  🏠 Home
                </span>
              </Link>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} data-testid="link-mobile-blog">
                <span className="font-cinzel font-medium text-primary hover:text-accent transition-colors">
                  📜 Blog
                </span>
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} data-testid="link-mobile-about">
                <span className="font-cinzel font-medium text-primary hover:text-accent transition-colors">
                  🍃 About Hobbits
                </span>
              </Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} data-testid="link-mobile-contact">
                <span className="font-cinzel font-medium text-primary hover:text-accent transition-colors">
                  ✉️ Contact
                </span>
              </Link>
              {!isLoading && isAuthenticated && (
                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} data-testid="link-mobile-admin">
                  <span className="font-cinzel font-medium text-primary hover:text-accent transition-colors">
                    👑 Admin
                  </span>
                </Link>
              )}
              {!isLoading && !isAuthenticated && (
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full justify-start"
                  data-testid="button-mobile-login"
                >
                  Login
                </Button>
              )}
              {!isLoading && isAuthenticated && (
                <Button 
                  onClick={() => window.location.href = "/api/logout"}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full justify-start"
                  data-testid="button-mobile-logout"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
