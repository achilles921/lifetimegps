import { Router} from 'express';
import { activityStorage } from '../activityStorage';
import { log } from '../utils/logging';

const router = Router();

// Track activity events
router.post('/track', async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Invalid events data' });
    }
    
    await activityStorage.trackEvents(events);
    
    res.status(200).json({ success: true, count: events.length });
  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({ error: 'Failed to track activity' });
  }
});

// Get activity events by user ID (admin/staff only)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Check if request is authorized (admin/staff)
    // TODO: Add proper authorization check
    
    const events = await activityStorage.getEventsByUserId(userId, limit ? parseInt(limit as string) : 100);
    
    res.status(200).json({ events });
  } catch (error) {
    console.error('Error getting user activity:', error);
    res.status(500).json({ error: 'Failed to get user activity' });
  }
});

// Get activity events by session ID (admin/staff only)
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Check if request is authorized (admin/staff)
    // TODO: Add proper authorization check
    
    const events = await activityStorage.getEventsBySessionId(sessionId, limit ? parseInt(limit as string) : 100);
    
    res.status(200).json({ events });
  } catch (error) {
    console.error('Error getting session activity:', error);
    res.status(500).json({ error: 'Failed to get session activity' });
  }
});

// Track question response timing data
router.post('/question-timing', async (req, res) => {
  try {
    const timingData = req.body;
    
    if (!timingData || !timingData.questionId || !timingData.responseTimeMs) {
      return res.status(400).json({ error: 'Invalid timing data. Required fields: questionId, responseTimeMs' });
    }
    
    // Create an activity event from the timing data with proper timestamp and event ID
    const event = {
      eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'QUESTION_RESPONSE',
      userId: timingData.userEmail || 'guest',
      sessionId: timingData.sessionId || 'unknown',
      timestamp: new Date(), // Use current server time for consistency
      path: '/quiz/question-response',
      data: {
        questionId: timingData.questionId,
        responseTimeMs: timingData.responseTimeMs,
        sector: timingData.sector || 0,
        clientTimestamp: timingData.timestamp || Date.now()
      }
    };
    
    await activityStorage.trackEvents([event]);
    
    res.status(200).json({ success: true, message: 'Question timing data tracked successfully' });
  } catch (error) {
    console.error('Error tracking question timing:', error);
    res.status(500).json({ error: 'Failed to track question timing data' });
  }
});

// Get question timing data (admin/staff only)
router.get('/question-timing', async (req, res) => {
  try {
    // Check if request is authorized (admin/staff)
    // TODO: Add proper authorization check
    
    // Get all question timing events
    const events = await activityStorage.getEventsByType('QUESTION_RESPONSE', 1000);
    
    // Process events to calculate averages and identify difficult questions
    const questionData: Record<string, { 
      totalTime: number, 
      count: number, 
      avgTime: number,
      sector: number,
      questionId: string
    }> = {};
    
    // Group by question ID and calculate metrics
    events.forEach(event => {
      const eventData = event.data || {};
      const { questionId, responseTimeMs, sector } = eventData;
      if (!questionId || !responseTimeMs) return;
      
      if (!questionData[questionId]) {
        questionData[questionId] = {
          totalTime: 0,
          count: 0,
          avgTime: 0,
          sector: sector || 0,
          questionId
        };
      }
      
      questionData[questionId].totalTime += responseTimeMs;
      questionData[questionId].count += 1;
    });
    
    // Calculate averages
    Object.keys(questionData).forEach(key => {
      const data = questionData[key];
      data.avgTime = Math.round(data.totalTime / data.count);
    });
    
    // Convert to array and sort by average time (descending)
    const sortedQuestions = Object.values(questionData)
      .sort((a, b) => b.avgTime - a.avgTime);
    
    // Identify potential difficult questions (top 25% response times)
    const difficultThreshold = sortedQuestions.length > 0 
      ? sortedQuestions[Math.floor(sortedQuestions.length * 0.25)].avgTime 
      : 0;
    
    const questionTimingAnalysis = {
      questions: sortedQuestions,
      summary: {
        totalQuestions: sortedQuestions.length,
        avgResponseTime: sortedQuestions.length > 0 
          ? Math.round(sortedQuestions.reduce((sum, q) => sum + q.avgTime, 0) / sortedQuestions.length)
          : 0,
        difficultThreshold,
        difficultQuestions: sortedQuestions.filter(q => q.avgTime >= difficultThreshold)
      }
    };
    
    res.status(200).json(questionTimingAnalysis);
  } catch (error) {
    console.error('Error getting question timing data:', error);
    res.status(500).json({ error: 'Failed to get question timing data' });
  }
});

// Get summary of activity by type (admin/staff only)
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Check if request is authorized (admin/staff)
    // TODO: Add proper authorization check
    
    // TODO: Implement summary statistics logic
    
    res.status(200).json({ message: 'Activity summary endpoint' });
  } catch (error) {
    console.error('Error getting activity summary:', error);
    res.status(500).json({ error: 'Failed to get activity summary' });
  }
});

log('Activity routes registered', 'routes');

export default router;