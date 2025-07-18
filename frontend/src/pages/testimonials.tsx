import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AvatarEmoji from '@/components/AvatarEmoji';

const TestimonialsPage: React.FC = () => {
  // Creating testimonial arrays by category
  const studentTestimonials = [
    {
      quote: "I'd say knowing how I work has given me permission to go back to doing the things that are natural for me instead of trying to fit into the box others have said I should be in. It makes me feel even more powerful as I step into the confidence that this IS the way I am and I thrive this way.",
      name: "Colette M.",
      role: "Student",
      initials: "CM",
      bgColor: "bg-blue-100",
      textColor: "text-blue-500"
    },
    {
      quote: "I've always known my way in school wasn't celebrated or encouraged, that's why I teach, to help kids like me.",
      name: "Amy S.",
      role: "Student & Teacher",
      initials: "AS",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500"
    }
  ];

  const parentTestimonials = [
    {
      quote: "I had no idea that my son needed to use his hands and be outside, I thought it was just a summer job thing, this makes a lot of sense.",
      name: "Amy",
      role: "Parent",
      initials: "A",
      bgColor: "bg-green-100",
      textColor: "text-green-500"
    },
    {
      quote: "He was fighting us at every turn, I guess he just needed to hear about his strengths from someone else because now he is motivated!",
      name: "Kim M.",
      role: "Parent",
      initials: "KM",
      bgColor: "bg-purple-100",
      textColor: "text-purple-500"
    },
    {
      quote: "Now I see that my agenda was at play and you're right, my goal was to see my son happy and confident and that has happened.",
      name: "Darcy A.",
      role: "Parent",
      initials: "DA",
      bgColor: "bg-pink-100",
      textColor: "text-pink-500"
    },
    {
      quote: "The mess in the house is unbelievable and I can't keep up, now I know that she can leave her room a mess but not the rest of the house. This was eye opening and now I know when she's in her zone, she is making messes, as frustrating as that is...",
      name: "Dawn B.",
      role: "Parent",
      initials: "DB",
      bgColor: "bg-amber-100",
      textColor: "text-amber-500"
    },
    {
      quote: "Our family was struggling to see the good in each other, this process has taught us what we can and cannot control, we've learned to go with the flow a little bit more and it's nice.",
      name: "Kim",
      role: "Parent",
      initials: "K",
      bgColor: "bg-red-100",
      textColor: "text-red-500"
    },
    {
      quote: "I was wondering why my employee was doing that? Now it makes sense and when our results are clear, I don't care how she does it, just that it gets done.",
      name: "Christy E.",
      role: "Employer",
      initials: "CE",
      bgColor: "bg-teal-100",
      textColor: "text-teal-500"
    }
  ];

  const featuredTestimonials = [
    {
      quote: "Honestly, every kid NEEDS TO KNOW THIS about themselves, it's like a blueprint!",
      name: "Dana B.",
      role: "Parent",
      initials: "DB",
      bgColor: "bg-violet-100",
      textColor: "text-violet-500"
    },
    {
      quote: "Loved the program and information provided-easy, informative info to understand and follow. For my son, the program gave him a sense of how to handle life more effectively. For my wife and myself, it provided many answers to better support him in his life.",
      name: "Gary H.",
      role: "Parent",
      initials: "GH",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-500"
    },
    {
      quote: "I was afraid of my daughter switching majors. After she worked with Gail, I found out she switched majors to her career with the HIGHEST rate of sustained success.",
      name: "Denise P.",
      role: "Parent",
      initials: "DP",
      bgColor: "bg-rose-100",
      textColor: "text-rose-500"
    },
    {
      quote: "Finally, this gets me, now I know why I do what I do, can my wife and boss see this?",
      name: "John B.",
      role: "Client",
      initials: "JB",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-500"
    }
  ];

  const moreTestimonials = [
    {
      quote: "I was like, why am I paying her this amount of money...and then I saw the results with my daughter. No program has had that kind of impact on her.",
      name: "Mark B.",
      role: "Parent",
      initials: "MB",
      bgColor: "bg-orange-100",
      textColor: "text-orange-500"
    },
    {
      quote: "This has been so helpful to see how the whole family works, puts a name to some of the craziness I didn't understand.",
      name: "Kim C.",
      role: "Parent",
      initials: "KC",
      bgColor: "bg-lime-100",
      textColor: "text-lime-500"
    },
    {
      quote: "OH my goodness, this is ok? I mean, I've been trying NOT to be this way for years and it's been stressing me out and now you're saying it's ok?",
      name: "Christy E.",
      role: "Client",
      initials: "CE",
      bgColor: "bg-sky-100",
      textColor: "text-sky-500"
    },
    {
      quote: "For years I have been trying to make this natural strength different because of family members, I've stopped the cycle with my daughter, it ends here.",
      name: "Sarah H.",
      role: "Parent",
      initials: "SH",
      bgColor: "bg-blue-100",
      textColor: "text-blue-500"
    },
    {
      quote: "We were about to take our son to see the Dr. because we thought something was wrong with him, thank you for helping us see his strengths and teach us how to go with his grain instead of our way.",
      name: "Christine H.",
      role: "Parent",
      initials: "CH",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-500"
    },
    {
      quote: "OK, now this explains the endless questions from my daughter, she needs to know the details and I don't, she's not trying to drive me crazy, it's just what she needs.",
      name: "Sharice L.",
      role: "Parent",
      initials: "SL",
      bgColor: "bg-fuchsia-100",
      textColor: "text-fuchsia-500"
    },
    {
      quote: "Wow, this is the missing link for teachers, if every teacher had this about their students, the world would be a better place.",
      name: "Kimberly S.",
      role: "Parent & Teacher",
      initials: "KS",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-500"
    },
    {
      quote: "It wasn't natural for me to come up with ways to encourage my kids because they are so different from me, our relationship was most important and that's what we have back.",
      name: "Heather O.",
      role: "Parent",
      initials: "HO",
      bgColor: "bg-amber-100",
      textColor: "text-amber-500"
    },
    {
      quote: "My son was debating on his path and you helped him see what kind of lawyer he would be great at, that's exactly what he's in school for, thank you.",
      name: "Sharon R.",
      role: "Parent",
      initials: "SR",
      bgColor: "bg-teal-100",
      textColor: "text-teal-500"
    }
  ];

  // Define the testimonial type
  type Testimonial = {
    quote: string;
    name: string;
    role: string;
    initials: string;
    bgColor: string;
    textColor: string;
  };

  // Testimonial component for consistent styling
  const TestimonialCard = ({ 
    testimonial, 
    size = "regular"
  }: { 
    testimonial: Testimonial; 
    size?: "large" | "medium" | "regular";
  }) => {
    // Creates a unique but deterministic index for each testimonial
    const uniqueIndex = React.useMemo(() => {
      // Create a more unique hash using all characters in the name plus quote length
      let hash = 0;
      // Sum the character codes of each letter in the name
      for (let i = 0; i < testimonial.name.length; i++) {
        hash += testimonial.name.charCodeAt(i);
      }
      // Add first 10 characters of quote to increase uniqueness
      const quoteFragment = testimonial.quote.substring(0, 10);
      for (let i = 0; i < quoteFragment.length; i++) {
        hash += quoteFragment.charCodeAt(i);
      }
      return hash % 20; // 20 different avatars
    }, [testimonial.name, testimonial.quote]);
    
    if (size === "large") {
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 h-full">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <AvatarEmoji index={uniqueIndex} role={testimonial.role} size="lg" />
              <div>
                <h3 className="font-semibold text-xl">{testimonial.name}</h3>
                <p className="text-slate-500">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex-grow">
              <p className="text-slate-700 mb-4 text-lg">
                "{testimonial.quote}"
              </p>
            </div>
            <div className="flex items-center mt-4">
              <div className="text-yellow-400 flex">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (size === "medium") {
      return (
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-100 h-full">
          <div className="flex items-center gap-4 mb-6">
            <AvatarEmoji index={uniqueIndex} role={testimonial.role} size="md" />
            <div>
              <h4 className="font-semibold text-lg">{testimonial.name}</h4>
              <p className="text-sm text-slate-500">{testimonial.role}</p>
            </div>
          </div>
          <p className="text-slate-700 mb-4">
            "{testimonial.quote}"
          </p>
          <div className="text-yellow-400 flex">
            {"★★★★★".split("").map((star, i) => (
              <span key={i}>{star}</span>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
        <div className="flex items-center gap-4 mb-4">
          <AvatarEmoji index={uniqueIndex} role={testimonial.role} size="sm" />
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-slate-500">{testimonial.role}</p>
          </div>
        </div>
        <p className="italic text-slate-600 mb-4">
          "{testimonial.quote}"
        </p>
        <div className="text-yellow-400 flex">
          {"★★★★★".split("").map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">What Our Users Say</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Read real stories from students, parents, and professionals who have discovered their natural strengths and abilities
          </p>
        </div>
      </header>

      {/* Featured testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Success Stories</h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {featuredTestimonials.slice(0, 2).map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} size="large" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed testimonials */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">All Testimonials</h2>
          
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="all" className="mb-8">
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="parents">For Parents</TabsTrigger>
                  <TabsTrigger value="students">For Students</TabsTrigger>
                  <TabsTrigger value="professionals">For Professionals</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...featuredTestimonials, ...parentTestimonials, ...studentTestimonials, ...moreTestimonials]
                    .filter((t, i, arr) => arr.findIndex(x => x.name === t.name && x.quote === t.quote) === i) // Remove duplicates
                    .map((testimonial, index) => (
                      <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="parents">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...parentTestimonials, ...moreTestimonials.filter(t => t.role.includes('Parent'))]
                    .filter((t, i, arr) => arr.findIndex(x => x.name === t.name && x.quote === t.quote) === i)
                    .map((testimonial, index) => (
                      <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="students">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studentTestimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="professionals">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    featuredTestimonials.find(t => t.name === "John B."),
                    parentTestimonials.find(t => t.name === "Christy E."),
                    studentTestimonials.find(t => t.role.includes('Teacher')),
                    moreTestimonials.find(t => t.name === "Kimberly S.")
                  ].filter((testimonial): testimonial is Testimonial => testimonial !== undefined)
                    .map((testimonial, index) => (
                      <TestimonialCard key={index} testimonial={testimonial} size="medium" />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* Highlighted quotes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Impact Highlights</h2>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-primary/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">For Parents</h3>
              <ul className="space-y-6">
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0 mt-1">→</span>
                  <p className="text-gray-700">"We were about to take our son to see the Dr. because we thought something was wrong with him."</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0 mt-1">→</span>
                  <p className="text-gray-700">"This has been so helpful to see how the whole family works, puts a name to some of the craziness I didn't understand."</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0 mt-1">→</span>
                  <p className="text-gray-700">"I had no idea that my son needed to use his hands and be outside, I thought it was just a summer job thing."</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-primary/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">For Students & Professionals</h3>
              <ul className="space-y-6">
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0 mt-1">→</span>
                  <p className="text-gray-700">"I'd say knowing how I work has given me permission to go back to doing the things that are natural for me."</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0 mt-1">→</span>
                  <p className="text-gray-700">"I've always known my way in school wasn't celebrated or encouraged, that's why I teach, to help kids like me."</p>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary flex-shrink-0 mt-1">→</span>
                  <p className="text-gray-700">"Finally, this gets me, now I know why I do what I do, can my wife and boss see this?"</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Natural Strengths?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of others who have found their ideal career path and improved family understanding through our personalized guidance system.
          </p>
          <Link href="/voice-demo">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Take the Career Race
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;