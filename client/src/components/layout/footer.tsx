import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive notifications of new tales from the Shire.",
    });
    setEmail("");
  };

  return (
    <footer className="relative z-10 bg-card/90 backdrop-blur-sm border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-accent text-2xl">💍</span>
              <h3 className="font-cinzel text-xl font-bold text-primary">The Shire</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              A place where tales of courage, friendship, and wonder come to life. 
              Join us on adventures both great and small.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-accent hover:bg-primary/30 transition-colors"
                data-testid="link-social-twitter"
              >
                🐦
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-accent hover:bg-primary/30 transition-colors"
                data-testid="link-social-facebook"
              >
                📘
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-accent hover:bg-primary/30 transition-colors"
                data-testid="link-social-instagram"
              >
                📷
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-accent hover:bg-primary/30 transition-colors"
                data-testid="link-social-discord"
              >
                💬
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-lg font-semibold text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" data-testid="link-footer-home">
                  <span className="text-muted-foreground hover:text-accent transition-colors">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" data-testid="link-footer-blog">
                  <span className="text-muted-foreground hover:text-accent transition-colors">All Chronicles</span>
                </Link>
              </li>
              <li>
                <Link href="/about" data-testid="link-footer-about">
                  <span className="text-muted-foreground hover:text-accent transition-colors">About Hobbits</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-footer-contact">
                  <span className="text-muted-foreground hover:text-accent transition-colors">Contact</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors" data-testid="link-footer-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors" data-testid="link-footer-terms">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-cinzel text-lg font-semibold text-primary mb-4">Chronicle Updates</h4>
            <p className="text-muted-foreground mb-4">
              Subscribe to receive notifications of new tales and adventures.
            </p>
            <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
              <Input 
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border"
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground mb-4 md:mb-0">
              © 2024 Hobbit Blog. All rights reserved in Middle-earth and beyond.
            </p>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span>Made with ❤️ in the Shire</span>
              <span>•</span>
              <span>Powered by ancient elvish magic</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
