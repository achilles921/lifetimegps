import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-primary/10 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Lifetime GPS</h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            We believe the best career path is the one that's built for you and
            around you.
          </p>
        </div>
      </div>

      {/* Mission section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-slate-700 mb-8">
              At Lifetime GPS, we're on a mission to help students and young adults unlock their true
              potential by showing them career paths that match their innate strengths, traits,
              interests, work styles, and motivation. No more guessing. No more pressure. Just clear,
              personalized guidance for building a life you'll love.
            </p>
          </div>
        </div>
      </section>

      {/* Our team section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="w-24 h-24 flex-shrink-0 mx-auto sm:mx-0">
                  <AvatarImage src="/avatars/don-lennox-avatar.svg" alt="Don Lennox" />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">DL</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold mb-2">Don Lennox</h3>
                  <h4 className="text-primary font-medium mb-3">CEO & Co-Founder</h4>
                  <p className="text-slate-600">
                    Don designed, built and supported data centers and fiber optic technologies for most of his career, 
                    working with many of the largest data centers in the industry including Equinix, Frontier Global, 
                    Ebay, GoDaddy and many others. He built his company to more than 750 employees and was recognized 
                    as an Inc 500 company. He successfully sold his company to a publicly traded communications company. 
                    His vision is to revolutionize career guidance by combining AI technology with deep insights into 
                    Gen Z's unique career development needs.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="w-24 h-24 flex-shrink-0 mx-auto sm:mx-0">
                  <AvatarImage src="/avatars/alain-nguyen-avatar.svg" alt="Alain Nguyen" />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">AN</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold mb-2">Alain Nguyen</h3>
                  <h4 className="text-primary font-medium mb-3">Co-Founder</h4>
                  <p className="text-slate-600">
                    Alain has been involved in different technology industries from telecommunications, 
                    software development, cybersecurity to online advertising, to search and now edtech. 
                    Being in advertising and search for over 14 years, working with Google, Bing & Yahoo, 
                    he finetuned his skills to monetize different digital products through advertising, 
                    affiliate/performance-based marketing and other strategies.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="w-24 h-24 flex-shrink-0 mx-auto sm:mx-0">
                  <AvatarImage src="/avatars/gail-swift-avatar.svg" alt="Gail Swift" />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">GS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold mb-2">Gail Swift</h3>
                  <h4 className="text-primary font-medium mb-3">Career Strategist & Coach</h4>
                  <p className="text-slate-600">
                    A career coach who's helped over 1,500 students discover
                    the careers they were meant for. She's leading the charge to create our fast, 15-minute
                    career race so students can identify their ideal paths.
                  </p>
                </div>
              </div>
            </div>
            

          </div>
          
          <div className="mt-16 bg-white p-8 rounded-xl shadow-sm text-center max-w-3xl mx-auto">
            <p className="text-slate-700 text-lg mb-4">
              Together, we're building more than a platform — we're building a GPS for life. 
              We believe you're not a number, your future shouldn't be a guessing game and the right career changes everything.
            </p>
            <p className="text-primary font-semibold text-lg italic">
              Your life, Your path. Your Lifetime GPS.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Ideal Career Path?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover career paths perfectly suited to your unique strengths and interests in just a few minutes.
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

export default AboutPage;