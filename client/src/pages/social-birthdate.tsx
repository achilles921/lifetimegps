import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Schema for the birthdate form
const birthdateSchema = z.object({
  birthdate: z.date({
    required_error: "Please select a date of birth",
  }).refine(val => {
    // Validate that date is not in the future
    const today = new Date();
    return val <= today;
  }, { message: "Date cannot be in the future" })
});

type BirthdateFormValues = z.infer<typeof birthdateSchema>;

const SocialBirthdatePage = () => {
  const { toast } = useToast();
  const [socialAuthData, setSocialAuthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Setup the form
  const form = useForm<BirthdateFormValues>({
    resolver: zodResolver(birthdateSchema),
    defaultValues: {
      birthdate: undefined,
    }
  });

  // Get social auth data from localStorage (it would have been saved during social login)
  useEffect(() => {
    const socialDataStr = localStorage.getItem('socialAuthData');
    if (socialDataStr) {
      try {
        const data = JSON.parse(socialDataStr);
        setSocialAuthData(data);
        
        // If data includes a birthdate, we can redirect to continue the signup
        if (data.birthdate) {
          processBirthdate(new Date(data.birthdate));
        }
      } catch (e) {
        console.error("Error parsing social auth data", e);
      }
    }
    setLoading(false);
  }, []);

  // Process the birthdate and continue with signup
  const processBirthdate = (birthdate: Date) => {
    // Calculate age
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    
    // Store in session for next steps
    const formattedDate = birthdate.toISOString().split('T')[0]; // YYYY-MM-DD
    localStorage.setItem('userBirthdate', formattedDate);
    localStorage.setItem('userAge', age.toString());
    
    // Redirect to appropriate next step based on age
    if (age < 13) {
      // Under 13 - requires full COPPA compliance
      toast({
        title: "Additional Information Needed",
        description: "Since you're under 13, we need parent/guardian consent before proceeding.",
      });
      // Redirect to a full parent consent page
      setTimeout(() => window.location.assign('/parent-consent'), 1500);
    } else if (age < 18) {
      // Under 18 but 13 or older - requires parental consent but less strict
      toast({
        title: "Additional Information Needed",
        description: "Since you're under 18, we need parent/guardian consent before proceeding.",
      });
      // Redirect to a simpler parent consent page
      setTimeout(() => window.location.assign('/parent-consent'), 1500);
    } else {
      // 18 or older - proceed with registration
      toast({
        title: "Thank you!",
        description: "Your age has been verified. Continuing with registration...",
      });
      // Redirect to complete the registration
      setTimeout(() => window.location.assign('/complete-signup'), 1500);
    }
  };

  // Handle form submission
  function onSubmit(values: BirthdateFormValues) {
    processBirthdate(values.birthdate);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md min-h-screen flex flex-col justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">One more step...</CardTitle>
          <CardDescription>
            {socialAuthData?.provider 
              ? `We need your birthdate to complete your ${socialAuthData.provider} registration.` 
              : "We need your birthdate to complete your registration."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-xs text-muted-foreground">
                <p>Why do we need this? Your age helps us:</p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Ensure compliance with legal requirements</li>
                  <li>Provide age-appropriate career guidance</li>
                  <li>Personalize your career roadmap</li>
                </ul>
                <p className="mt-2 font-medium">Your privacy is important to us. This information is used only for these purposes.</p>
              </div>
              
              <Button type="submit" className="w-full">Continue</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialBirthdatePage;