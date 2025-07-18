import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export function Testimonials() {
  const { user, isAuthenticated } = useUser();
  
  const setScreen = (screen: string) => {
    // Navigate to the appropriate screen based on user context
    window.location.assign(`/${screen}`);
  };

  const testimonials = [
    {
      quote: "I had no idea that my son needed to use his hands and be outside. I thought it was just a summer job thing, this makes a lot of sense.",
      name: "Amy",
      school: "Parent",
      imageSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "He was fighting us at every turn. I guess he just needed to hear about his strengths from someone else because now he is motivated!",
      name: "Kim M.",
      school: "Parent",
      imageSrc: "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "I'd say knowing how I work has given me permission to go back to doing the things that are natural for me. It makes me feel even more powerful as I step into the confidence that this IS the way I am and I thrive this way.",
      name: "Colette M.",
      school: "Student",
      imageSrc: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "Now I see that my agenda was at play and my goal was to see my son happy and confident, and that has happened.",
      name: "Darcy A.",
      school: "Parent",
      imageSrc: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "I was afraid of my daughter switching majors. After she worked with Gail, I found out she switched majors to her career with the HIGHEST rate of sustained success.",
      name: "Denise P.",
      school: "Parent",
      imageSrc: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "OK, now this explains the endless questions from my daughter, she needs to know the details and I don't. She's not trying to drive me crazy, it's just what she needs.",
      name: "Sharice L.",
      school: "Parent",
      imageSrc: "https://images.unsplash.com/photo-1550345332-09e3ac987658?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      quote: "My son was debating on his path and you helped him see what kind of lawyer he would be great at. That's exactly what he's in school for, thank you!",
      name: "Sharon R.",
      school: "Parent",
      imageSrc: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-4">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-primary">Lifetime GPS</h1>
          <Button 
            variant="ghost" 
            onClick={() => setScreen("onboarding")}
            className="text-primary hover:text-primary-dark text-sm md:text-base"
          >
            Back
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-10 animate-fadeIn">
          <section className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Student Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from students who found their path with Lifetime GPS. These are real experiences from 
              real students who discovered careers that align with their unique strengths and interests.
            </p>
          </section>

          {/* Featured testimonial */}
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-primary to-primary-dark text-white p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">We Help Parents and Students</h3>
                <blockquote className="text-lg md:text-xl italic mb-8">
                  "I'd say knowing how I work has given me permission to go back to doing the things that are natural for me instead of trying to fit into the box others have said I should be in. It makes me feel even more powerful as I step into the confidence that this IS the way I am and I thrive this way."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white">
                    <img 
                      src="https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                      alt="Colette M." 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Colette M.</p>
                    <p className="text-white/80 text-sm">Student</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">How We Make a Difference:</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700">We reveal natural abilities and strengths you may not have recognized</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700">We help teens find career paths that fit their unique personalities and strengths</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700">We provide clear paths toward sustainable career success and satisfaction</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700">We improve family understanding and communication by revealing natural differences</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial grid */}
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-700 italic">{testimonial.quote}</p>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                    <img 
                      src={testimonial.imageSrc} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Call to action */}
          <section className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl shadow-lg p-8 md:p-12 text-center mt-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Start Your Career Journey Today</h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students who've discovered their perfect career path with Lifetime GPS's 
              personalized guidance system.
            </p>
            <Button 
              onClick={() => setScreen("onboarding")} 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold"
            >
              Take the Quiz
            </Button>
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Button 
              variant="link" 
              onClick={() => setScreen("about")}
              className="text-gray-500 hover:text-primary"
            >
              About Us
            </Button>
            <Button 
              variant="link" 
              onClick={() => setScreen("privacyPolicy")}
              className="text-gray-500 hover:text-primary"
            >
              Privacy Policy
            </Button>
            <Button 
              variant="link" 
              onClick={() => setScreen("termsConditions")}
              className="text-gray-500 hover:text-primary"
            >
              Terms & Conditions
            </Button>
          </div>
          <p>© {new Date().getFullYear()} Lifetime GPS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}