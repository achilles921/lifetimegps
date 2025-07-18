import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/context/AuthContextFixed';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

// Schema for signup form
const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email' }),
    birthdate: z.string().min(1, { message: 'Date of birth is required' }).refine(val => {
      // Validate date format and that it's a valid date
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, { message: 'Please enter a valid date' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
    // Parental consent fields - these are truly optional for validation
    // We'll do our own validation in the form submission handler
    parentName: z.string().optional().or(z.literal('')),
    parentEmail: z.union([
      z.string().email({ message: 'Please enter a valid parent email' }),
      z.literal('') // Allow empty string
    ]).optional(),
    parentConsent: z.boolean().optional().default(false),
    termsAccepted: z.boolean().refine(val => val === true, {
      message: 'You must accept the Terms and Conditions to continue',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

// Schema for login form
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const SimpleSignupPage: React.FC = () => {
  const { toast } = useToast();
  const { login, loginError } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('signup');
  const [isUnder18, setIsUnder18] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup for signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      birthdate: '',
      password: '',
      confirmPassword: '',
      parentName: '',
      parentEmail: '',
      parentConsent: false,
      termsAccepted: false,
    },
  });
  
  // Watch the birthdate to determine if user is under 18
  const birthdate = signupForm.watch('birthdate');
  
  // Calculate if user is under 18 whenever birthdate changes
  useEffect(() => {
    if (birthdate) {
      const birthDate = new Date(birthdate);
      const today = new Date();
      
      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Set isUnder18 state
      const under18 = age < 18;
      setIsUnder18(under18);
     //  console.log('Age calculated:', age, 'Is under 18:', under18);
    } else {
      setIsUnder18(false);
    }
  }, [birthdate]);
  
  // Debug form state
  // Removed effect that was causing unnecessary re-renders

  // Setup for login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle signup form submission
  async function onSignupSubmit(values: SignupFormValues) {
   //  console.log('Signup form submitted:', values);
   //  console.log('Form is under 18:', isUnder18);
   //  console.log('Form errors:', signupForm.formState.errors);
    
    // Double check that required fields are filled
    if (!values.name || !values.email || !values.password || !values.confirmPassword || !values.birthdate) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    try {
      // Use the centralized backend signup function
      const { signupWithBackend } = await import('@/lib/authUtils');
      
      const result = await signupWithBackend({
        name: values.name,
        email: values.email,
        password: values.password,
        birthdate: values.birthdate,
        parentName: values.parentName,
        parentEmail: values.parentEmail,
        parentConsent: values.parentConsent
      });

      if (result.success && result.user) {
        toast({
          title: "Account created!",
          description: "Welcome to Lifetime GPS. You are now logged in.",
        });
        
        // Check if there's a saved route to redirect to after signup
        const savedRoute = localStorage.getItem('redirectAfterLogin');
        
        // Redirect after a short delay
        setTimeout(() => {
          if (savedRoute) {
            // Clear the saved route
            localStorage.removeItem('redirectAfterLogin');
            window.location.assign(savedRoute);
          } else {
            // Default redirect if no saved route
            window.location.assign('/voice-demo');
          }
        }, 1500);
      } else {
        // Handle signup error
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: result.error || "Failed to create account. Please try again.",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Signup error",
        description: "An error occurred during signup. Please try again.",
      });
    }
  }

  // Handle login form submission
  async function onLoginSubmit(values: LoginFormValues) {
   //  console.log('Login form submitted:', values);
    setIsSubmitting(true);
    
    try {
      // Use our centralized login function from the auth hook
      const result = await login(values);
      
      if (result.success) {
       //  console.log('Login successful with hook:', result.user);
        
        toast({
          title: "Login successful!",
          description: `Welcome back to Lifetime GPS, ${result.user?.name || 'User'}!`,
        });
        
        // Check if there's a saved route to redirect to after login
        const savedRoute = localStorage.getItem('redirectAfterLogin');
        
        // Use window.location.href for more reliable navigation
        setTimeout(() => {
          // Set the login redirect flag to trigger auto-start of quiz
          localStorage.setItem('loginRedirect', 'login');
          
          if (savedRoute) {
            // Clear the saved route
            localStorage.removeItem('redirectAfterLogin');
            // Add fallback in case savedRoute is null
            window.location.href = savedRoute || '/career-quiz';
          } else {
            // Default redirect with full URL construction for reliability
            const baseUrl = window.location.origin;
            window.location.href = baseUrl + '/career-quiz';
          }
        }, 800); // Longer delay for better user experience
        
        return;
      }
      
      // If we get here, login failed using the hook
      console.error('Login failed with hook:', result.error);
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: loginError || "Invalid email or password. Please try again.",
      });
      
      setIsSubmitting(false);
      return;
      
      // Fall back to server-side login as backup
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': values.email,
          'X-Auth-Token': `Bearer ${values.email}`,
        },
        body: JSON.stringify({
          username: values.email, // Server expects 'username' not 'email'
          password: values.password,
        }),
      });
      
      // Check if server login was successful
      if (response.ok) {
        const userData = await response.json();
       //  console.log('Server login successful:', userData);
        
        // Store auth data in localStorage (improved session persistence)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', userData.email || userData.username || values.email);
        localStorage.setItem('userId', userData.id || '1001');
        localStorage.setItem('userName', userData.firstName || values.email.split('@')[0]);
        localStorage.setItem('authTimestamp', Date.now().toString());
        
        // Force a reload of all tabs to sync auth state
        try {
          // Use BroadcastChannel for cross-tab communication if supported
          const bc = new BroadcastChannel('auth_channel');
          bc.postMessage({ type: 'LOGIN', email: values.email });
        } catch (e) {
         //  console.log('BroadcastChannel not supported, using localStorage for cross-tab sync');
          // Fallback to localStorage event for older browsers
          localStorage.setItem('auth_sync', Date.now().toString());
        }
        
        toast({
          title: "Login successful!",
          description: `Welcome back to Lifetime GPS, ${userData.firstName || values.email.split('@')[0]}!`,
        });
        
        // Check if there's a saved route to redirect to after login
        const savedRoute = localStorage.getItem('redirectAfterLogin');
        
        // Use window.location.href for more reliable navigation
        setTimeout(() => {
          // Set the login redirect flag to trigger auto-start of quiz
          localStorage.setItem('loginRedirect', 'login');
          
          if (savedRoute) {
            // Clear the saved route
            localStorage.removeItem('redirectAfterLogin');
            window.location.href = savedRoute || '/career-quiz';
          } else {
            // Default redirect with full URL construction for reliability
            const baseUrl = window.location.origin;
            window.location.href = baseUrl + '/career-quiz';
          }
        }, 500);
        
        return;
      }
            

      // If all login methods failed, show error
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Show a more helpful error message
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An error occurred during login. Please try again.",
      });
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-duo-green-100 to-duo-blue-50 animate-gradient-x py-10 px-4">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-duo-green-600">Join Lifetime GPS</h1>
          <p className="text-lg text-duo-purple-500 mt-2">
            Start your career discovery journey today!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-scaleIn">
          <Tabs defaultValue="signup" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-duo-green-50">
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-duo-green-500 data-[state=active]:text-white py-3 rounded-xl"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-duo-purple-500 data-[state=active]:text-white py-3 rounded-xl"
              >
                Log In
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup" className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-duo-green-100 p-4 rounded-full">
                    <span className="text-4xl">🚀</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-duo-green-600">Create Your Account</h2>
                <p className="text-center text-gray-600 mt-1">Join thousands discovering their perfect career</p>
              </div>
              
              <Form {...signupForm}>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                   //  console.log("Form submit event triggered");
                    return signupForm.handleSubmit(onSignupSubmit)(e);
                  }}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {isUnder18 && (
                    <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
                      <div className="text-sm font-medium text-center text-orange-600">
                        Since you are under 18, parental consent is required
                      </div>
                      
                      <FormField
                        control={signupForm.control}
                        name="parentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent/Guardian Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter parent's name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="parentEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent/Guardian Email</FormLabel>
                            <FormControl>
                              <Input placeholder="parent@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={signupForm.control}
                        name="parentConsent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value || false}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I am the parent/guardian of this child and I consent to their use of Lifetime GPS.
                              </FormLabel>
                              <FormDescription>
                                By checking this box, you confirm that you have reviewed and agree to the Terms of Service and Privacy Policy.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={signupForm.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2 border border-gray-200 bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I accept the Terms and Conditions
                          </FormLabel>
                          <FormDescription>
                            By checking this box, you agree to our <a href="/terms" className="text-primary hover:underline">Terms and Conditions</a>, including our Acceptable Use Policy and Disclaimer.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="button" 
                    className="w-full bg-duo-green-500 hover:bg-duo-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
                    onClick={() => {
                     //  console.log("Submit button clicked directly");
                      const data = signupForm.getValues();
                     //  console.log("Form data:", data);
                      
                      // Check terms and conditions acceptance
                      if (!data.termsAccepted) {
                        toast({
                          variant: "destructive",
                          title: "Terms and Conditions",
                          description: "You must accept the Terms and Conditions to continue",
                        });
                        return;
                      }
                      
                      // Handle the parent information validation manually
                      if (isUnder18) {
                        // If under 18, check parent info
                        if (!data.parentName) {
                          toast({
                            variant: "destructive",
                            title: "Missing information",
                            description: "Please enter parent/guardian name",
                          });
                          return;
                        }
                        
                        if (!data.parentEmail) {
                          toast({
                            variant: "destructive",
                            title: "Missing information",
                            description: "Please enter parent/guardian email",
                          });
                          return;
                        }
                        
                        if (!data.parentConsent) {
                          toast({
                            variant: "destructive",
                            title: "Missing information",
                            description: "Parent/guardian consent is required",
                          });
                          return;
                        }
                      }
                      
                      // If all validations pass, submit the form
                      toast({
                        title: "Processing...",
                        description: "Creating your account. Please wait.",
                      });
                      
                      // Submit the form
                      signupForm.handleSubmit(onSignupSubmit)();
                    }}
                  >
                    {signupForm.formState.isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="login" className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-duo-purple-100 p-4 rounded-full">
                    <span className="text-4xl">👋</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-duo-purple-600">Welcome Back</h2>
                <p className="text-center text-gray-600 mt-1">Continue your career discovery journey</p>
              </div>
              
              <Form {...loginForm}>
                {/* Display any login errors at the top of the form */}
                {loginError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {loginError}
                  </div>
                )}
                
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="button" 
                    className="w-full bg-duo-purple-500 hover:bg-duo-purple-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
                    onClick={() => {
                     //  console.log("Login button clicked directly");
                      const data = loginForm.getValues();
                     //  console.log("Login data:", data);
                      loginForm.handleSubmit(onLoginSubmit)();
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SimpleSignupPage;