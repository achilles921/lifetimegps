import { pgTable, text, serial, integer, boolean, jsonb, uuid, timestamp, unique, varchar, decimal, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===============================
// Activity Tracking Model
// ===============================

// Define activity event types
export type ActivityEventType = 
  | 'page_view'
  | 'quiz_start'
  | 'quiz_complete'
  | 'quiz_question_answer'
  | 'career_select'
  | 'voice_select'
  | 'mini_game_start'
  | 'mini_game_complete'
  | 'button_click'
  | 'avatar_select'
  | 'career_roadmap_view'
  | 'external_link_click'
  | 'signup'
  | 'login'
  | 'logout'
  | 'feedback_submit'
  | 'share';

// Activity events schema
export const activityEvents = pgTable('activity_events', {
  id: serial('id').primaryKey(),
  eventId: varchar('event_id', { length: 36 }).notNull(),
  userId: varchar('user_id', { length: 36 }).references(() => users.id),
  sessionId: varchar('session_id', { length: 36 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  path: text('path').notNull(),
  data: jsonb('data'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertActivityEventSchema = createInsertSchema(activityEvents).pick({
  eventId: true,
  userId: true,
  sessionId: true,
  type: true,
  path: true,
  data: true,
  timestamp: true,
});

export type ActivityEvent = typeof activityEvents.$inferSelect;
export type InsertActivityEvent = z.infer<typeof insertActivityEventSchema>;

// Add the necessary Replit Auth tables
// Sessions table for Replit Auth session storage
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  }
);

// ===============================
// User Models
// ===============================

// User profile schema with Replit Auth integration and extended user data
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(), // Use varchar for consistency with foreign keys
  username: varchar("username").unique().notNull(),
  password: varchar("password"), // Add password field for authentication
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  dateOfBirth: timestamp("date_of_birth"), // To calculate age for demographic data
  gender: varchar("gender"), // For demographic analysis
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  customAvatarUrl: text("custom_avatar_url"),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  zipCode: varchar("zip_code"),
  country: varchar("country").default("USA"),
  hobbies: jsonb("hobbies").$type<string[]>(), // Store hobbies separate from career interests
  optimalTimeOfDay: varchar("optimal_time_of_day"), // When user functions best (morning, afternoon, evening)
  travelInterests: jsonb("travel_interests").$type<string[]>(), // Places they're interested in traveling to
  educationLevel: varchar("education_level"), // Current education level
  schoolName: varchar("school_name"), // Current school if applicable
  graduationYear: integer("graduation_year"), // Expected graduation year if applicable
  userType: varchar("user_type").notNull().default("student").$type<"student" | "parent" | "educator" | "company_rep">(),
  privacySettings: jsonb("privacy_settings"), // Control what data can be shared with sponsors
  isMinor: boolean("is_minor").default(false), // Flag for users under 18
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  dateOfBirth: true,
  gender: true,
  bio: true,
  profileImageUrl: true,
  customAvatarUrl: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  hobbies: true,
  optimalTimeOfDay: true,
  travelInterests: true,
  educationLevel: true,
  schoolName: true,
  graduationYear: true,
  userType: true,
  privacySettings: true,
  isMinor: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// ===============================
// User Preferences Model
// ===============================

// User preferences schema with more detailed options
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  avatarId: integer("avatar_id"),
  customAvatarUrl: text("custom_avatar_url"),
  voiceId: text("voice_id").notNull(), // Store the actual voice ID
  voiceType: text("voice_type").notNull(), // "male" or "female"
  accessibilitySettings: jsonb("accessibility_settings"), // Store accessibility preferences
  uiTheme: text("ui_theme").default("default"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  avatarId: true,
  customAvatarUrl: true,
  voiceId: true,
  voiceType: true,
  accessibilitySettings: true,
  uiTheme: true,
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = z.infer<typeof insertUserPreferencesSchema>;

// ===============================
// Quiz Responses Model
// ===============================

// Quiz responses schema with more structured data
export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  sectorResponses: jsonb("sector_responses").notNull(), // Store all responses in JSON format
  interestSelections: jsonb("interest_selections").notNull(), // Store interest percentages
  careerMatches: jsonb("career_matches").notNull(), // Store top career matches
  completedSectors: integer("completed_sectors").default(0), // Track progress
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertQuizResponsesSchema = createInsertSchema(quizResponses).pick({
  userId: true,
  sectorResponses: true,
  interestSelections: true,
  careerMatches: true,
  completedSectors: true,
  isCompleted: true,
});

export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = z.infer<typeof insertQuizResponsesSchema>;

// ===============================
// Career Roadmap Model
// ===============================

// Career roadmap schema with more structured data
export const careerRoadmaps = pgTable("career_roadmaps", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  careerPath: text("career_path").notNull(), // The selected career
  roadmapData: jsonb("roadmap_data").notNull(), // Store the full roadmap data
  completedSteps: jsonb("completed_steps"), // Track which steps are completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCareerRoadmapSchema = createInsertSchema(careerRoadmaps).pick({
  userId: true,
  careerPath: true,
  roadmapData: true,
  completedSteps: true,
});

export type CareerRoadmap = typeof careerRoadmaps.$inferSelect;
export type InsertCareerRoadmap = z.infer<typeof insertCareerRoadmapSchema>;

// Career Match Interface for use in dashboard
export interface CareerMatch {
  id: string;
  title: string;
  match: number;
  description: string;
  skills: string[];
  education: string;
  salary: string;
  outlook: string;
  category: string;
  workSchedule: string;
  youMightLike: string[];
  challenges: string[];
  workplaces: string[];
  colleagues: string[];
  educationPaths: string[];
  certifications: string[];
  advancementPaths: string[];
  // Added for backward compatibility
  growth?: string;
}

// ===============================
// Shadowing Opportunities Model
// ===============================

// Shadowing opportunities tracking
export const shadowingOpportunities = pgTable("shadowing_opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  type: text("type").notNull(), // 'virtual' or 'in-person'
  location: text("location"),
  availability: text("availability").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").notNull().$type<string[]>(),
  link: text("link").notNull(),
  industry: text("industry").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShadowingOpportunitySchema = createInsertSchema(shadowingOpportunities).pick({
  title: true,
  organization: true,
  type: true,
  location: true,
  availability: true,
  description: true,
  requirements: true,
  link: true,
  industry: true,
  imageUrl: true,
});

export type ShadowingOpportunity = typeof shadowingOpportunities.$inferSelect;
export type InsertShadowingOpportunity = z.infer<typeof insertShadowingOpportunitySchema>;

// ===============================
// Shadowing Applications Model
// ===============================

// User shadowing applications
export const shadowingApplications = pgTable("shadowing_applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  opportunityId: integer("opportunity_id").notNull().references(() => shadowingOpportunities.id),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    // Ensure a user can only apply once to each opportunity
    uniqueApplication: unique().on(table.userId, table.opportunityId),
  };
});

export const insertShadowingApplicationSchema = createInsertSchema(shadowingApplications).pick({
  userId: true,
  opportunityId: true,
  notes: true,
});

export type ShadowingApplication = typeof shadowingApplications.$inferSelect;
export type InsertShadowingApplication = z.infer<typeof insertShadowingApplicationSchema>;

// ===============================
// Parent/Guardian Model
// ===============================

// Parent/guardian information for minor users
export const parentGuardians = pgTable("parent_guardians", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id), // Associated minor user (can be null if parent registers first)
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone").notNull(),
  relationship: varchar("relationship").notNull().$type<"parent" | "guardian" | "other">(),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  zipCode: varchar("zip_code"),
  country: varchar("country").default("USA"),
  receiveUpdates: boolean("receive_updates").default(true), // Opt-in for platform updates
  contactPreference: varchar("contact_preference").$type<"email" | "phone" | "both">().default("email"),
  verificationStatus: varchar("verification_status").$type<"pending" | "verified" | "failed">().default("pending"),
  verificationToken: uuid("verification_token").defaultRandom(), // For email verification
  consentProvided: boolean("consent_provided").default(false), // Parental consent required by law
  consentDate: timestamp("consent_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertParentGuardianSchema = createInsertSchema(parentGuardians).pick({
  userId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  relationship: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  receiveUpdates: true,
  contactPreference: true,
});

export type ParentGuardian = typeof parentGuardians.$inferSelect;
export type InsertParentGuardian = z.infer<typeof insertParentGuardianSchema>;

// ===============================
// Learning Preferences Model
// ===============================

// Detailed learning preferences for personalized education
export const learningPreferences = pgTable("learning_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  learningStyle: jsonb("learning_style").$type<{
    visual: number; // 0-100 scale
    auditory: number; 
    kinesthetic: number;
    reading: number;
  }>(),
  preferredEnvironment: jsonb("preferred_environment").$type<string[]>(), // e.g., ["quiet", "group", "outdoor"]
  concentrationTimes: jsonb("concentration_times").$type<{
    morning: number; // 0-100 scale
    afternoon: number;
    evening: number;
    late_night: number;
  }>(),
  challengeLevel: varchar("challenge_level").$type<"easy" | "moderate" | "challenging" | "very_challenging">(),
  pacePreference: varchar("pace_preference").$type<"slow" | "moderate" | "fast" | "self_paced">(),
  feedbackStyle: varchar("feedback_style").$type<"immediate" | "detailed" | "positive_first" | "direct">(),
  goalSetting: jsonb("goal_setting").$type<{
    shortTerm: boolean;
    longTerm: boolean;
    specific: boolean;
    flexible: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLearningPreferencesSchema = createInsertSchema(learningPreferences).pick({
  userId: true,
  learningStyle: true,
  preferredEnvironment: true,
  concentrationTimes: true,
  challengeLevel: true,
  pacePreference: true,
  feedbackStyle: true,
  goalSetting: true,
});

export type LearningPreference = typeof learningPreferences.$inferSelect;
export type InsertLearningPreference = z.infer<typeof insertLearningPreferencesSchema>;

// ===============================
// Security and Data Protection Model
// ===============================

// Security log for tracking sensitive operations
export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id), // Can be null for system events
  eventType: varchar("event_type").notNull().$type<
    "login" | "logout" | "password_change" | "email_change" | 
    "profile_update" | "data_export" | "admin_access" | "failed_login" |
    "password_reset" | "account_lock" | "account_unlock" | "privacy_settings_change" |
    "data_deletion_request" | "personal_data_access"
  >(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  details: jsonb("details"), // Additional context about the event
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Data access log for tracking who accessed what data and when
export const dataAccessLogs = pgTable("data_access_logs", {
  id: serial("id").primaryKey(),
  accessorId: varchar("accessor_id", { length: 36 }).references(() => users.id).notNull(), // Who accessed the data
  targetUserId: varchar("target_user_id", { length: 36 }).references(() => users.id), // Whose data was accessed
  dataCategory: varchar("data_category").notNull().$type<
    "demographics" | "career_preferences" | "learning_preferences" | 
    "contact_info" | "parent_info" | "quiz_results" | "full_profile"
  >(),
  accessReason: text("access_reason").notNull(), // Why the data was accessed
  accessType: varchar("access_type").notNull().$type<"view" | "export" | "analyze" | "share">(),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Data anonymization rules
export const dataAnonymizationRules = pgTable("data_anonymization_rules", {
  id: serial("id").primaryKey(),
  dataCategory: varchar("data_category").notNull().unique().$type<
    "demographics" | "career_preferences" | "learning_preferences" | 
    "contact_info" | "parent_info" | "quiz_results" | "full_profile"
  >(),
  anonymizationLevel: varchar("anonymization_level").notNull().$type<"none" | "partial" | "complete">(),
  retentionPeriodDays: integer("retention_period_days"), // How long to keep the data
  minimumAggregationSize: integer("minimum_aggregation_size"), // Minimum size of data groups for reports
  requiredConsent: boolean("required_consent").default(true), // Whether explicit consent is required
  allowedAccessRoles: jsonb("allowed_access_roles").$type<string[]>(), // Which roles can access this data
  description: text("description").notNull(), // Description of what this rule covers
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===============================
// Sponsor Analytics Model
// ===============================

// Anonymized data snapshots for sponsor analytics
export const anonymizedDataSnapshots = pgTable("anonymized_data_snapshots", {
  id: serial("id").primaryKey(),
  snapshotDate: timestamp("snapshot_date").defaultNow().notNull(),
  dataCategory: varchar("data_category").notNull().$type<
    "demographics" | "career_interests" | "learning_preferences" | 
    "trade_matching" | "user_engagement" | "regional_trends"
  >(),
  ageRangeStart: integer("age_range_start"), // For demographic snapshots
  ageRangeEnd: integer("age_range_end"),
  region: varchar("region"), // Geographic region
  aggregatedData: jsonb("aggregated_data").notNull(), // The aggregated, anonymized data
  totalUsersInSample: integer("total_users_in_sample").notNull(),
  minSampleSize: integer("min_sample_size").notNull(), // Minimum threshold met for privacy
  createdBy: varchar("created_by").notNull(), // Who generated this snapshot
  accessCount: integer("access_count").default(0), // How many times this snapshot was accessed
  validUntil: timestamp("valid_until"), // When this snapshot expires
});

// Sponsors table
export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  contactName: varchar("contact_name").notNull(),
  contactEmail: varchar("contact_email").unique().notNull(),
  contactPhone: varchar("contact_phone"),
  company: varchar("company").notNull(),
  industry: varchar("industry").notNull(),
  website: varchar("website"),
  sponsorshipLevel: varchar("sponsorship_level").$type<"bronze" | "silver" | "gold" | "platinum">(),
  sponsorshipStartDate: timestamp("sponsorship_start_date"),
  sponsorshipEndDate: timestamp("sponsorship_end_date"),
  logo: varchar("logo"),
  dataUsePurpose: text("data_use_purpose").notNull(),
  agreementSigned: boolean("agreement_signed").default(false),
  agreementDate: timestamp("agreement_date"),
  status: varchar("status").default("pending").$type<"pending" | "active" | "expired" | "suspended">(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSponsorSchema = createInsertSchema(sponsors).pick({
  name: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
  company: true,
  industry: true,
  website: true,
  sponsorshipLevel: true,
  sponsorshipStartDate: true,
  sponsorshipEndDate: true,
  logo: true,
  dataUsePurpose: true,
  agreementSigned: true,
  agreementDate: true,
  notes: true,
});

export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;

// Sponsor data access permissions
export const sponsorDataAccess = pgTable("sponsor_data_access", {
  id: serial("id").primaryKey(),
  sponsorId: integer("sponsor_id").notNull().references(() => sponsors.id),
  dataCategory: varchar("data_category").notNull().$type<
    "demographics" | "career_interests" | "learning_preferences" | 
    "trade_matching" | "user_engagement" | "regional_trends"
  >(),
  accessLevel: varchar("access_level").notNull().$type<"basic" | "detailed" | "comprehensive">(),
  grantedBy: varchar("granted_by").notNull(),
  grantedAt: timestamp("granted_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  accessReason: text("access_reason").notNull(),
  dataUseAgreementAccepted: boolean("data_use_agreement_accepted").default(false),
});

// ===============================
// External API Integration Framework
// ===============================

// API provider configurations
export const apiProviders = pgTable("api_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  baseUrl: varchar("base_url").notNull(),
  apiVersion: varchar("api_version"),
  authType: varchar("auth_type").notNull().$type<"key" | "oauth" | "basic" | "token" | "custom">(),
  defaultHeaders: jsonb("default_headers").$type<Record<string, string>>(),
  defaultParams: jsonb("default_params").$type<Record<string, string>>(),
  rateLimit: integer("rate_limit"), // Requests per minute
  status: varchar("status").default("active").$type<"active" | "deprecated" | "disabled">(),
  logo: varchar("logo"),
  documentationUrl: varchar("documentation_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertApiProviderSchema = createInsertSchema(apiProviders).pick({
  name: true,
  description: true,
  baseUrl: true,
  apiVersion: true,
  authType: true,
  defaultHeaders: true,
  defaultParams: true,
  rateLimit: true,
  status: true,
  logo: true,
  documentationUrl: true,
});

export type ApiProvider = typeof apiProviders.$inferSelect;
export type InsertApiProvider = z.infer<typeof insertApiProviderSchema>;

// API credentials securely stored and encrypted
export const apiCredentials = pgTable("api_credentials", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => apiProviders.id),
  keyName: varchar("key_name").notNull(), // Name of the credential (e.g., "API_KEY", "CLIENT_ID", etc.)
  keyValue: varchar("key_value").notNull(), // Encrypted credential value
  isEncrypted: boolean("is_encrypted").default(true),
  isDefault: boolean("is_default").default(false),
  expiresAt: timestamp("expires_at"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    uniqueProviderKeyName: unique().on(table.providerId, table.keyName),
  };
});

export const insertApiCredentialSchema = createInsertSchema(apiCredentials).pick({
  providerId: true,
  keyName: true,
  keyValue: true,
  isEncrypted: true,
  isDefault: true,
  expiresAt: true,
  createdBy: true,
});

export type ApiCredential = typeof apiCredentials.$inferSelect;
export type InsertApiCredential = z.infer<typeof insertApiCredentialSchema>;

// Available API endpoints for each provider
export const apiEndpoints = pgTable("api_endpoints", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => apiProviders.id),
  name: varchar("name").notNull(),
  path: varchar("path").notNull(),
  method: varchar("method").notNull().$type<"GET" | "POST" | "PUT" | "DELETE" | "PATCH">(),
  description: text("description"),
  requiredParams: jsonb("required_params").$type<string[]>(),
  optionalParams: jsonb("optional_params").$type<string[]>(),
  requestBodySchema: jsonb("request_body_schema"), // JSON Schema for request validation
  responseSchema: jsonb("response_schema"), // JSON Schema for response parsing
  rateLimit: integer("rate_limit"), // Endpoint-specific rate limit
  cacheDuration: integer("cache_duration"), // Seconds to cache this endpoint's responses
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertApiEndpointSchema = createInsertSchema(apiEndpoints).pick({
  providerId: true,
  name: true,
  path: true,
  method: true,
  description: true,
  requiredParams: true,
  optionalParams: true,
  requestBodySchema: true,
  responseSchema: true,
  rateLimit: true,
  cacheDuration: true,
  isActive: true,
});

export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;

// API request logs for monitoring and debugging
export const apiRequestLogs = pgTable("api_request_logs", {
  id: serial("id").primaryKey(),
  endpointId: integer("endpoint_id").references(() => apiEndpoints.id),
  requestId: uuid("request_id").defaultRandom().notNull(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  requestUrl: text("request_url").notNull(),
  requestMethod: varchar("request_method").notNull(),
  requestHeaders: jsonb("request_headers"),
  requestBody: jsonb("request_body"),
  responseStatus: integer("response_status"),
  responseHeaders: jsonb("response_headers"),
  responseBody: jsonb("response_body"),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  durationMs: integer("duration_ms"),
  success: boolean("success"),
  errorMessage: text("error_message"),
  cacheHit: boolean("cache_hit").default(false),
  ipAddress: varchar("ip_address"),
});

// API integrations specific to feature areas
export const featureIntegrations = pgTable("feature_integrations", {
  id: serial("id").primaryKey(),
  featureName: varchar("feature_name").notNull(),
  providerId: integer("provider_id").notNull().references(() => apiProviders.id),
  endpointIds: jsonb("endpoint_ids").$type<number[]>(), // Array of API endpoint IDs used by this feature
  configuration: jsonb("configuration").notNull(), // Feature-specific config for this integration
  transformationRules: jsonb("transformation_rules"), // Rules for transforming API responses
  fallbackBehavior: jsonb("fallback_behavior"), // What to do if API fails
  isEnabled: boolean("is_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFeatureIntegrationSchema = createInsertSchema(featureIntegrations).pick({
  featureName: true,
  providerId: true,
  endpointIds: true,
  configuration: true,
  transformationRules: true,
  fallbackBehavior: true,
  isEnabled: true,
});

export type FeatureIntegration = typeof featureIntegrations.$inferSelect;
export type InsertFeatureIntegration = z.infer<typeof insertFeatureIntegrationSchema>;

// ===============================
// Opportunity Serendipity Engine
// ===============================

// Opportunity discovery engine categories
export const opportunityCategories = pgTable("opportunity_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description").notNull(),
  icon: varchar("icon"),
  color: varchar("color"),
  priority: integer("priority").default(10),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Serendipity opportunities - unexpected discoveries based on user profile
export const serendipityOpportunities = pgTable("serendipity_opportunities", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => opportunityCategories.id),
  sourceType: varchar("source_type").$type<"api" | "partner" | "system" | "community" | "recommendation">(),
  sourceId: varchar("source_id"), // ID from external source if applicable
  relevanceFactors: jsonb("relevance_factors").$type<{
    interestMatch: number;  // 0-100
    careerRelevance: number;  // 0-100
    skillGap: number;  // 0-100 (how much it addresses skill gaps)
    novelty: number;  // 0-100 (how unexpected/serendipitous)
    accessibilityMatch: number;  // 0-100 (matches user's constraints/needs)
  }>(),
  externalUrl: varchar("external_url"),
  imageUrl: varchar("image_url"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  location: varchar("location"),
  isVirtual: boolean("is_virtual").default(false),
  tags: jsonb("tags").$type<string[]>(),
  requirements: jsonb("requirements").$type<string[]>(),
  engagementLevel: varchar("engagement_level").$type<"passive" | "light" | "moderate" | "intense">(),
  timeCommitment: varchar("time_commitment"), // e.g., "2 hours", "4 weeks"
  costType: varchar("cost_type").$type<"free" | "paid" | "scholarship-eligible">().default("free"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSerendipityOpportunitySchema = createInsertSchema(serendipityOpportunities).pick({
  title: true,
  description: true,
  categoryId: true,
  sourceType: true,
  sourceId: true,
  relevanceFactors: true,
  externalUrl: true,
  imageUrl: true,
  startDate: true,
  endDate: true,
  location: true,
  isVirtual: true,
  tags: true,
  requirements: true,
  engagementLevel: true,
  timeCommitment: true,
  costType: true,
  cost: true,
  isActive: true,
});

export type SerendipityOpportunity = typeof serendipityOpportunities.$inferSelect;
export type InsertSerendipityOpportunity = z.infer<typeof insertSerendipityOpportunitySchema>;

// User opportunity discoveries and interactions
export const userOpportunityInteractions = pgTable("user_opportunity_interactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  opportunityId: integer("opportunity_id").notNull().references(() => serendipityOpportunities.id),
  discoveryDate: timestamp("discovery_date").defaultNow().notNull(),
  interactionType: varchar("interaction_type").$type<"viewed" | "saved" | "applied" | "participated" | "completed" | "dismissed">(),
  interactionDate: timestamp("interaction_date"),
  userFeedback: integer("user_feedback").$type<1 | 2 | 3 | 4 | 5>(), // 1-5 rating
  feedbackText: text("feedback_text"),
  reminderSet: boolean("reminder_set").default(false),
  reminderDate: timestamp("reminder_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    uniqueUserOpportunity: unique().on(table.userId, table.opportunityId),
  };
});

export const insertUserOpportunityInteractionSchema = createInsertSchema(userOpportunityInteractions).pick({
  userId: true,
  opportunityId: true,
  interactionType: true,
  interactionDate: true,
  userFeedback: true,
  feedbackText: true,
  reminderSet: true,
  reminderDate: true,
});

export type UserOpportunityInteraction = typeof userOpportunityInteractions.$inferSelect;
export type InsertUserOpportunityInteraction = z.infer<typeof insertUserOpportunityInteractionSchema>;

// ===============================
// Gamified Learning Progress Tracker
// ===============================

// Learning badges and achievements
export const learningAchievements = pgTable("learning_achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description").notNull(),
  category: varchar("category").$type<"skill" | "milestone" | "participation" | "streak" | "challenge">(),
  level: varchar("level").$type<"bronze" | "silver" | "gold" | "platinum">(),
  points: integer("points").default(10),
  icon: varchar("icon").notNull(),
  requirements: jsonb("requirements").notNull(), // Criteria to earn this achievement
  hint: text("hint"), // Hint on how to earn without spoiling
  isSecret: boolean("is_secret").default(false), // If true, not shown until earned
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLearningAchievementSchema = createInsertSchema(learningAchievements).pick({
  name: true,
  description: true,
  category: true,
  level: true,
  points: true,
  icon: true,
  requirements: true,
  hint: true,
  isSecret: true,
  isActive: true,
});

export type LearningAchievement = typeof learningAchievements.$inferSelect;
export type InsertLearningAchievement = z.infer<typeof insertLearningAchievementSchema>;

// User achievement progress
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => learningAchievements.id),
  progress: integer("progress").default(0), // 0-100% completion
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  currentStreak: integer("current_streak").default(0), // For streak-based achievements
  highestStreak: integer("highest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    uniqueUserAchievement: unique().on(table.userId, table.achievementId),
  };
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementId: true,
  progress: true,
  isCompleted: true,
  completedAt: true,
  currentStreak: true,
  highestStreak: true,
  lastActivityDate: true,
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

// Learning quests and challenges
export const learningQuests = pgTable("learning_quests", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  type: varchar("type").$type<"exploration" | "skill-building" | "challenge" | "career-advancement">(),
  difficulty: varchar("difficulty").$type<"beginner" | "intermediate" | "advanced" | "expert">(),
  category: varchar("category").notNull(), // Like "trade-skills", "career-discovery", etc.
  imageUrl: varchar("image_url"),
  steps: jsonb("steps").$type<{
    id: string;
    title: string;
    description: string;
    pointsAwarded: number;
    requiresEvidence: boolean;
    estimatedTimeMinutes: number;
  }[]>(),
  totalPoints: integer("total_points").default(0),
  estimatedDuration: varchar("estimated_duration"), // e.g., "2 hours", "3 days" 
  prerequisites: jsonb("prerequisites").$type<number[]>(), // Array of prerequisite quest IDs
  unlockRequirements: jsonb("unlock_requirements"), // Requirements to unlock this quest
  completionCriteria: jsonb("completion_criteria").notNull(), // Requirements to complete
  rewardAchievementIds: jsonb("reward_achievement_ids").$type<number[]>(), // Awarded on completion
  isSequential: boolean("is_sequential").default(true), // If steps must be done in order
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"), // If time-limited
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLearningQuestSchema = createInsertSchema(learningQuests).pick({
  title: true,
  description: true,
  type: true,
  difficulty: true,
  category: true,
  imageUrl: true,
  steps: true,
  totalPoints: true,
  estimatedDuration: true,
  prerequisites: true,
  unlockRequirements: true,
  completionCriteria: true,
  rewardAchievementIds: true,
  isSequential: true,
  isActive: true,
  startDate: true,
  endDate: true,
});

export type LearningQuest = typeof learningQuests.$inferSelect;
export type InsertLearningQuest = z.infer<typeof insertLearningQuestSchema>;

// User quest progress
export const userQuestProgress = pgTable("user_quest_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  questId: integer("quest_id").notNull().references(() => learningQuests.id),
  status: varchar("status").$type<"not_started" | "in_progress" | "paused" | "completed" | "failed">().default("not_started"),
  currentStepId: varchar("current_step_id"),
  completedSteps: jsonb("completed_steps").$type<string[]>(), // Array of completed step IDs
  pointsEarned: integer("points_earned").default(0),
  startedAt: timestamp("started_at"),
  lastActivityAt: timestamp("last_activity_at"),
  completedAt: timestamp("completed_at"),
  evidence: jsonb("evidence"), // User-submitted evidence of completion
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    uniqueUserQuest: unique().on(table.userId, table.questId),
  };
});

export const insertUserQuestProgressSchema = createInsertSchema(userQuestProgress).pick({
  userId: true,
  questId: true,
  status: true,
  currentStepId: true,
  completedSteps: true,
  pointsEarned: true,
  startedAt: true,
  lastActivityAt: true,
  completedAt: true,
  evidence: true,
  notes: true,
});

export type UserQuestProgress = typeof userQuestProgress.$inferSelect;
export type InsertUserQuestProgress = z.infer<typeof insertUserQuestProgressSchema>;

// ===============================
// Guest Sessions Model
// ===============================

// Guest Sessions schema with improved structure
export const guestSessions = pgTable("guest_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  avatarId: integer("avatar_id"),
  voiceId: text("voice_id").notNull(),
  voiceType: text("voice_type").notNull(), // "male" or "female"
  ageGroup: text("age_group"), // "teen", "young-adult", "adult", "career-changer"
  priorExperience: text("prior_experience"), // "none", "some", "experienced"
  quizResponses: jsonb("quiz_responses"),
  interestSelections: jsonb("interest_selections"),
  careerMatches: jsonb("career_matches"),
  currentSector: integer("current_sector").default(1),
  currentScreen: text("current_screen").default("onboarding"),
  selectedCareer: text("selected_career"),
  roadmapData: jsonb("roadmap_data"),
  createdAt: timestamp("created_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // When the guest session expires
});

export const insertGuestSessionSchema = createInsertSchema(guestSessions).pick({
  avatarId: true,
  voiceId: true,
  voiceType: true,
  ageGroup: true,
  priorExperience: true,
  quizResponses: true,
  interestSelections: true,
  careerMatches: true,
  currentSector: true,
  currentScreen: true,
  selectedCareer: true,
  roadmapData: true,
});

export type GuestSession = typeof guestSessions.$inferSelect;
export type InsertGuestSession = z.infer<typeof insertGuestSessionSchema>;

// ===============================
// Trade Company Models
// ===============================

// Company size categories for pricing tiers
export const companySizeEnum = {
  TIER_1: "fewer-than-25",
  TIER_2: "26-50",
  TIER_3: "51-250",
  TIER_4: "251-500",
  TIER_5: "501-plus",
} as const;

// Trade company schema
export const tradeCompanies = pgTable("trade_companies", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").unique().notNull(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id), // Company admin
  email: varchar("email").unique().notNull(),
  phone: varchar("phone"),
  website: varchar("website"),
  description: text("description"),
  logo: varchar("logo"),
  industry: varchar("industry").notNull(),
  companySize: varchar("company_size").notNull().$type<keyof typeof companySizeEnum>(),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  zip: varchar("zip"),
  country: varchar("country").default("USA"),
  isVerified: boolean("is_verified").default(false),
  status: varchar("status").default("pending").$type<"pending" | "active" | "suspended">(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTradeCompanySchema = createInsertSchema(tradeCompanies).pick({
  name: true,
  slug: true,
  userId: true,
  email: true,
  phone: true,
  website: true,
  description: true,
  logo: true,
  industry: true,
  companySize: true,
  address: true,
  city: true,
  state: true,
  zip: true,
  country: true,
});

export type TradeCompany = typeof tradeCompanies.$inferSelect;
export type InsertTradeCompany = z.infer<typeof insertTradeCompanySchema>;

// ===============================
// Subscription Plans Model
// ===============================

// Subscription plan tiers
export const subscriptionTierEnum = {
  BASIC: "basic",
  STANDARD: "standard",
  PREMIUM: "premium",
  ENTERPRISE: "enterprise",
} as const;

// Billing interval options
export const billingIntervalEnum = {
  MONTHLY: "monthly",
  ANNUAL: "annual",
} as const;

// Subscription plans schema
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  tier: varchar("tier").notNull().$type<keyof typeof subscriptionTierEnum>(),
  companySize: varchar("company_size").notNull().$type<keyof typeof companySizeEnum>(),
  description: text("description").notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  priceMonthly: decimal("price_monthly", { precision: 10, scale: 2 }).notNull(),
  priceAnnual: decimal("price_annual", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  maxJobPostings: integer("max_job_postings").notNull(),
  maxCandidateSearches: integer("max_candidate_searches").notNull().default(0),
  maxRecruitmentRequests: integer("max_recruitment_requests").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).pick({
  name: true,
  tier: true,
  companySize: true,
  description: true,
  features: true,
  priceMonthly: true,
  priceAnnual: true,
  isActive: true,
  maxJobPostings: true,
  maxCandidateSearches: true,
  maxRecruitmentRequests: true,
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

// Company subscriptions schema
export const companySubscriptions = pgTable("company_subscriptions", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => tradeCompanies.id),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  status: varchar("status").notNull().$type<"active" | "canceled" | "past_due" | "unpaid" | "paused">().default("active"),
  billingInterval: varchar("billing_interval").notNull().$type<keyof typeof billingIntervalEnum>(),
  startDate: timestamp("start_date").notNull().defaultNow(),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  stripeCustomerId: varchar("stripe_customer_id").notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    // Each company can only have one active subscription at a time
    uniqueCompanySubscription: unique().on(table.companyId),
  };
});

export const insertCompanySubscriptionSchema = createInsertSchema(companySubscriptions).pick({
  companyId: true,
  planId: true,
  status: true,
  billingInterval: true,
  startDate: true,
  currentPeriodEnd: true,
  cancelAtPeriodEnd: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  metadata: true,
});

export type CompanySubscription = typeof companySubscriptions.$inferSelect;
export type InsertCompanySubscription = z.infer<typeof insertCompanySubscriptionSchema>;

// ===============================
// Job Postings and Recruitment Model
// ===============================

// Job postings from trade companies
export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => tradeCompanies.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").notNull().$type<string[]>(),
  responsibilities: jsonb("responsibilities").notNull().$type<string[]>(),
  location: varchar("location").notNull(),
  salary: varchar("salary"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  jobType: varchar("job_type").notNull().$type<"full-time" | "part-time" | "contract" | "apprenticeship" | "internship">(),
  remote: boolean("remote").default(false),
  industry: varchar("industry").notNull(),
  experience: varchar("experience").$type<"entry-level" | "mid-level" | "senior" | "management">(),
  slug: varchar("slug").notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).pick({
  companyId: true,
  title: true,
  description: true,
  requirements: true,
  responsibilities: true,
  location: true,
  salary: true,
  salaryMin: true,
  salaryMax: true,
  jobType: true,
  remote: true,
  industry: true,
  experience: true,
  slug: true,
  isActive: true,
  expiresAt: true,
});

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;

// Job applications from users
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  jobId: integer("job_id").notNull().references(() => jobPostings.id),
  coverLetter: text("cover_letter"),
  resumeUrl: varchar("resume_url"),
  status: varchar("status").notNull().$type<"pending" | "reviewing" | "interviewed" | "offered" | "hired" | "rejected">().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    // Each user can only apply to a job once
    uniqueJobApplication: unique().on(table.userId, table.jobId),
  };
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).pick({
  userId: true,
  jobId: true,
  coverLetter: true,
  resumeUrl: true,
  status: true,
  notes: true,
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;

// Recruitment service requests
export const recruitmentRequests = pgTable("recruitment_requests", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => tradeCompanies.id),
  jobTitle: varchar("job_title").notNull(),
  jobDescription: text("job_description").notNull(),
  requirements: jsonb("requirements").notNull().$type<string[]>(),
  compensationRange: varchar("compensation_range").notNull(),
  location: varchar("location").notNull(),
  numberOfPositions: integer("number_of_positions").notNull().default(1),
  urgency: varchar("urgency").notNull().$type<"low" | "medium" | "high">(),
  status: varchar("status").notNull().$type<"pending" | "in_progress" | "completed" | "cancelled">().default("pending"),
  fee: decimal("fee", { precision: 10, scale: 2 }),
  targetDate: timestamp("target_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRecruitmentRequestSchema = createInsertSchema(recruitmentRequests).pick({
  companyId: true,
  jobTitle: true,
  jobDescription: true,
  requirements: true,
  compensationRange: true,
  location: true,
  numberOfPositions: true,
  urgency: true,
  targetDate: true,
  notes: true,
});

export type RecruitmentRequest = typeof recruitmentRequests.$inferSelect;
export type InsertRecruitmentRequest = z.infer<typeof insertRecruitmentRequestSchema>;

// ===============================
// Mini-Game Performance Model
// ===============================

export const miniGamePerformance = pgTable("mini_game_performance", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  gameId: varchar("game_id").notNull(),
  metrics: jsonb("metrics").notNull().$type<Record<string, any>>(),
  completed: boolean("completed").default(false),
  difficulty: integer("difficulty").default(1),
  score: integer("score").notNull(),
  completionTime: doublePrecision("completion_time"),
  accuracy: doublePrecision("accuracy"),
  visualProcessing: integer("visual_processing"),
  auditoryProcessing: integer("auditory_processing"),
  motorControl: integer("motor_control"),
  patternRecognition: integer("pattern_recognition"),
  decisionSpeed: integer("decision_speed"),
  responseConsistency: integer("response_consistency"),
  spatialAwareness: integer("spatial_awareness"),
  multitaskingAbility: integer("multitasking_ability"),
  memoryCapacity: integer("memory_capacity"),
  processingSpeed: integer("processing_speed"),
  createdAt: timestamp("created_at").defaultNow(),
  sessionId: varchar("session_id"),
  isPractice: boolean("is_practice").default(false)
});

export const insertMiniGamePerformanceSchema = createInsertSchema(miniGamePerformance).omit({
  id: true,
  createdAt: true
});

export type MiniGamePerformance = typeof miniGamePerformance.$inferSelect;
export type InsertMiniGamePerformance = z.infer<typeof insertMiniGamePerformanceSchema>;

// ===============================
// Schema Relations
// ===============================

// Define relations after all tables are defined
export const usersRelations = relations(users, ({ many, one }) => ({
  userPreferences: many(userPreferences),
  quizResponses: many(quizResponses),
  careerRoadmaps: many(careerRoadmaps),
  shadowingApplications: many(shadowingApplications),
  jobApplications: many(jobApplications),
  tradeCompanies: many(tradeCompanies),
  parentGuardian: one(parentGuardians, { fields: [users.id], references: [parentGuardians.userId] }),
  learningPreferences: one(learningPreferences, { fields: [users.id], references: [learningPreferences.userId] }),
  miniGamePerformances: many(miniGamePerformance),
  securityLogs: many(securityLogs),
  dataAccessesAsAccessor: many(dataAccessLogs, { relationName: "data_accessor" }),
  dataAccessesAsTarget: many(dataAccessLogs, { relationName: "data_target" }),
  apiRequests: many(apiRequestLogs),
  opportunityInteractions: many(userOpportunityInteractions),
  achievements: many(userAchievements),
  questProgress: many(userQuestProgress),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));

export const quizResponsesRelations = relations(quizResponses, ({ one }) => ({
  user: one(users, {
    fields: [quizResponses.userId],
    references: [users.id],
  }),
}));

export const careerRoadmapsRelations = relations(careerRoadmaps, ({ one }) => ({
  user: one(users, {
    fields: [careerRoadmaps.userId],
    references: [users.id],
  }),
}));

export const shadowingApplicationsRelations = relations(shadowingApplications, ({ one }) => ({
  user: one(users, {
    fields: [shadowingApplications.userId],
    references: [users.id],
  }),
  opportunity: one(shadowingOpportunities, {
    fields: [shadowingApplications.opportunityId],
    references: [shadowingOpportunities.id],
  }),
}));

export const shadowingOpportunitiesRelations = relations(shadowingOpportunities, ({ many }) => ({
  applications: many(shadowingApplications),
}));

export const tradeCompaniesRelations = relations(tradeCompanies, ({ one, many }) => ({
  admin: one(users, {
    fields: [tradeCompanies.userId],
    references: [users.id],
  }),
  subscription: one(companySubscriptions, {
    fields: [tradeCompanies.id],
    references: [companySubscriptions.companyId],
  }),
  jobPostings: many(jobPostings),
  recruitmentRequests: many(recruitmentRequests),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(companySubscriptions),
}));

export const companySubscriptionsRelations = relations(companySubscriptions, ({ one }) => ({
  company: one(tradeCompanies, {
    fields: [companySubscriptions.companyId],
    references: [tradeCompanies.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [companySubscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}));

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  company: one(tradeCompanies, {
    fields: [jobPostings.companyId],
    references: [tradeCompanies.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  user: one(users, {
    fields: [jobApplications.userId],
    references: [users.id],
  }),
  job: one(jobPostings, {
    fields: [jobApplications.jobId],
    references: [jobPostings.id],
  }),
}));

export const recruitmentRequestsRelations = relations(recruitmentRequests, ({ one }) => ({
  company: one(tradeCompanies, {
    fields: [recruitmentRequests.companyId],
    references: [tradeCompanies.id],
  }),
}));

// Relations for new tables
export const miniGamePerformanceRelations = relations(miniGamePerformance, ({ one }) => ({
  user: one(users, {
    fields: [miniGamePerformance.userId],
    references: [users.id],
  }),
}));

export const parentGuardiansRelations = relations(parentGuardians, ({ one }) => ({
  user: one(users, {
    fields: [parentGuardians.userId],
    references: [users.id],
  }),
}));

export const learningPreferencesRelations = relations(learningPreferences, ({ one }) => ({
  user: one(users, {
    fields: [learningPreferences.userId],
    references: [users.id],
  }),
}));

export const securityLogsRelations = relations(securityLogs, ({ one }) => ({
  user: one(users, {
    fields: [securityLogs.userId],
    references: [users.id],
    relationName: "security_logs_user",
  }),
}));

export const dataAccessLogsRelations = relations(dataAccessLogs, ({ one }) => ({
  accessor: one(users, {
    fields: [dataAccessLogs.accessorId],
    references: [users.id],
    relationName: "data_accessor",
  }),
  targetUser: one(users, {
    fields: [dataAccessLogs.targetUserId],
    references: [users.id],
    relationName: "data_target",
  }),
}));

export const sponsorsRelations = relations(sponsors, ({ many }) => ({
  dataAccess: many(sponsorDataAccess),
}));

export const sponsorDataAccessRelations = relations(sponsorDataAccess, ({ one }) => ({
  sponsor: one(sponsors, {
    fields: [sponsorDataAccess.sponsorId],
    references: [sponsors.id],
  }),
}));

// External API Integration Relations
export const apiProvidersRelations = relations(apiProviders, ({ many }) => ({
  credentials: many(apiCredentials),
  endpoints: many(apiEndpoints),
  featureIntegrations: many(featureIntegrations),
}));

export const apiCredentialsRelations = relations(apiCredentials, ({ one }) => ({
  provider: one(apiProviders, {
    fields: [apiCredentials.providerId],
    references: [apiProviders.id],
  }),
}));

export const apiEndpointsRelations = relations(apiEndpoints, ({ one, many }) => ({
  provider: one(apiProviders, {
    fields: [apiEndpoints.providerId],
    references: [apiProviders.id],
  }),
  logs: many(apiRequestLogs),
}));

export const apiRequestLogsRelations = relations(apiRequestLogs, ({ one }) => ({
  endpoint: one(apiEndpoints, {
    fields: [apiRequestLogs.endpointId],
    references: [apiEndpoints.id],
  }),
  user: one(users, {
    fields: [apiRequestLogs.userId],
    references: [users.id],
  }),
}));

export const featureIntegrationsRelations = relations(featureIntegrations, ({ one }) => ({
  provider: one(apiProviders, {
    fields: [featureIntegrations.providerId],
    references: [apiProviders.id],
  }),
}));

// Opportunity Serendipity Engine Relations
export const opportunityCategoriesRelations = relations(opportunityCategories, ({ many }) => ({
  opportunities: many(serendipityOpportunities),
}));

export const serendipityOpportunitiesRelations = relations(serendipityOpportunities, ({ one, many }) => ({
  category: one(opportunityCategories, {
    fields: [serendipityOpportunities.categoryId],
    references: [opportunityCategories.id],
  }),
  userInteractions: many(userOpportunityInteractions),
}));

export const userOpportunityInteractionsRelations = relations(userOpportunityInteractions, ({ one }) => ({
  user: one(users, {
    fields: [userOpportunityInteractions.userId],
    references: [users.id],
  }),
  opportunity: one(serendipityOpportunities, {
    fields: [userOpportunityInteractions.opportunityId],
    references: [serendipityOpportunities.id],
  }),
}));

// Gamified Learning Progress Tracker Relations
export const learningAchievementsRelations = relations(learningAchievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(learningAchievements, {
    fields: [userAchievements.achievementId],
    references: [learningAchievements.id],
  }),
}));

export const learningQuestsRelations = relations(learningQuests, ({ many }) => ({
  userProgress: many(userQuestProgress),
}));

export const userQuestProgressRelations = relations(userQuestProgress, ({ one }) => ({
  user: one(users, {
    fields: [userQuestProgress.userId],
    references: [users.id],
  }),
  quest: one(learningQuests, {
    fields: [userQuestProgress.questId],
    references: [learningQuests.id],
  }),
}));