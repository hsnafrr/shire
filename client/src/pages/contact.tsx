import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. We'll respond soon from the Shire.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Header />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Contact Header */}
            <div className="text-center mb-12">
              <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-primary mb-6 elvish-shadow">
                Send Us a Message
              </h2>
              <p className="text-xl text-muted-foreground">
                Have a tale to share or a question about life in the Shire?
              </p>
            </div>

            {/* Contact Form */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 parchment-border hover-glow">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-cinzel font-semibold text-primary">Your Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder="e.g., Peregrin Took"
                            className="bg-background border-border"
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-cinzel font-semibold text-primary">Your Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="email"
                            placeholder="pippin@shire.me"
                            className="bg-background border-border"
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subject Field */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-cinzel font-semibold text-primary">Subject</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-background border-border" data-testid="select-subject">
                              <SelectValue placeholder="Choose a topic..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="story">Share a Story</SelectItem>
                              <SelectItem value="question">Ask a Question</SelectItem>
                              <SelectItem value="collaboration">Collaboration Inquiry</SelectItem>
                              <SelectItem value="feedback">Website Feedback</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-cinzel font-semibold text-primary">Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            rows={6}
                            placeholder="Share your thoughts, stories, or questions here..."
                            className="bg-background border-border resize-none"
                            data-testid="textarea-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Wax Seal Submit Button */}
                  <div className="text-center pt-4">
                    <Button 
                      type="submit"
                      disabled={mutation.isPending}
                      className="relative wax-seal w-20 h-20 hover-glow transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-accent to-secondary text-secondary border-0"
                      data-testid="button-submit-wax-seal"
                    >
                      <span className="text-2xl">⚜</span>
                    </Button>
                    <p className="text-sm text-muted-foreground mt-3 font-cinzel">
                      {mutation.isPending ? "Sending..." : "Press the wax seal to send your message"}
                    </p>
                  </div>
                </form>
              </Form>
            </div>

            {/* Contact Information */}
            <div className="mt-12 text-center">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 parchment-border">
                <h3 className="font-cinzel text-xl font-semibold text-primary mb-4">Other Ways to Reach Us</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p className="flex items-center justify-center" data-testid="text-address">
                    <span className="mr-3 text-accent">📍</span>
                    <span>Bag End, Hobbiton, The Shire</span>
                  </p>
                  <p className="flex items-center justify-center" data-testid="text-email">
                    <span className="mr-3 text-accent">✉️</span>
                    <span>tales@shire.me</span>
                  </p>
                  <p className="flex items-center justify-center" data-testid="text-response-time">
                    <span className="mr-3 text-accent">⏰</span>
                    <span>We typically respond within 2-3 business days</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
