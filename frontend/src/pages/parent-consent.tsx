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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle2, Mail } from "lucide-react";

// Schema for parent consent form - basic version for 13-17
const basicConsentSchema = z.object({
  parentName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  parentEmail: z.string().email({ message: 'Please enter a valid email' }),
  parentPhone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  parentalConsent: z.boolean().refine(val => val === true, {
    message: "Parental consent is required to continue",
  }),
});

// Extended schema for under 13 (COPPA compliance)
const coppaConsentSchema = basicConsentSchema.extend({
  parentAddress: z.string().min(5, { message: 'Please enter a valid address' }),
  parentCity: z.string().min(2, { message: 'Please enter a valid city' }),
  parentState: z.string().min(2, { message: 'Please enter a valid state' }),
  parentZip: z.string().min(5, { message: 'Please enter a valid ZIP code' }),
  parentRelationship: z.string().min(1, { message: 'Please select your relationship to the child' }),
  verificationMethod: z.string().min(1, { message: 'Please select a verification method' }),
  limitedUseConsent: z.boolean().refine(val => val === true, {
    message: "You must consent to limited data collection to continue",
  }),
});

type BasicConsentFormValues = z.infer<typeof basicConsentSchema>;
type COPPAConsentFormValues = z.infer<typeof coppaConsentSchema>;

const ParentConsentPage = () => {
  const { toast } = useToast();
  const [isUnder13, setIsUnder13] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);

  // Determine if the user is under 13 based on the birthdate stored earlier
  useEffect(() => {
    const storedAge = localStorage.getItem('userAge');
    if (storedAge) {
      const age = parseInt(storedAge, 10);
      setUserAge(age);
      setIsUnder13(age < 13);
    }
  }, []);

  // Setup the appropriate form based on age
  const basicForm = useForm<BasicConsentFormValues>({
    resolver: zodResolver(basicConsentSchema),
    defaultValues: {
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      parentalConsent: false,
    },
  });

  const coppaForm = useForm<COPPAConsentFormValues>({
    resolver: zodResolver(coppaConsentSchema),
    defaultValues: {
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      parentAddress: '',
      parentCity: '',
      parentState: '',
      parentZip: '',
      parentRelationship: '',
      verificationMethod: '',
      limitedUseConsent: false,
      parentalConsent: false,
    },
  });

  // Handle basic form submission (13-17)
  function onBasicSubmit(values: BasicConsentFormValues) {
   //  console.log('Parent consent form submitted (13-17):', values);
    
    // Store consent data
    localStorage.setItem('parentConsent', JSON.stringify(values));
    
    toast({
      title: "Consent Recorded",
      description: "Thank you for providing parental consent. Continuing with registration...",
    });
    
    // Redirect to complete registration
    setTimeout(() => {
      window.location.assign('/complete-signup');
    }, 1500);
  }

  // Handle COPPA form submission (under 13)
  function onCOPPASubmit(values: COPPAConsentFormValues) {
   //  console.log('COPPA consent form submitted (under 13):', values);
    
    // Store consent data
    localStorage.setItem('parentConsent', JSON.stringify(values));
    
    toast({
      title: "COPPA Verification Process Initiated",
      description: "We'll verify the provided information according to COPPA regulations. You'll receive further instructions via email.",
    });
    
    // For under 13, we might delay account activation pending verification
    // But for demo purposes, redirect to the next step
    setTimeout(() => {
      window.location.assign('/complete-signup');
    }, 1500);
  }

  if (userAge === null) {
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
          <CardTitle className="text-xl font-bold">
            {isUnder13 ? 'Parent/Guardian Consent (COPPA Compliance)' : 'Parent/Guardian Consent'}
          </CardTitle>
          <CardDescription>
            {isUnder13 
              ? "Since the user is under 13, we need complete parent/guardian information for COPPA compliance."
              : "Since the user is under 18, we need parent/guardian consent before proceeding."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isUnder13 ? (
            // COPPA compliant form for under 13
            <Form {...coppaForm}>
              <form onSubmit={coppaForm.handleSubmit(onCOPPASubmit)} className="space-y-4">
                <div className="space-y-4 p-4 border rounded-md bg-amber-50">
                  <FormField
                    control={coppaForm.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Parent/Guardian Full Name</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary bg-white">
                            <UserCircle2 className="ml-2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Enter parent/guardian name" className="border-0 focus-visible:ring-0" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={coppaForm.control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Parent/Guardian Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary bg-white">
                            <Mail className="ml-2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Enter parent/guardian email" className="border-0 focus-visible:ring-0" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={coppaForm.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Parent/Guardian Phone</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary bg-white">
                            <svg className="ml-2 h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <Input placeholder="Enter parent/guardian phone number" className="border-0 focus-visible:ring-0" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Additional COPPA verification fields */}
                  <div className="pt-2 border-t border-amber-200">
                    <h4 className="font-semibold text-amber-800 text-sm mb-2">Additional COPPA Verification</h4>
                    <p className="text-xs text-amber-700 mb-4">
                      Federal law requires us to collect and verify additional information for users under 13.
                    </p>
                  </div>
                  
                  <FormField
                    control={coppaForm.control}
                    name="parentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Mailing Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter street address" className="bg-white focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={coppaForm.control}
                      name="parentCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-700">City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" className="bg-white focus-visible:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={coppaForm.control}
                      name="parentState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-700">State</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter state" className="bg-white focus-visible:ring-primary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={coppaForm.control}
                    name="parentZip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ZIP code" className="bg-white focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={coppaForm.control}
                    name="parentRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Relationship to Child</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white focus:ring-primary">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="legal_guardian">Legal Guardian</SelectItem>
                            <SelectItem value="grandparent">Grandparent</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={coppaForm.control}
                    name="verificationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Preferred Verification Method</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white focus:ring-primary">
                              <SelectValue placeholder="Select verification method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email Verification</SelectItem>
                            <SelectItem value="phone">Phone Verification</SelectItem>
                            <SelectItem value="credit_card">Credit Card Verification</SelectItem>
                            <SelectItem value="id_upload">ID Upload</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={coppaForm.control}
                    name="limitedUseConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 mt-1 rounded-sm border border-primary"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium text-amber-700">
                            Limited Data Collection Consent
                          </FormLabel>
                          <p className="text-xs text-amber-600">
                            I understand that Lifetime GPS will collect limited personal information from my child as required for the functionality of the service. This includes basic profile information, assessment responses, and career interests. This information will not be shared with third parties for marketing purposes.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={coppaForm.control}
                    name="parentalConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white mt-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 mt-1 rounded-sm border border-primary"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium text-amber-700">
                            Parental Consent Confirmation
                          </FormLabel>
                          <p className="text-xs text-amber-600">
                            I confirm that I am the parent or legal guardian of this child and I consent to their use of Lifetime GPS. I understand that my contact information will be used to verify consent as required by COPPA regulations.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full">Submit Parental Consent</Button>
              </form>
            </Form>
          ) : (
            // Simplified form for 13-17
            <Form {...basicForm}>
              <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-4">
                <div className="space-y-4 p-4 border rounded-md bg-amber-50">
                  <FormField
                    control={basicForm.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Parent/Guardian Full Name</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary bg-white">
                            <UserCircle2 className="ml-2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Enter parent/guardian name" className="border-0 focus-visible:ring-0" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={basicForm.control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Parent/Guardian Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary bg-white">
                            <Mail className="ml-2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="Enter parent/guardian email" className="border-0 focus-visible:ring-0" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={basicForm.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-700">Parent/Guardian Phone</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-primary bg-white">
                            <svg className="ml-2 h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <Input placeholder="Enter parent/guardian phone number" className="border-0 focus-visible:ring-0" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={basicForm.control}
                    name="parentalConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-white mt-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4 mt-1 rounded-sm border border-primary"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium text-amber-700">
                            Parental Consent Confirmation
                          </FormLabel>
                          <p className="text-xs text-amber-600">
                            I confirm that I am the parent or legal guardian of this child and I consent to their use of Lifetime GPS. I understand that my contact information will be used for verification purposes.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full">Submit Parental Consent</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentConsentPage;