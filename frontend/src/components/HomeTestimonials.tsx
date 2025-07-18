import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function HomeTestimonials() {
  // Selected best testimonials with Lifetime GPS added (from real testimonials)
  const testimonials = [
    {
      quote: "Honestly, every kid NEEDS TO KNOW THIS about themselves, it's like a blueprint! Lifetime GPS helped me understand my strengths and how I naturally work.",
      name: "Dana B.",
      role: "Parent"
    },
    {
      quote: "Our family was struggling to see the good in each other. Lifetime GPS has taught us what we can and cannot control. We've learned to go with the flow a little bit more and it's nice.",
      name: "Kim",
      role: "Parent"
    },
    {
      quote: "Loved the Lifetime GPS program and information provided—easy, informative info to understand and follow. For my son, the program gave him a sense of how to handle life more effectively.",
      name: "Gary H.",
      role: "Parent"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-3">What People Are Saying</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from parents and students who found their path with Lifetime GPS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white hover:shadow-md transition-shadow overflow-hidden border-t-4 border-primary">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       className="h-8 w-8 text-primary/30 mr-2 flex-shrink-0" 
                       fill="currentColor" 
                       viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-700 italic text-sm md:text-base">{testimonial.quote}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}