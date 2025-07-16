import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  SendIcon,
  CheckCircleIcon,
  Building,
  MapPin as MapPinIcon,
  AtSign as AtSignIcon,
  Phone as PhoneIcon
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  requestType: z.string().min(1, { message: 'Please select a request type' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      requestType: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    // In a real app, this would send the data to the server
    console.log('Contact form submitted:', data);
    
    // Show success notification
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
      duration: 5000,
    });
    
    // Show success state
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-primary/10 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            Have questions about Lifetime GPS? We're here to help. Reach out to our team.
          </p>
        </div>
      </div>

      {/* Contact form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-8">
              {!isSubmitted ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <Building className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Contact Form</h2>
                  </div>
                  <p className="text-slate-600 mb-8">
                    Please fill out the form below and we'll get back to you as soon as possible.
                  </p>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="requestType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Request Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a request type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="tech_support">Technical Support</SelectItem>
                                <SelectItem value="customer_service">Customer Service</SelectItem>
                                <SelectItem value="other">Other Issues</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of your inquiry" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about your request..." 
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <SendIcon className="h-4 w-4" />
                            Submit Request
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-6">
                    <CheckCircleIcon className="h-12 w-12" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Request Submitted!</h2>
                  <p className="text-slate-600 mb-8">
                    Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>
                    Submit Another Request
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Is Lifetime GPS free to use?</h3>
              <p className="text-slate-600">
                Yes, Lifetime GPS is free to all our users. We may offer premium features for enhanced career exploration in the future including more personalized coaching, but our core assessment and basic career matching are completely free and will remain free to all our users.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">How long does the career race take?</h3>
              <p className="text-slate-600">
                Our standard career race takes approximately 15 minutes to complete, both the mini-games and the career race. It was designed to make it fun and short yet accurate as well.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">How accurate are the career recommendations?</h3>
              <p className="text-slate-600">
                Our AI-powered algorithm has been refined through thousands of user interactions and professional career coaching expertise. While no assessment is perfect, our users report high satisfaction with their matches. We're constantly working to refine the questions and answers to improve the effectiveness and accuracy of the assessment.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Is my data private and secure?</h3>
              <p className="text-slate-600">
                Absolutely. We take data privacy very seriously. Your personal information is encrypted and never sold to third parties. You can read our full privacy policy for more details.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;