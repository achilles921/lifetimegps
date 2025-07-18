import { Career } from './careerData';

export const additionalCareers: Career[] = [
  {
    id: "aerospace_engineer",
    title: "Aerospace Engineer",
    description: "Design, test, and develop aircraft, spacecraft, satellites, and missiles, focusing on aerodynamics, propulsion, and structural integrity. Specialize in either aeronautical (aircraft) or astronautical (spacecraft) engineering.",
    skills: ["Physics", "Mathematics", "CAD Software", "Problem Solving", "Analytical Thinking"],
    relatedInterests: [19, 5, 20], // Engineering, Vehicles/Aviation, Renewable Energy/Science
    salary: "$118,610",
    growth: "6% (2021-2031)",
    workEnvironment: "Aerospace companies, defense contractors, research labs, and government agencies",
    workStyle: ["structured", "team", "analytical", "detail-oriented"],
    educationPath: "Bachelor's degree in aerospace engineering or related field; advanced positions may require master's degree",
    imagePath: "https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "urban_planner",
    title: "Urban Planner",
    description: "Develop comprehensive plans and programs for land use, helping communities manage growth, revitalize physical facilities, and create more efficient transportation systems with a focus on sustainability and community needs.",
    skills: ["GIS Technology", "Research", "Communication", "Project Management", "Policy Analysis"],
    relatedInterests: [18, 4, 9], // Architectural Design/City Planning, Building/Construction, Animals/Nature
    salary: "$78,500",
    growth: "4% (2021-2031)",
    workEnvironment: "Local government offices, consulting firms, community development organizations",
    workStyle: ["structured", "team", "analytical", "independent"],
    educationPath: "Master's degree in urban or regional planning; some entry-level positions with bachelor's degree",
    imagePath: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cloud_computing_specialist",
    title: "Cloud Computing Specialist",
    description: "Design and implement cloud-based solutions, working with services like AWS, Azure, or Google Cloud to optimize computing resources, ensure data security, and maintain system reliability for organizations.",
    skills: ["Cloud Platforms", "Network Architecture", "Security Protocols", "Programming", "Problem-Solving"],
    relatedInterests: [13, 14, 21], // Software Development, Hardware Technology, Information/Cyber Security
    salary: "$105,900",
    growth: "15% (2021-2031)",
    workEnvironment: "Technology companies, IT departments across industries, consulting firms",
    workStyle: ["structured", "team", "analytical", "independent", "adaptive"],
    educationPath: "Bachelor's degree in computer science or IT; cloud certifications highly valued (AWS, Azure, Google Cloud)",
    imagePath: "https://images.unsplash.com/photo-1560732488-7b5f4d50b7d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "renewable_energy_technician",
    title: "Renewable Energy Technician",
    description: "Install, maintain, and repair renewable energy systems like solar panels, wind turbines, or hydroelectric generators, ensuring optimal performance and efficiency of sustainable energy infrastructure.",
    skills: ["Electrical Systems", "Mechanical Skills", "Troubleshooting", "Safety Protocols", "Technical Documentation"],
    relatedInterests: [20, 3, 4], // Renewable Energy/Science, Skilled Trades, Building/Construction
    salary: "$47,670",
    growth: "8% (2021-2031)",
    workEnvironment: "Energy companies, construction sites, residential and commercial buildings",
    workStyle: ["hands-on", "team", "structured", "detail-oriented"],
    educationPath: "Associate's degree or certificate in renewable energy technology; apprenticeship programs available",
    imagePath: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "digital_marketing_specialist",
    title: "Digital Marketing Specialist",
    description: "Create and implement online marketing strategies across various channels, including social media, email, SEO, and content marketing to increase brand awareness, generate leads, and drive customer engagement.",
    skills: ["Social Media Platforms", "Analytics", "Content Creation", "SEO/SEM", "Campaign Management"],
    relatedInterests: [15, 17, 6], // Content Creation, Writing/Communication, Real Estate/Brokerage
    salary: "$64,400",
    growth: "10% (2021-2031)",
    workEnvironment: "Marketing agencies, corporate marketing departments, media companies, freelance",
    workStyle: ["creative", "team", "flexible", "results-oriented"],
    educationPath: "Bachelor's degree in marketing or related field; specialized certifications in digital marketing platforms",
    imagePath: "https://images.unsplash.com/photo-1460794418188-1bb7dba2720d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "machine_learning_engineer",
    title: "Machine Learning Engineer",
    description: "Design and develop AI systems and machine learning models that enable computers to learn from data and make predictions or decisions without explicit programming, with applications across industries.",
    skills: ["Python", "Statistics", "Neural Networks", "Data Modeling", "Algorithm Development"],
    relatedInterests: [13, 16, 21], // Software Development, Finance/Data, Information/Cyber Security
    salary: "$126,830",
    growth: "21% (2021-2031)",
    workEnvironment: "Tech companies, research institutions, AI startups, enterprise data science teams",
    workStyle: ["analytical", "team", "independent", "research-oriented"],
    educationPath: "Master's or PhD in computer science, artificial intelligence, or related field; some positions with strong bachelor's plus experience",
    imagePath: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ux_researcher",
    title: "UX Researcher",
    description: "Study user behaviors, needs, and motivations through observation, interviews, and usability testing to inform the design of products and services with better user experiences and improved customer satisfaction.",
    skills: ["User Testing", "Interview Techniques", "Data Analysis", "Empathy", "Presentation"],
    relatedInterests: [15, 12, 17], // Content Creation, Teaching/Coaching, Writing/Communication
    salary: "$92,320",
    growth: "8% (2021-2031)",
    workEnvironment: "Tech companies, design agencies, product development teams, consulting firms",
    workStyle: ["empathetic", "analytical", "creative", "detail-oriented", "team"],
    educationPath: "Bachelor's or master's degree in psychology, human-computer interaction, or related field",
    imagePath: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cybersecurity_analyst",
    title: "Cybersecurity Analyst",
    description: "Protect computer systems and networks by monitoring for security breaches, investigating violations, installing protective software, and developing security strategies to safeguard digital information.",
    skills: ["Network Security", "Threat Assessment", "Incident Response", "Security Tools", "Problem Solving"],
    relatedInterests: [21, 14, 13], // Information/Cyber Security, Hardware Technology, Software Development
    salary: "$102,600",
    growth: "35% (2021-2031)",
    workEnvironment: "IT departments, government agencies, financial institutions, cybersecurity firms",
    workStyle: ["analytical", "detail-oriented", "vigilant", "independent", "adaptive"],
    educationPath: "Bachelor's degree in cybersecurity, computer science, or related field; security certifications highly valued",
    imagePath: "https://images.unsplash.com/photo-1510511233900-1982d92bd835?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "environmental_scientist",
    title: "Environmental Scientist",
    description: "Study environmental conditions to identify hazards, assess impacts of human activities, develop solutions for environmental problems, and work to protect and preserve natural resources and ecosystems.",
    skills: ["Data Collection", "Research", "Analysis", "Report Writing", "Environmental Regulations"],
    relatedInterests: [9, 20, 11], // Animals/Nature, Renewable Energy/Science, Gaming/Interactive Media
    salary: "$76,530",
    growth: "5% (2021-2031)",
    workEnvironment: "Government agencies, consulting firms, research institutions, conservation organizations",
    workStyle: ["detail-oriented", "analytical", "field work", "research-oriented"],
    educationPath: "Bachelor's degree in environmental science or related field; graduate degree for advanced positions",
    imagePath: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "physical_therapist",
    title: "Physical Therapist",
    description: "Help patients recover from injuries, manage pain, improve mobility, and prevent further physical problems through therapeutic exercises, manual therapy, and patient education.",
    skills: ["Anatomy Knowledge", "Treatment Planning", "Patient Communication", "Physical Assessment", "Rehabilitation Techniques"],
    relatedInterests: [7, 10, 12], // Sports/Fitness, Health/Wellness, Teaching/Coaching
    salary: "$95,620",
    growth: "17% (2021-2031)",
    workEnvironment: "Hospitals, outpatient clinics, sports facilities, rehabilitation centers, private practices",
    workStyle: ["hands-on", "empathetic", "patient", "detail-oriented"],
    educationPath: "Doctor of Physical Therapy (DPT) degree; state licensure required",
    imagePath: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "veterinary_technician",
    title: "Veterinary Technician",
    description: "Provide animal healthcare support by conducting lab tests, taking x-rays, preparing surgical equipment, administering medications, and assisting veterinarians in diagnosing and treating animals.",
    skills: ["Animal Handling", "Medical Procedures", "Lab Techniques", "Patient Monitoring", "Client Communication"],
    relatedInterests: [9, 10, 3], // Animals/Nature, Health/Wellness, Skilled Trades
    salary: "$36,850",
    growth: "20% (2021-2031)",
    workEnvironment: "Veterinary clinics, animal hospitals, research facilities, zoos, shelters",
    workStyle: ["hands-on", "compassionate", "team", "detail-oriented"],
    educationPath: "Associate's degree in veterinary technology; state certification or licensure required",
    imagePath: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "electrician",
    title: "Electrician",
    description: "Install, maintain, and repair electrical power, communications, lighting, and control systems in homes, businesses, and factories, ensuring safety and compliance with electrical codes.",
    skills: ["Electrical Systems", "Troubleshooting", "Technical Reading", "Hand Tools", "Safety Procedures"],
    relatedInterests: [3, 4, 5], // Skilled Trades, Building/Construction, Vehicles/Aviation
    salary: "$60,040",
    growth: "7% (2021-2031)",
    workEnvironment: "Construction sites, residential properties, businesses, factories",
    workStyle: ["hands-on", "detail-oriented", "independent", "problem-solving"],
    educationPath: "Apprenticeship program (4-5 years); technical school training; state licensure required",
    imagePath: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "dental_hygienist",
    title: "Dental Hygienist",
    description: "Clean teeth, examine patients for oral diseases, provide preventive dental care, and educate patients on proper oral hygiene techniques to maintain dental health.",
    skills: ["Dental Procedures", "Patient Care", "Preventive Services", "Communication", "Attention to Detail"],
    relatedInterests: [10, 3, 12], // Health/Wellness, Skilled Trades, Teaching/Coaching
    salary: "$77,810",
    growth: "9% (2021-2031)",
    workEnvironment: "Dental offices, community health centers, educational institutions",
    workStyle: ["hands-on", "detail-oriented", "interpersonal", "structured"],
    educationPath: "Associate's degree in dental hygiene; state licensure required",
    imagePath: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "financial_advisor",
    title: "Financial Advisor",
    description: "Help individuals and businesses make informed decisions about investments, insurance, taxes, retirement, and estate planning to achieve financial goals and build wealth.",
    skills: ["Financial Analysis", "Client Relations", "Investment Strategies", "Regulatory Knowledge", "Communication"],
    relatedInterests: [16, 6, 17], // Finance/Data, Real Estate/Brokerage, Writing/Communication
    salary: "$94,170",
    growth: "15% (2021-2031)",
    workEnvironment: "Financial firms, banks, insurance companies, independent practices",
    workStyle: ["analytical", "interpersonal", "detail-oriented", "client-focused"],
    educationPath: "Bachelor's degree in finance, economics, or related field; professional certifications (CFP, CFA) valuable",
    imagePath: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "interior_designer",
    title: "Interior Designer",
    description: "Plan and design functional and aesthetic interior spaces by selecting colors, furniture, flooring, lighting, and other materials that enhance the function, safety, and quality of interior environments.",
    skills: ["Spatial Design", "Color Theory", "CAD Software", "Project Management", "Client Communication"],
    relatedInterests: [8, 4, 18], // Arts/Performance, Building/Construction, Architectural Design/City Planning
    salary: "$60,340",
    growth: "3% (2021-2031)",
    workEnvironment: "Design firms, architectural offices, furniture stores, self-employment",
    workStyle: ["creative", "client-focused", "detail-oriented", "flexible"],
    educationPath: "Bachelor's degree in interior design or related field; state licensure or certification may be required",
    imagePath: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "marketing_manager",
    title: "Marketing Manager",
    description: "Plan and direct marketing strategies to generate interest in products or services, identify target markets, develop pricing strategies, and oversee the development of marketing campaigns.",
    skills: ["Strategic Planning", "Market Analysis", "Team Leadership", "Budget Management", "Brand Development"],
    relatedInterests: [17, 15, 6], // Writing/Communication, Content Creation, Real Estate/Brokerage
    salary: "$135,030",
    growth: "10% (2021-2031)",
    workEnvironment: "Corporate marketing departments, advertising agencies, consulting firms",
    workStyle: ["strategic", "creative", "team", "leadership", "results-oriented"],
    educationPath: "Bachelor's degree in marketing, business, or related field; MBA beneficial for advancement",
    imagePath: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "respiratory_therapist",
    title: "Respiratory Therapist",
    description: "Assess and treat patients with breathing disorders, administer respiratory care treatments, conduct diagnostic tests, and educate patients on managing their conditions.",
    skills: ["Patient Care", "Diagnostic Testing", "Treatment Administration", "Medical Equipment", "Critical Thinking"],
    relatedInterests: [10, 1, 3], // Health/Wellness, Emergency Services/First Responder, Skilled Trades
    salary: "$61,830",
    growth: "14% (2021-2031)",
    workEnvironment: "Hospitals, clinics, nursing care facilities, home health agencies",
    workStyle: ["hands-on", "compassionate", "detail-oriented", "team"],
    educationPath: "Associate's or bachelor's degree in respiratory therapy; state licensure required",
    imagePath: "https://images.unsplash.com/photo-1576893750581-447710d00dac?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "heavy_equipment_operator",
    title: "Heavy Equipment Operator",
    description: "Operate construction equipment such as bulldozers, cranes, excavators, and loaders to move earth, construction materials, or other heavy objects in construction and mining sites.",
    skills: ["Equipment Operation", "Safety Procedures", "Mechanical Knowledge", "Spatial Awareness", "Coordination"],
    relatedInterests: [3, 4, 5], // Skilled Trades, Building/Construction, Vehicles/Aviation
    salary: "$48,290",
    growth: "4% (2021-2031)",
    workEnvironment: "Construction sites, mining operations, transportation projects, warehouses",
    workStyle: ["hands-on", "detail-oriented", "independent", "focused"],
    educationPath: "High school diploma or equivalent; vocational training or apprenticeship; equipment certifications",
    imagePath: "https://images.unsplash.com/photo-1566513834362-63ae584d256d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "forensic_scientist",
    title: "Forensic Scientist",
    description: "Collect and analyze physical evidence from crime scenes, perform laboratory tests, and use scientific techniques to help solve crimes and support criminal investigations.",
    skills: ["Laboratory Techniques", "Evidence Collection", "Scientific Analysis", "Attention to Detail", "Documentation"],
    relatedInterests: [20, 21, 1], // Renewable Energy/Science, Information/Cyber Security, Emergency Services/First Responder
    salary: "$61,930",
    growth: "11% (2021-2031)",
    workEnvironment: "Crime laboratories, police departments, medical examiner offices, government agencies",
    workStyle: ["analytical", "detail-oriented", "structured", "precise"],
    educationPath: "Bachelor's degree in forensic science, chemistry, biology, or related field",
    imagePath: "https://images.unsplash.com/photo-1590402494587-44b71d7772f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chef",
    title: "Chef",
    description: "Create recipes, prepare meals, supervise kitchen staff, manage food inventory, and ensure food safety standards are maintained in restaurants, hotels, or other food service establishments.",
    skills: ["Cooking Techniques", "Menu Planning", "Food Safety", "Kitchen Management", "Creativity"],
    relatedInterests: [3, 8, 12], // Skilled Trades, Arts/Performance, Teaching/Coaching
    salary: "$50,160",
    growth: "15% (2021-2031)",
    workEnvironment: "Restaurants, hotels, catering companies, private households, cruise ships",
    workStyle: ["creative", "hands-on", "team", "high-pressure", "detail-oriented"],
    educationPath: "Culinary school or apprenticeship; certifications available but not always required",
    imagePath: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "graphic_designer",
    title: "Graphic Designer",
    description: "Create visual concepts using computer software or by hand to communicate ideas that inspire, inform, or captivate consumers through various forms of visual communication.",
    skills: ["Design Software", "Typography", "Color Theory", "Layout", "Visual Communication"],
    relatedInterests: [8, 15, 18], // Arts/Performance, Content Creation, Architectural Design/City Planning
    salary: "$50,710",
    growth: "3% (2021-2031)",
    workEnvironment: "Design studios, advertising agencies, publishing companies, corporate marketing departments",
    workStyle: ["creative", "detail-oriented", "deadline-driven", "client-focused"],
    educationPath: "Bachelor's degree in graphic design or related field; strong portfolio required",
    imagePath: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "elementary_school_teacher",
    title: "Elementary School Teacher",
    description: "Educate young students in basic subjects such as math and reading, develop lesson plans, assess student progress, and create a positive learning environment for academic and social development.",
    skills: ["Lesson Planning", "Classroom Management", "Communication", "Patience", "Adaptability"],
    relatedInterests: [12, 8, 17], // Teaching/Coaching, Arts/Performance, Writing/Communication
    salary: "$61,400",
    growth: "4% (2021-2031)",
    workEnvironment: "Public and private elementary schools, specialized educational institutions",
    workStyle: ["nurturing", "organized", "energetic", "creative", "patient"],
    educationPath: "Bachelor's degree in elementary education; state teaching certification required",
    imagePath: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "social_worker",
    title: "Social Worker",
    description: "Help people solve and cope with problems in their everyday lives, connect clients with resources and support services, and advocate for vulnerable populations to improve their quality of life.",
    skills: ["Counseling", "Case Management", "Advocacy", "Assessment", "Crisis Intervention"],
    relatedInterests: [12, 1, 17], // Teaching/Coaching, Emergency Services/First Responder, Writing/Communication
    salary: "$50,390",
    growth: "9% (2021-2031)",
    workEnvironment: "Hospitals, schools, government agencies, mental health clinics, nonprofit organizations",
    workStyle: ["empathetic", "patient", "organized", "resilient", "collaborative"],
    educationPath: "Bachelor's or master's degree in social work; state licensure required for clinical positions",
    imagePath: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "real_estate_agent",
    title: "Real Estate Agent",
    description: "Help clients buy, sell, or rent properties by conducting market research, showing properties, negotiating prices, preparing contracts, and guiding clients through the transaction process.",
    skills: ["Sales", "Negotiation", "Market Knowledge", "Client Relations", "Marketing"],
    relatedInterests: [6, 16, 17], // Real Estate/Brokerage, Finance/Data, Writing/Communication
    salary: "$48,340",
    growth: "5% (2021-2031)",
    workEnvironment: "Real estate agencies, property management companies, self-employment",
    workStyle: ["self-motivated", "client-focused", "flexible", "persistent"],
    educationPath: "High school diploma minimum; real estate courses and state licensure required",
    imagePath: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "pilot",
    title: "Pilot",
    description: "Operate aircraft for airlines, corporations, or other organizations to transport passengers or cargo, following flight plans, monitoring systems, and ensuring passenger safety.",
    skills: ["Aircraft Operation", "Navigation", "Communication", "Decision Making", "Technical Knowledge"],
    relatedInterests: [5, 1, 3], // Vehicles/Aviation, Emergency Services/First Responder, Skilled Trades
    salary: "$130,440",
    growth: "6% (2021-2031)",
    workEnvironment: "Airlines, cargo companies, private aviation, government and military",
    workStyle: ["detail-oriented", "methodical", "decisive", "calm under pressure"],
    educationPath: "Bachelor's degree recommended; flight school training; FAA certification required",
    imagePath: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sonographer",
    title: "Diagnostic Medical Sonographer",
    description: "Use specialized equipment to create images of the body's organs and tissues (ultrasounds) to help physicians diagnose and monitor medical conditions, diseases, and injuries.",
    skills: ["Imaging Technology", "Patient Care", "Technical Precision", "Anatomy Knowledge", "Communication"],
    relatedInterests: [10, 14, 3], // Health/Wellness, Hardware Technology, Skilled Trades
    salary: "$75,380",
    growth: "10% (2021-2031)",
    workEnvironment: "Hospitals, physicians' offices, medical laboratories, outpatient centers",
    workStyle: ["detail-oriented", "technical", "compassionate", "precise"],
    educationPath: "Associate's or bachelor's degree in sonography; professional certification required",
    imagePath: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "hr_specialist",
    title: "Human Resources Specialist",
    description: "Recruit, screen, interview, and place workers; handle employee relations, compensation, benefits, and training; and ensure organizational compliance with employment laws and regulations.",
    skills: ["Interviewing", "Conflict Resolution", "Policy Development", "Communication", "HRIS Systems"],
    relatedInterests: [12, 17, 16], // Teaching/Coaching, Writing/Communication, Finance/Data
    salary: "$62,290",
    growth: "8% (2021-2031)",
    workEnvironment: "Corporate HR departments, staffing agencies, government offices",
    workStyle: ["detail-oriented", "interpersonal", "objective", "organized"],
    educationPath: "Bachelor's degree in human resources, business, or related field; HR certifications valuable",
    imagePath: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "web_developer",
    title: "Web Developer",
    description: "Design and create websites by writing code, ensuring user-friendly design, and developing site content that works across different browsers and devices with fast load times.",
    skills: ["HTML/CSS", "JavaScript", "Responsive Design", "Problem Solving", "CMS Platforms"],
    relatedInterests: [13, 15, 14], // Software Development, Content Creation, Hardware Technology
    salary: "$77,200",
    growth: "23% (2021-2031)",
    workEnvironment: "Tech companies, digital agencies, corporate IT departments, self-employment",
    workStyle: ["detail-oriented", "creative", "analytical", "flexible"],
    educationPath: "Associate's or bachelor's degree in web development or related field; certifications and portfolio also valuable",
    imagePath: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "personal_trainer",
    title: "Personal Trainer",
    description: "Design custom fitness programs, demonstrate proper exercise techniques, provide motivation and support, and help clients achieve their physical fitness and health goals.",
    skills: ["Exercise Science", "Motivation", "Communication", "Assessment", "Program Design"],
    relatedInterests: [7, 10, 12], // Sports/Fitness, Health/Wellness, Teaching/Coaching
    salary: "$40,700",
    growth: "19% (2021-2031)",
    workEnvironment: "Fitness centers, gyms, clients' homes, corporate wellness programs, self-employment",
    workStyle: ["energetic", "motivational", "people-oriented", "flexible"],
    educationPath: "High school diploma minimum; fitness certification from accredited organization required",
    imagePath: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "occupational_therapist",
    title: "Occupational Therapist",
    description: "Help people with injuries, illnesses, or disabilities develop, recover, and improve the skills needed for daily living and working through therapeutic use of everyday activities.",
    skills: ["Assessment", "Treatment Planning", "Adaptability", "Communication", "Patience"],
    relatedInterests: [10, 12, 7], // Health/Wellness, Teaching/Coaching, Sports/Fitness
    salary: "$85,570",
    growth: "14% (2021-2031)",
    workEnvironment: "Hospitals, schools, nursing homes, home health services, outpatient clinics",
    workStyle: ["creative", "patient", "detail-oriented", "compassionate"],
    educationPath: "Master's or doctoral degree in occupational therapy; state licensure required",
    imagePath: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "electrician",
    title: "Electrician",
    description: "Install, maintain, and repair electrical power, communications, lighting, and control systems in homes, businesses, and factories, ensuring safety and compliance with electrical codes.",
    skills: ["Electrical Systems", "Troubleshooting", "Technical Reading", "Hand Tools", "Safety Procedures"],
    relatedInterests: [3, 4, 14], // Skilled Trades, Building/Construction, Hardware Technology
    salary: "$60,040",
    growth: "7% (2021-2031)",
    workEnvironment: "Construction sites, homes, businesses, factories",
    workStyle: ["hands-on", "detail-oriented", "problem-solving", "independent"],
    educationPath: "Apprenticeship (4-5 years); vocational training; state licensure required",
    imagePath: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  }
];