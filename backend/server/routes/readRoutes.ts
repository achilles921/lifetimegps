import type { Router } from "express";
import { storage } from "../storage";
import { cacheMiddleware } from "../services/cacheService";

/**
 * Register read-only routes
 */
export function registerReadRoutes(router: Router): void {
  // Guest session read route - with caching
  router.get(`/guest-session/:id`, cacheMiddleware(60), async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getGuestSession(id);

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get career roadmap with caching
  router.get(`/roadmap/:sessionId/:careerPath`, cacheMiddleware(300), async (req, res) => {
    try {
      const { sessionId, careerPath } = req.params;
      const session = await storage.getGuestSession(sessionId);

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Check if the roadmap is already cached in the session data
      if (session.roadmapData && 
          typeof session.roadmapData === 'object' && 
          'careerPath' in session.roadmapData &&
          session.roadmapData.careerPath === careerPath) {
        return res.json({
          sessionId,
          careerPath,
          roadmap: session.roadmapData
        });
      }

      // If no cached roadmap, redirect to the POST endpoint
      res.status(307).json({
        message: "Roadmap not generated yet. Please use POST /api/roadmap to generate it first."
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get quiz progress for session restoration
  router.get(`/quiz-progress`, async (req, res) => {
    try {
      // Get session ID from cookies and look up user
      const sessionId = req.cookies?.sessionId;
      let userIdFromSession = null;

      if (sessionId) {
        try {
          const { pool } = await import('../db');
          const sessionQuery = `SELECT email FROM user_sessions WHERE session_id = $1 AND expires_at > NOW()`;
          const sessionResult = await pool.query(sessionQuery, [sessionId]);

          if (sessionResult.rows.length > 0) {
            const userEmail = sessionResult.rows[0].email;
            // Get user ID from email
            const userQuery = `SELECT id FROM users WHERE email = $1 OR username = $1`;
            const userResult = await pool.query(userQuery, [userEmail]);

            if (userResult.rows.length > 0) {
              userIdFromSession = userResult.rows[0].id;
            }
          }
        } catch (error) {
          console.error('Error getting user from session:', error);
        }
      }

      const userIdFromCookie = userIdFromSession || req.cookies?.userId;

      if (!userIdFromCookie) {
        return res.status(401).json({ message: "Unauthorized - no user session" });
      }

      const user = await storage.getUserById(userIdFromCookie);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const quizData = await storage.getQuizResponses(user.id);

      if (!quizData || quizData.isCompleted) {
        return res.json({ 
          hasProgress: false,
          currentSector: 1,
          sectorResponses: {},
          completedSectors: 0
        });
      }

      // Determine the current sector based on completion status
      const sectorResponses = (quizData.sectorResponses as Record<string, any>) || {};
      let currentSector = 1;

      // Check each sector to find where the user should be
      const sectorQuestionCounts = { 1: 15, 2: 10, 3: 15, 4: 10, 5: 1 };

      // Find the first incomplete sector
      for (let i = 1; i <= 5; i++) {
        const sectorData = sectorResponses[`sector${i}`];

        if (!sectorData || Object.keys(sectorData).length === 0) {
          // No progress in this sector - user should be here
          currentSector = i;
          break;
        } else {
          // This sector has some progress - check if it's complete
          const responseCount = Object.keys(sectorData).length;
          const expectedCount = sectorQuestionCounts[i as keyof typeof sectorQuestionCounts];

          // For sectors 1-4, require substantial completion (80%) before moving on
          if (i <= 4 && responseCount < expectedCount * 0.8) {
            // Sector is not complete enough - stay here
            currentSector = i;
            break;
          } else if (i === 5) {
            // Sector 5 (interest selection) - any progress means we're done
            currentSector = 5;
            break;
          } else {
            // Sector is complete enough, continue to check next sector
            currentSector = i + 1;
          }
        }
      }

      // Ensure we don't go beyond sector 5
      if (currentSector > 5) {
        currentSector = 5;
      }

      console.log(`Retrieved quiz progress for user ID ${userIdFromCookie}: sector ${currentSector}`);

      res.json({
        hasProgress: true,
        currentSector: currentSector,
        sectorResponses: sectorResponses,
        completedSectors: quizData.completedSectors || 0,
        isCompleted: quizData.isCompleted || false
      });
    } catch (error) {
      console.error("Error fetching quiz progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Add other read-only routes as needed
}