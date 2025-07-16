import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Excel file
const excelFilePath = path.join(__dirname, '../attached_assets/data1.5 03132025_rev.xlsx');

// Process the Excel file
try {
  console.log('Reading Excel file...');
  const workbook = xlsx.readFile(excelFilePath);
  
  // Get sheet names
  const sheetNames = workbook.SheetNames;
  console.log('Available sheets:', sheetNames);
  
  // We'll assume the career data is in the second sheet (index 1)
  const sheetName = sheetNames[1] || sheetNames[0]; // Fallback to first sheet if second doesn't exist
  console.log(`Processing sheet: ${sheetName}`);
  
  // Convert sheet to JSON
  const worksheet = workbook.Sheets[sheetName];
  const rawData = xlsx.utils.sheet_to_json(worksheet);
  
  console.log(`Found ${rawData.length} entries in the sheet`);
  
  // Sample the first entry to see its structure
  if (rawData.length > 0) {
    console.log('Sample entry structure:');
    console.log(JSON.stringify(rawData[0], null, 2));
  }
  
  // Function to convert raw data to the Career format
  function processCareerData(rawData) {
    return rawData.map((row, index) => {
      // Map Excel columns to Career fields
      // We'll need to adjust these based on the actual Excel column names
      
      // Extract title and ensure it exists
      const title = row['Career Title'] || row['Title'] || row['Career'] || `Career ${index + 1}`;
      
      // Generate a slug-like ID from the title
      const id = title.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
      
      // Description field - could be in different columns
      const description = row['Description'] || row['Summary'] || row['About'] || 
                          `Career in ${title} field.`;
      
      // Skills - could be a single string or multiple columns
      let skills = [];
      if (row['Skills']) {
        if (typeof row['Skills'] === 'string') {
          skills = row['Skills'].split(',').map(s => s.trim());
        } else if (Array.isArray(row['Skills'])) {
          skills = row['Skills'];
        }
      }
      // Add additional skill columns if they exist
      for (let i = 1; i <= 5; i++) {
        const skillKey = `Skill${i}`;
        if (row[skillKey] && typeof row[skillKey] === 'string' && row[skillKey].trim() !== '') {
          skills.push(row[skillKey].trim());
        }
      }
      
      // Ensure we have at least some skills
      if (skills.length === 0) {
        skills = ['Problem Solving', 'Communication', 'Technical Knowledge'];
      }
      
      // Related interests - map to numbers needed by the algorithm
      let relatedInterests = [];
      if (row['Related Interests'] && typeof row['Related Interests'] === 'string') {
        // Try to extract numbers from the string
        const matches = row['Related Interests'].match(/\d+/g);
        if (matches) {
          relatedInterests = matches.map(Number);
        }
      }
      // If we couldn't find related interests, assign some default ones
      // based on career category or other attributes
      if (relatedInterests.length === 0) {
        // Use category to assign interests if available
        const category = row['Category'] || row['Field'] || '';
        
        if (category.includes('Technology')) {
          relatedInterests = [13, 14, 21]; // Software Development, Hardware Technology, Cyber Security
        } else if (category.includes('Health')) {
          relatedInterests = [10, 2, 12]; // Health/Wellness, Military, Teaching/Coaching
        } else if (category.includes('Business')) {
          relatedInterests = [16, 6, 17]; // Finance/Data, Real Estate, Writing/Communication
        } else if (category.includes('Creative')) {
          relatedInterests = [8, 15, 5]; // Arts/Performance, Content Creation, Vehicles/Aviation
        } else if (category.includes('Trade')) {
          relatedInterests = [3, 4, 5]; // Skilled Trades, Building/Construction, Vehicles/Aviation
        } else {
          // Default interests if we can't determine anything specific
          relatedInterests = [13, 16, 17]; // Software Development, Finance/Data, Writing/Communication
        }
      }
      
      // Work style
      let workStyle = [];
      if (row['Work Style'] && typeof row['Work Style'] === 'string') {
        workStyle = row['Work Style'].split(',').map(s => s.trim());
      }
      // Default work styles if none provided
      if (workStyle.length === 0) {
        workStyle = ['structured', 'team', 'analytical'];
      }
      
      // Salary information
      const salary = row['Salary'] || row['Income'] || row['Pay'] || 'Varies by experience and location';
      
      // Growth/outlook information
      const growth = row['Growth'] || row['Outlook'] || row['Job Outlook'] || 'Average';
      
      // Work environment
      const workEnvironment = row['Work Environment'] || row['Environment'] || 'Various settings';
      
      // Education path
      const educationPath = row['Education'] || row['Education Path'] || row['Training'] || 
                           'Varies by employer requirements';
      
      // Default image path (could be customized based on category)
      const imagePath = row['Image Path'] || row['Image'] || 
                       'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
      
      return {
        id,
        title,
        description,
        skills,
        relatedInterests,
        salary,
        growth,
        workEnvironment,
        workStyle,
        educationPath,
        imagePath
      };
    });
  }
  
  // Convert the data to our format
  const processedCareers = processCareerData(rawData);
  console.log(`Processed ${processedCareers.length} careers`);
  
  // Format the data for direct inclusion in additionalCareers.ts
  let outputData = 'import { Career } from \'./careerData\';\n\n';
  outputData += 'export const additionalCareers: Career[] = [\n';
  
  processedCareers.forEach(career => {
    outputData += `  {\n`;
    outputData += `    id: "${career.id}",\n`;
    outputData += `    title: "${career.title}",\n`;
    outputData += `    description: "${career.description.replace(/"/g, '\\"')}",\n`;
    outputData += `    skills: [${career.skills.map(s => `"${s.replace(/"/g, '\\"')}"`).join(', ')}],\n`;
    outputData += `    relatedInterests: [${career.relatedInterests.join(', ')}],\n`;
    outputData += `    salary: "${career.salary.replace(/"/g, '\\"')}",\n`;
    outputData += `    growth: "${career.growth.replace(/"/g, '\\"')}",\n`;
    outputData += `    workEnvironment: "${career.workEnvironment.replace(/"/g, '\\"')}",\n`;
    outputData += `    workStyle: [${career.workStyle.map(s => `"${s.replace(/"/g, '\\"')}"`).join(', ')}],\n`;
    outputData += `    educationPath: "${career.educationPath.replace(/"/g, '\\"')}",\n`;
    outputData += `    imagePath: "${career.imagePath.replace(/"/g, '\\"')}"\n`;
    outputData += `  },\n`;
  });
  
  outputData += '];\n';
  
  // Write to file
  const outputFilePath = path.join(__dirname, '../client/src/data/additionalCareers.ts');
  fs.writeFileSync(outputFilePath, outputData);
  
  console.log(`Career data successfully written to ${outputFilePath}`);
  console.log('Process completed successfully!');
  
} catch (error) {
  console.error('Error processing Excel file:', error);
}