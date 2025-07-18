import type { Router } from "express";
import { storage } from "../storage";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { processQuizResponses, generateCareerMatches as processCareerMatches, generateRoadmap as processRoadmap, type QuizResults } from './../utils/quizLogic';
import { textToSpeech } from "../services/elevenLabsService";
import { invalidatePattern } from "../services/cacheService";

/**
 * Register write routes (data modification)
 */
export function registerWriteRoutes(router: Router): void {
  // ElevenLabs API route for text-to-speech
  router.post(`/elevenlabs/text-to-speech`, async (req, res) => {
    try {
      // Validate required fields
      const { text, voice_id } = req.body;
      if (!text || !voice_id) {
        return res.status(400).json({ error: 'Text and voice_id are required' });
      }

      // Set content-type for audio
      res.setHeader('Content-Type', 'audio/mpeg');

      // Generate speech audio from text
      const audioBuffer = await textToSpeech({
        text,
        voice_id,
        voice_settings: req.body.voice_settings
      });

      // Send audio buffer as response
      res.send(audioBuffer);
    } catch (error: any) {
      console.error('Text to speech error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate speech' });
    }
  });

  // Create guest session
  router.post(`/guest-session`, async (req, res) => {
    try {
      const schema = z.object({
        avatarId: z.number(),
        voiceType: z.string().refine(val => ['male', 'female'].includes(val), {
          message: "Voice type must be either 'male' or 'female'"
        }),
        // voiceId will be determined based on voiceType in the client
        voiceId: z.string().optional(),
        ageGroup: z.string().optional(),
        priorExperience: z.string().optional()
      });

      const validated = schema.parse(req.body);

      // Create a new guest session with basic data
      const sessionData = {
        avatarId: validated.avatarId,
        voiceType: validated.voiceType,
        voiceId: validated.voiceId || (validated.voiceType === 'female' ? 'nora' : 'josh'),
        ageGroup: validated.ageGroup,
        priorExperience: validated.priorExperience
      };

      const session = await storage.createGuestSession(sessionData);

      res.status(201).json(session);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Update guest session
  router.patch(`/guest-session/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getGuestSession(id);

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const updatedSession = await storage.updateGuestSession(id, req.body);

      // Invalidate any cache entries for this session
      await invalidatePattern(`api:guest-session:${id}*`);

      res.json(updatedSession);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Quiz submission for authenticated users
  router.post(`/quiz-responses`, async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string().optional(),
        responses: z.object({
          sector1: z.record(z.string(), z.any()),
          sector2: z.record(z.string(), z.any()),
          sector3: z.record(z.string(), z.any()),
          sector4: z.record(z.string(), z.any()),
          sector5: z.array(z.object({
            interest: z.string(),
            percentage: z.number()
          }))
        })
      });

      const validated = schema.parse(req.body);

      // Check if user is authenticated
      const userEmail = req.headers['x-user-email'] as string;
      console.log(`Quiz submission for userEmail: ${userEmail}`);

      if (userEmail) {
        // Handle authenticated user quiz submission
        console.log(`Processing quiz responses for authenticated user: ${userEmail}`);

        // Get user from database
        const user = await storage.getUserByUsername(userEmail);
        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        // Process the quiz responses and generate career matches using our enhanced algorithm
        console.log("Processing complete quiz responses for authenticated user");
        const careerMatches = await generateCareerMatches(validated.responses);

        // Save quiz responses to dedicated quiz responses table
        try {
          const existingQuizData = await storage.getQuizResponses(user.id);
          if (existingQuizData) {
            await storage.updateQuizResponses(user.id, {
              sectorResponses: validated.responses,
              interestSelections: validated.responses.sector5,
              careerMatches: careerMatches,
              completedSectors: 5,
              isCompleted: true
            });
          } else {
            await storage.createQuizResponses({
              userId: user.id,
              sectorResponses: validated.responses,
              interestSelections: validated.responses.sector5,
              careerMatches: careerMatches,
              completedSectors: 5,
              isCompleted: true
            });
          }
          console.log(`Quiz responses saved to database for user: ${userEmail}`);
        } catch (error) {
          console.error("Error saving quiz responses to database:", error);
        }

        res.json({
          sessionId: validated.sessionId || `user_${user.id}`,
          careerMatches,
          userId: user.id
        });

      } else {
        // Handle guest session (fallback)
        const session = await storage.getGuestSession(validated.sessionId!);

        if (!session) {
          return res.status(404).json({ message: "Session not found" });
        }

        const updatedSession = await storage.updateGuestSession(validated.sessionId!, {
          quizResponses: validated.responses
        });

        // Process the quiz responses and generate career matches using our enhanced algorithm
        console.log("Processing complete quiz responses for guest");
        const careerMatches = await generateCareerMatches(validated.responses);

        await storage.updateGuestSession(validated.sessionId!, {
          careerMatches
        });

        // Invalidate session cache
        await invalidatePattern(`api:guest-session:${validated.sessionId}*`);

        res.json({
          sessionId: validated.sessionId,
          careerMatches
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Save incremental quiz progress
  router.post(`/quiz-progress`, async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        currentSector: z.number(),
        sectorData: z.record(z.string(), z.any()),
        questionId: z.string(),
        answer: z.any(),
        userId: z.string()
      });

      const validated = schema.parse(req.body);

      console.log(`Saving quiz progress for user ID: ${validated.userId}, sector: ${validated.currentSector}`);
      console.log('Sector Data:', validated.sectorData);

      // Get user by ID instead of email
      const user = await storage.getUserById(validated.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

        // Get or create quiz progress record
        let existingQuizData = await storage.getQuizResponses(user.id);

        // Build current progress object
        const currentProgress = (existingQuizData?.sectorResponses as Record<string, any>) || {};

        // Update the specific sector with new progress
        const sectorKey = `sector${validated.currentSector}`;
        currentProgress[sectorKey] = {
          ...(currentProgress[sectorKey] || {}),
          ...validated.sectorData
        };

        // Calculate completed sectors properly - only count sectors that are actually complete
        let completedSectors = 0;
        for (let i = 1; i < validated.currentSector; i++) {
          if (currentProgress[`sector${i}`]) {
            completedSectors = i;
          }
        }

        if (existingQuizData) {
          await storage.updateQuizResponses(user.id, {
            sectorResponses: currentProgress,
            completedSectors: completedSectors,
            isCompleted: false
          });
        } else {
          await storage.createQuizResponses({
            userId: user.id,
            sectorResponses: currentProgress,
            interestSelections: [],
            careerMatches: [],
            completedSectors: completedSectors,
            isCompleted: false
          });
        }

        console.log(`Quiz progress saved for user ID: ${validated.userId}, sector: ${validated.currentSector}`);

        res.json({
          success: true,
          sessionId: validated.sessionId,
          currentSector: validated.currentSector,
          message: "Progress saved"
        });
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error("Error saving quiz progress:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Save incremental quiz progress
  router.post(`/save-interests`, async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        interests: z.array(z.string()),
        userId: z.string()
      });

      const validated = schema.parse(req.body);

      console.log(`Saving interests for user ID: ${validated.userId}`);
      console.log('interests:', validated.interests);

      // Get user by ID instead of email
      const user = await storage.getUserById(validated.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      await storage.updateQuizResponses(user.id, {
        interestSelections: validated.interests,
        completedSectors: 5,
        isCompleted: true
      });

      console.log(`User interests saved for user ID: ${validated.userId}, sector: ${validated.interests}`);

        res.json({
          success: true,
          sessionId: validated.sessionId,
          interests: validated.interests,
          message: "Interests saved"
        });
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error("Error saving quiz progress:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Career roadmap generation
  router.post(`/roadmap`, async (req, res) => {
    try {
      const schema = z.object({
        sessionId: z.string(),
        careerPath: z.string()
      });

      const validated = schema.parse(req.body);
      const session = await storage.getGuestSession(validated.sessionId);

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Generate career roadmap based on the selected career
      // Pass the sessionId to potentially use quiz responses for more personalized roadmaps
      const roadmap = await generateCareerRoadmap(validated.careerPath, validated.sessionId);

      // Store the roadmap in the session for future reference
      await storage.updateGuestSession(validated.sessionId, {
        roadmapData: roadmap,
        selectedCareer: validated.careerPath
      });

      // Invalidate any existing cache for this session's roadmaps
      await invalidatePattern(`api:roadmap:${validated.sessionId}*`);

      res.json({
        sessionId: validated.sessionId,
        careerPath: validated.careerPath,
        roadmap
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
}

// Process quiz responses and generate career matches using our enhanced algorithm
async function generateCareerMatches(quizResponses: any) {
  try {
    console.log("Processing quiz responses to find career matches");

    // For interests-only input, we need to create a partial quiz result
    if (Array.isArray(quizResponses)) {
      // If only interests are provided, create a minimal quiz result structure
      const partialResults = {
        workStyle: {},
        cognitiveStrength: {},
        socialApproach: {},
        motivation: {},
        interests: quizResponses
      };

      return processCareerMatches(partialResults);
    }

    // Process the complete quiz responses
    const processedResults = processQuizResponses(quizResponses);
    console.log("Quiz results processed, generating career matches");

    // Generate career matches based on the processed results
    return processCareerMatches(processedResults);
  } catch (error) {
    console.error('Error generating career matches:', error);

    // Return a fallback set of careers if there's an error in processing
    return [
      {
        title: "Software Developer",
        description: "Create applications and systems that power our digital world.",
        match: 85,
        skills: ["Problem Solving", "Coding", "Critical Thinking"],
        imagePath: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        salary: "$110,140",
        growth: "+22% (2020-2030)"
      },
      {
        title: "UX/UI Designer",
        description: "Create intuitive and engaging user experiences for digital products.",
        match: 80,
        skills: ["Creativity", "User Empathy", "Visual Design"],
        imagePath: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        salary: "$85,650",
        growth: "+13% (2020-2030)"
      },
      {
        title: "Data Scientist",
        description: "Extract valuable insights from complex data to drive business decisions.",
        match: 75,
        skills: ["Analytics", "Programming", "Statistics"],
        imagePath: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        salary: "$100,560",
        growth: "+28% (2020-2030)"
      }
    ];
  }
}

// Generate a personalized career roadmap using our enhanced algorithm
async function generateCareerRoadmap(careerPath: string, sessionId?: string) {
  try {
    console.log(`Generating career roadmap for ${careerPath}`);

    // Get session data if sessionId is provided
    let quizResponses: QuizResults | undefined = undefined;
    let ageGroup = 'teen'; // Default to Gen Z teen demographic
    let priorExperience = 'none'; // Default to no prior experience

    if (sessionId) {
      try {
        const session = await storage.getGuestSession(sessionId);
        if (session) {
          // If we have quiz responses, process them
          if (session.quizResponses) {
            console.log("Using session quiz responses for personalized roadmap");
            quizResponses = processQuizResponses(session.quizResponses);
          }

          // Get age group and prior experience if available
          if (session.ageGroup) {
            ageGroup = session.ageGroup;
          }

          if (session.priorExperience) {
            priorExperience = session.priorExperience;
          }

          console.log(`Using age group: ${ageGroup}, prior experience: ${priorExperience}`);
        }
      } catch (error) {
        console.error("Error retrieving session data for roadmap:", error);
      }
    }

    // Generate a personalized roadmap using our enhanced algorithm
    // Pass ageGroup and priorExperience for more tailored recommendations
    const roadmap = processRoadmap(careerPath, quizResponses, ageGroup, priorExperience);

    return roadmap;
  } catch (error) {
    console.error('Error generating career roadmap:', error);

    // Return a generic roadmap if there's an error
    return {
      careerPath,
      timeline: "2-4 Years",
      investment: "$$$",
      difficulty: "Moderate",
      phases: [
        {
          title: "Build Your Foundation",
          description: "Master fundamentals and basic skills.",
          steps: [
            {
              title: "Learn Core Skills",
              description: "Focus on the essential skills for this field",
              completed: false
            },
            {
              title: "Get Education",
              description: "Formal education or self-learning path",
              completed: false
            },
            {
              title: "Build Basic Projects",
              description: "Create small projects to practice your skills",
              completed: false
            }
          ]
        },
        {
          title: "Specialized Learning",
          description: "Develop specialized skills and knowledge.",
          steps: [
            {
              title: "Choose Your Focus Area",
              description: "Select an area to specialize in",
              completed: false
            },
            {
              title: "Advanced Training",
              description: "Take courses or get certifications",
              completed: false
            },
            {
              title: "Create a Portfolio",
              description: "Showcase your skills and projects",
              completed: false
            }
          ]
        },
        {
          title: "Launch Your Career",
          description: "Enter the industry and grow professionally.",
          steps: [
            {
              title: "Entry-Level Position",
              description: "Gain real-world experience in your field",
              completed: false
            },
            {
              title: "Networking",
              description: "Build connections in your industry",
              completed: false
            },
            {
              title: "Continuous Learning",
              description: "Stay updated with industry trends",
              completed: false
            }
          ]
        }
      ]
    };
  }
}