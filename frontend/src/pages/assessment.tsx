import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronsRight, Sparkles, Target } from 'lucide-react';

const AssessmentPage: React.FC = () => {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<string | null>(null);

  // Load the selected voice from localStorage
  useEffect(() => {
    const voiceId = localStorage.getItem('selectedVoiceId');
    const voiceGender = localStorage.getItem('selectedVoiceGender');
    
    if (voiceId) {
      setSelectedVoiceId(voiceId);
    }
    
    if (voiceGender) {
      setSelectedVoiceGender(voiceGender);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Your Career Assessment Journey</h1>
        <p className="text-lg text-muted-foreground">
          Discover your ideal career path through fun, interactive assessments
        </p>
      </header>

      <section className="bg-muted p-6 rounded-lg mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-semibold">Welcome to Your Career Journey</h2>
        </div>
        
        <p className="mb-4">
          You've selected a {selectedVoiceGender || 'voice'} guide for your journey. Your AI assistant will help you navigate
          through the assessment process to discover career paths that match your unique strengths and interests.
        </p>
        
        <div className="mb-6 mt-4">
          <img 
            src="/attached_assets/GPS MILESTONES.png" 
            alt="GPS Career Journey Milestones" 
            className="w-full rounded-lg shadow-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="font-medium">Mini-Games</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Fun interactive games that analyze your traits, preferences, and aptitudes.
            </p>
          </div>
          
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="font-medium">AI Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced algorithms process your results to identify ideal career matches.
            </p>
          </div>
          
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="font-medium">Career Roadmap</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get a personalized path to your ideal career with actionable steps.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-primary" size={24} />
              Select Your Assessment Method
            </CardTitle>
            <CardDescription>
              Choose how you want to discover your ideal career path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="mini-games" className="space-y-4">
              <div className="flex items-start space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="mini-games" id="mini-games" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="mini-games" className="font-medium">Mini-Games Assessment (Recommended)</Label>
                  <p className="text-sm text-muted-foreground">
                    Interactive games that analyze your decision-making, skills, and preferences while you have fun.
                    Takes approximately 15-20 minutes to complete.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="questionnaire" id="questionnaire" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="questionnaire" className="font-medium">Traditional Questionnaire</Label>
                  <p className="text-sm text-muted-foreground">
                    A series of questions about your interests, values, and skills.
                    Takes approximately 10-15 minutes to complete.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="express" id="express" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="express" className="font-medium">Express Assessment</Label>
                  <p className="text-sm text-muted-foreground">
                    A quick assessment based on your key interests and motivations.
                    Takes approximately 5 minutes to complete.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link href="/mini-games">
              <Button className="bg-primary hover:bg-primary/90">
                Start Assessment <ChevronRight className="ml-2" size={16} />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      <section className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-semibold mb-2">Your Career Journey Awaits</h2>
        <p className="mb-4 max-w-xl mx-auto">
          By completing this assessment, you'll unlock personalized career recommendations and a roadmap to success
          that's tailored specifically to your unique talents and interests.
        </p>
        <Link href="/mini-games">
          <Button className="bg-primary hover:bg-primary/90">
            Begin Your Discovery <ChevronsRight className="ml-1" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default AssessmentPage;