import React, { useEffect, useState } from 'react';
import { processQuizResponses, generateCareerMatches } from '@/utils/quizLogic';

// Sample quiz responses with trades-oriented interests and motivations
const sampleQuizResponses = {
  // Sector 1 answers with varied team values (team_wisdom, team_mentor, team_synergy, etc.)
  "sector1": {
    "s1_q1": "hands-on",
    "s1_q2": "structured",
    "s1_q3": "team_wisdom",
    "s1_q4": "analytical",
    "s1_q5": "independent",
    "s1_q6": "team_mentor",
    "s1_q7": "hands-on",
    "s1_q8": "team_synergy",
    "s1_q9": "flexible"
  },
  "workStyle": {
    "hands-on": 8,
    "practical": 7,
    "self-directed": 6,
    "structured": 5,
    "team": 4, // Combined score of all team_* values
    "creative": 3
  },
  "cognitiveStrength": {
    "skills": 9,
    "spatial": 8,
    "mechanical": 7,
    "logical": 5,
    "verbal": 4,
    "problem-solving": 6
  },
  "socialApproach": {
    "independent": 8,
    "supportive": 6,
    "practical": 7,
    "direct": 5,
    "reserved": 6
  },
  "motivation": {
    "mastery": 9,
    "creating": 8,
    "autonomy": 8,
    "rewards": 7,
    "security": 7,
    "helping": 6,
    "recognition": 4
  },
  "interests": [
    {"interest": "building", "percentage": 85},
    {"interest": "mechanical", "percentage": 80},
    {"interest": "repairing", "percentage": 75},
    {"interest": "technology", "percentage": 65},
    {"interest": "design", "percentage": 60},
    {"interest": "business", "percentage": 40}
  ],
  "miniGameMetrics": {
    "handEyeCoordination": 90,
    "spatialAwareness": 85,
    "dexterityLevel": 88,
    "detailOrientation": 78,
    "decisionSpeed": 65,
    "patternRecognition": 70,
    "brainDominance": "balanced",
    "planningStyle": "planner",
    "stressResponse": "improves"
  }
};

export default function AlgorithmDemo() {
  const [results, setResults] = useState<any>(null);
  const [matchDetails, setMatchDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Process the quiz responses
    const quizResults = processQuizResponses(sampleQuizResponses);
    
    // Generate career matches
    const matches = generateCareerMatches(quizResults);
    
    setResults(quizResults);
    setMatchDetails(matches);
    setLoading(false);
    
    // Output quiz results to console for inspection
    console.log('CAREER ASSESSMENT ALGORITHM - COMPLETE RESULTS');
    console.log('============================================');
    console.log('QUIZ RESULTS:', quizResults);
    console.log('CAREER MATCHES:', matches);
  }, []);

  if (loading) {
    return <div className="p-8">Loading algorithm results...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Career Assessment Algorithm Demo</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">User Profile Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Top Work Styles:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(results.workStyle)
                .sort(([,a]: any, [,b]: any) => b - a)
                .slice(0, 3)
                .map(([style, score]: any) => (
                  <li key={style}>{style} ({score})</li>
                ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Top Cognitive Strengths:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(results.cognitiveStrength)
                .sort(([,a]: any, [,b]: any) => b - a)
                .slice(0, 3)
                .map(([strength, score]: any) => (
                  <li key={strength}>{strength} ({score})</li>
                ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Top Motivations:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(results.motivation)
                .sort(([,a]: any, [,b]: any) => b - a)
                .slice(0, 3)
                .map(([motivation, score]: any) => (
                  <li key={motivation}>{motivation} ({score})</li>
                ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Top Interests:</h3>
            <ul className="list-disc pl-5">
              {results.interests
                .slice(0, 3)
                .map((item: any) => (
                  <li key={item.interest}>{item.interest} ({item.percentage}%)</li>
                ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium">Mini-Game Metrics:</h3>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {Object.entries(results.miniGameMetrics || {})
              .map(([metric, value]: any) => (
                <div key={metric} className="text-sm">
                  <span className="font-medium">{metric}:</span> {value}
                </div>
              ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Scoring Category Percentages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Interest Score (20%)</span>
                <span className="font-semibold">{results?.percentages?.interest?.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{width: `${results?.percentages?.interest}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Work Style (15%)</span>
                <span className="font-semibold">{results?.percentages?.workStyle?.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{width: `${results?.percentages?.workStyle}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Cognitive Strength (15%)</span>
                <span className="font-semibold">{results?.percentages?.cognitive?.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{width: `${results?.percentages?.cognitive}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Social Approach (10%)</span>
                <span className="font-semibold">{results?.percentages?.social?.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{width: `${results?.percentages?.social}%`}}></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Motivation (20%)</span>
                <span className="font-semibold">{results?.percentages?.motivation?.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{width: `${results?.percentages?.motivation}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Mini-Game Bonus (10%)</span>
                <span className="font-semibold">{results?.percentages?.miniGame?.toFixed(1) || '0.0'}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{width: `${results?.percentages?.miniGame || 0}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Trade Career Bonus (10%)</span>
                <span className="font-semibold">{results?.percentages?.tradeCareer?.toFixed(1) || '0.0'}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{width: `${results?.percentages?.tradeCareer || 0}%`}}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-1">
                <span>TOTAL MATCH</span>
                <span>{results?.percentages?.total?.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full" style={{width: `${results?.percentages?.total}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Career Matches</h2>
        <div className="grid gap-4">
          {matchDetails.map((match, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{match.title}</h3>
                <div className="text-lg font-bold text-green-600">{match.match}% Match</div>
              </div>
              
              <p className="mt-2 text-gray-700">{match.description}</p>
              
              <div className="mt-3 flex justify-between">
                <div>
                  <span className="font-medium">Salary:</span> {match.salary}
                </div>
                <div>
                  <span className="font-medium">Growth:</span> {match.growth}
                </div>
              </div>
              
              <div className="mt-3">
                <span className="font-medium">Required Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {match.skills.slice(0, 5).map((skill: string, i: number) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                  {match.skills.length > 5 && (
                    <span className="text-gray-500 text-xs py-1">+{match.skills.length - 5} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6 mt-8">
        <h2 className="text-lg font-semibold mb-2">Team-Oriented Value Aggregation</h2>
        <p className="text-sm mb-3">This algorithm uses smart value aggregation to combine varied team-oriented responses:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <h3 className="font-medium text-sm mb-1">Original Responses:</h3>
            <ul className="text-xs space-y-1 bg-white p-2 rounded">
              <li><span className="font-mono bg-gray-100 px-1 rounded">team_wisdom</span> - Valuing collective knowledge</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">team_mentor</span> - Preference for teaching others</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">team_synergy</span> - Belief in collaborative power</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">team_adaptable</span> - Adjusting with the group</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">team_inspire</span> - Creating connections</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-1">Algorithm Processing:</h3>
            <pre className="text-xs bg-gray-800 text-white p-2 rounded whitespace-pre-wrap">
{`// In quizLogic.ts
if (answer.startsWith('team_') || answer === 'team') {
  results.workStyle['team']++;
}`}
            </pre>
            <p className="text-xs mt-2">This creates a unified "team" score while preserving response specificity for detailed analytics.</p>
          </div>
        </div>
        
        <div className="text-xs bg-yellow-100 p-2 rounded">
          <strong>Key Advantage:</strong> This approach allows us to track what <em>type</em> of team collaboration each user prefers
          (mentoring, wisdom-sharing, adaptability, etc.) while still maintaining a unified category for career matching.
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Check the browser console for complete algorithm output details.</p>
      </div>
    </div>
  );
}