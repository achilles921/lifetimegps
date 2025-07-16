// This is an example of how to integrate the CareerOverlapHandler into the results page
// This is not meant to be used directly, but as a reference for implementation

import React, { useState } from 'react';
import CareerOverlapHandler from './CareerOverlapHandler';

const ResultsPageExample = () => {
  // State for original matches from the main algorithm
  const [careerMatches, setCareerMatches] = useState([
    { title: "Marketing Manager", match: 85 },
    { title: "Business Development Manager", match: 82 },
    { title: "Sales Manager", match: 80 },
    { title: "Entrepreneur/Business Owner", match: 78 },
    { title: "Product Manager", match: 75 }
  ]);

  // State for refined matches after handling overlaps
  const [refinedMatches, setRefinedMatches] = useState(careerMatches);
  
  // State for explanations about adjustments
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  // Handle refined matches from the overlap quiz
  const handleRefinedMatches = (
    newRefinedMatches: Array<{title: string; match: number}>,
    newExplanations: Record<string, string>
  ) => {
    setRefinedMatches(newRefinedMatches);
    setExplanations(newExplanations);
  };

  return (
    <div>
      {/* Career Overlap Handler - will only show if there's an overlap */}
      <CareerOverlapHandler 
        careerMatches={careerMatches}
        onRefinedMatches={handleRefinedMatches}
      />
      
      {/* Display career results using refinedMatches instead of original matches */}
      <div>
        <h2>Your Career Matches</h2>
        <div>
          {refinedMatches.map((career, index) => (
            <div key={index}>
              <h3>{career.title}</h3>
              <div>Match: {career.match}%</div>
              
              {/* Show explanation if available */}
              {explanations[career.title] && (
                <div className="text-sm italic">
                  {explanations[career.title]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPageExample;