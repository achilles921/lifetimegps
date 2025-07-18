import { Career } from "@/data/careerData";

/**
 * This utility function helps import careers from various data sources
 * and converts them to the Career interface format used in the application.
 * 
 * Usage example:
 * 1. Export your Excel sheet to CSV or JSON
 * 2. Use this function to convert the data to the right format
 * 3. Save the output to careerData.ts or a separate file to be imported
 */

interface RawCareerData {
  id?: string;
  title: string;
  description: string;
  skills?: string | string[];
  relatedInterests?: number[] | string;
  salary?: string;
  growth?: string;
  workEnvironment?: string;
  workStyle?: string | string[];
  educationPath?: string;
  imagePath?: string;
  shadowingVideoUrl?: string;
  [key: string]: any; // Allow for additional fields that might be in the source data
}

/**
 * Converts raw career data to the Career interface format
 */
export function convertToCareers(rawData: RawCareerData[]): Career[] {
  return rawData.map(data => {
    // Generate an ID if not provided
    const id = data.id || data.title.toLowerCase().replace(/\s+/g, '_');
    
    // Process skills - handle both string and array formats
    let skills: string[];
    if (typeof data.skills === 'string') {
      skills = data.skills.split(',').map(s => s.trim());
    } else {
      skills = data.skills || [];
    }
    
    // Process related interests - handle both string and array formats
    let relatedInterests: number[];
    if (typeof data.relatedInterests === 'string') {
      relatedInterests = data.relatedInterests.split(',').map(i => parseInt(i.trim()));
    } else {
      relatedInterests = data.relatedInterests || [];
    }
    
    // Process work style - handle both string and array formats
    let workStyle: string[];
    if (typeof data.workStyle === 'string') {
      workStyle = data.workStyle.split(',').map(s => s.trim());
    } else {
      workStyle = data.workStyle || [];
    }
    
    const career: Career = {
      id,
      title: data.title,
      description: data.description,
      skills,
      relatedInterests,
      salary: data.salary || "Varies",
      growth: data.growth || "N/A",
      workEnvironment: data.workEnvironment || "Various settings",
      workStyle,
      educationPath: data.educationPath || "Varies by employer",
      imagePath: data.imagePath || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      shadowingVideoUrl: data.shadowingVideoUrl
    };
    
    return career;
  });
}

/**
 * Creates a career entry for direct use in careerData.ts
 */
export function formatCareerEntries(careers: Career[]): string {
  let result = '';
  careers.forEach(career => {
    result += `  {
    id: "${career.id}",
    title: "${career.title}",
    description: "${career.description}",
    skills: [${career.skills.map(s => `"${s}"`).join(', ')}],
    relatedInterests: [${career.relatedInterests.join(', ')}],
    salary: "${career.salary}",
    growth: "${career.growth}",
    workEnvironment: "${career.workEnvironment}",
    workStyle: [${career.workStyle.map(s => `"${s}"`).join(', ')}],
    educationPath: "${career.educationPath}",
    imagePath: "${career.imagePath}"${career.shadowingVideoUrl ? `,
    shadowingVideoUrl: "${career.shadowingVideoUrl}"` : ''}
  },\n`;
  });
  return result;
}

/**
 * Note: To add more careers to the system:
 * 1. Convert your Excel data to JSON
 * 2. Use convertToCareers() to transform it to the right format
 * 3. Either:
 *    a) Copy the output of formatCareerEntries() into careerData.ts, or
 *    b) Save to a separate file and import in careerData.ts
 */