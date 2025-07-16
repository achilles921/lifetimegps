export interface Apprenticeship {
  id: string;
  title: string;
  company: string;
  location: string;
  pay: string;
  duration: string;
  requirements: string[];
  description: string;
  benefits: string[];
  applicationLink: string;
  tradeCategory: string;
  imageUrl: string;
}

export const tradeCategories = [
  "Construction",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Automotive",
  "Manufacturing",
  "Welding",
  "Carpentry",
  "Masonry",
  "Landscaping"
];

// Mock data for apprenticeships in various trades
export const apprenticeships: Apprenticeship[] = [
  {
    id: "1",
    title: "Electrician Apprentice",
    company: "PowerWorks Inc.",
    location: "Multiple Locations",
    pay: "$18-22/hr + benefits",
    duration: "4 years",
    requirements: [
      "High school diploma or GED",
      "Valid driver's license",
      "Ability to lift 50 lbs",
      "Basic math skills"
    ],
    description: "Learn the electrical trade from experienced journeymen and master electricians. Work on residential and commercial projects while earning a competitive wage and completing required classroom training.",
    benefits: [
      "Paid training",
      "Health insurance",
      "Retirement plan",
      "Tool allowance",
      "Earn while you learn"
    ],
    applicationLink: "https://powerworks.example.com/apprenticeships",
    tradeCategory: "Electrical",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "2",
    title: "Plumbing Apprentice",
    company: "Quality Plumbing Services",
    location: "Chicago, IL",
    pay: "$17-20/hr + benefits",
    duration: "4-5 years",
    requirements: [
      "High school diploma or GED",
      "Reliable transportation",
      "Mechanical aptitude",
      "Strong work ethic"
    ],
    description: "Join our team as a plumbing apprentice and learn all aspects of residential and commercial plumbing systems. Work alongside journeyman plumbers on installations, repairs, and maintenance.",
    benefits: [
      "Tuition assistance for required courses",
      "Health and dental insurance",
      "401k matching",
      "Paid holidays and vacation"
    ],
    applicationLink: "https://qualityplumbing.example.com/careers",
    tradeCategory: "Plumbing",
    imageUrl: "https://images.unsplash.com/photo-1542013936693-884638332954?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "3",
    title: "Carpentry Apprentice",
    company: "Premier Construction",
    location: "Seattle, WA",
    pay: "$19-24/hr",
    duration: "3-4 years",
    requirements: [
      "18 years or older",
      "High school diploma or GED",
      "Valid driver's license",
      "Physical stamina"
    ],
    description: "Develop carpentry skills working on residential and commercial construction projects. Learn framing, finishing, and cabinetry under the supervision of experienced carpenters.",
    benefits: [
      "Guaranteed wage increases as skills progress",
      "Full benefits package",
      "Paid apprenticeship classes",
      "Career advancement opportunities"
    ],
    applicationLink: "https://premierconstruction.example.com/join",
    tradeCategory: "Carpentry",
    imageUrl: "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "4",
    title: "HVAC Technician Apprentice",
    company: "Climate Control Systems",
    location: "Dallas, TX",
    pay: "$16-21/hr + benefits",
    duration: "3-5 years",
    requirements: [
      "High school diploma or GED",
      "Basic mechanical knowledge",
      "Clean driving record",
      "Ability to pass background check"
    ],
    description: "Learn to install, maintain, and repair heating, ventilation, air conditioning, and refrigeration systems. Receive hands-on training and classroom instruction in all aspects of HVAC technology.",
    benefits: [
      "Full tuition coverage for technical courses",
      "Tool allowance",
      "Medical and dental insurance",
      "Growth into specialized areas (commercial, industrial, green technology)"
    ],
    applicationLink: "https://climatecontrol.example.com/apprentice",
    tradeCategory: "HVAC",
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "5",
    title: "Welding Apprentice",
    company: "Industrial Fabricators Alliance",
    location: "Pittsburgh, PA",
    pay: "$18-23/hr",
    duration: "3 years",
    requirements: [
      "High school diploma or GED",
      "Basic math skills",
      "Good hand-eye coordination",
      "Willingness to work in industrial environments"
    ],
    description: "Develop skills in various welding techniques including MIG, TIG, and stick welding. Work on real industrial projects while completing required technical education courses.",
    benefits: [
      "Journeyman certification upon completion",
      "Career placement assistance",
      "Health insurance",
      "Retirement benefits"
    ],
    applicationLink: "https://industrialfabricators.example.com/careers/apprentice",
    tradeCategory: "Welding",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "6",
    title: "Automotive Technician Apprentice",
    company: "Advanced Auto Service Centers",
    location: "Multiple Locations",
    pay: "$15-19/hr + commissions",
    duration: "2-4 years",
    requirements: [
      "High school diploma or GED",
      "Driver's license",
      "Basic computer skills",
      "Mechanical aptitude"
    ],
    description: "Train to become an ASE-certified automotive technician. Learn diagnostics, repair procedures, and maintenance for modern vehicles while working in a fast-paced service environment.",
    benefits: [
      "ASE certification reimbursement",
      "Tool program with discounts",
      "Health benefits",
      "Ongoing training for new vehicle technologies"
    ],
    applicationLink: "https://advancedauto.example.com/careers",
    tradeCategory: "Automotive",
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "7",
    title: "Construction Apprentice",
    company: "BuildRight Contractors",
    location: "Denver, CO",
    pay: "$16-20/hr + benefits",
    duration: "3 years",
    requirements: [
      "18 years or older",
      "High school diploma or GED preferred",
      "Physical ability to perform construction tasks",
      "Reliable transportation"
    ],
    description: "Learn multiple aspects of the construction trade including concrete work, framing, drywall, and finish carpentry. Develop skills through hands-on experience on commercial and residential projects.",
    benefits: [
      "No prior experience required",
      "Health insurance after 60 days",
      "Paid holidays and vacation time",
      "Clear path to journeyman status"
    ],
    applicationLink: "https://buildright.example.com/join-our-team",
    tradeCategory: "Construction",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "8",
    title: "Masonry Apprentice",
    company: "Heritage Masonry & Stone",
    location: "Boston, MA",
    pay: "$17-21/hr",
    duration: "3-4 years",
    requirements: [
      "Physical stamina",
      "High school diploma or GED",
      "Valid driver's license",
      "Good math skills"
    ],
    description: "Learn the skilled trade of masonry working with brick, block, and stone. Develop techniques for both new construction and restoration projects under experienced masons.",
    benefits: [
      "Paid apprenticeship classes",
      "Tool stipend",
      "Health insurance",
      "Year-round work opportunities"
    ],
    applicationLink: "https://heritagemasonry.example.com/apprenticeships",
    tradeCategory: "Masonry",
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "9",
    title: "Manufacturing Technician Apprentice",
    company: "Precision Manufacturing Group",
    location: "Detroit, MI",
    pay: "$17-22/hr + benefits",
    duration: "2-3 years",
    requirements: [
      "High school diploma or GED",
      "Basic computer skills",
      "Mechanical aptitude",
      "Ability to read blueprints and technical documents"
    ],
    description: "Learn to operate, maintain, and troubleshoot advanced manufacturing equipment. Develop skills in CNC operation, quality control, and production processes.",
    benefits: [
      "Technical certification upon completion",
      "Comprehensive benefits package",
      "Bonus opportunities",
      "Advanced training for specialized equipment"
    ],
    applicationLink: "https://precisionmfg.example.com/careers/apprentice",
    tradeCategory: "Manufacturing",
    imageUrl: "https://images.unsplash.com/photo-1574621100236-d25b64cfd647?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "10",
    title: "Landscaping Apprentice",
    company: "Green Horizons Landscape & Design",
    location: "Portland, OR",
    pay: "$16-19/hr",
    duration: "2 years",
    requirements: [
      "Valid driver's license",
      "Physical stamina for outdoor work",
      "High school diploma or GED preferred",
      "Basic knowledge of plants and outdoor environments"
    ],
    description: "Learn professional landscaping skills including hardscape installation, plant selection and care, irrigation systems, and sustainable landscape design.",
    benefits: [
      "Year-round employment opportunities",
      "Pathway to landscape supervisor or designer roles",
      "Health benefits after probation period",
      "Industry certification assistance"
    ],
    applicationLink: "https://greenhorizons.example.com/join",
    tradeCategory: "Landscaping",
    imageUrl: "https://images.unsplash.com/photo-1599629954294-14df9f8291bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];