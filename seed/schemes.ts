import { slugify } from "@/lib/utils";

function scheme(
  id: string,
  name: string,
  category: string,
  ministry: string,
  level: "central" | "state",
  rules: { field: string; operator: string; value: unknown; label?: string }[],
  opts: Partial<{
    applicableStates: string[];
    requiredDocuments: string[];
    benefits: string[];
    approvalTime: string;
    colorTheme: string;
    icon: string;
  }> = {}
) {
  return {
    schemeId: id,
    name,
    slug: slugify(name),
    description: `${name} is a ${level === "central" ? "Central Government" : "State Government"} scheme under ${ministry}, designed to provide targeted benefits to eligible citizens across India.`,
    category,
    ministry,
    level,
    applicableStates: opts.applicableStates || [],
    eligibilityRules: { conditions: rules, logic: "AND" as const },
    requiredDocuments: opts.requiredDocuments || [
      "Aadhaar Card",
      "Bank Passbook",
      "Passport Photo",
    ],
    benefits: opts.benefits || ["Financial assistance", "Direct benefit transfer"],
    applicationProcess: [
      "Visit official portal or nearest CSC",
      "Register with Aadhaar-linked mobile",
      "Fill application form",
      "Upload required documents",
      "Submit and track status online",
    ],
    approvalTime: opts.approvalTime || "15-30 days",
    faqs: [
      { question: `Who can apply for ${name}?`, answer: "Citizens meeting the eligibility criteria listed on the official portal." },
      { question: "How to check application status?", answer: "Track status on the official portal using your application ID." },
    ],
    officialWebsite: `https://www.india.gov.in/scheme/${id}`,
    helpline: "1800-111-555",
    icon: opts.icon || "🏛️",
    logo: opts.icon || "🏛️",
    colorTheme: opts.colorTheme || "#3B82F6",
    isActive: true,
  };
}

export const SCHEMES_SEED = [
  scheme("pm-kisan", "PM Kisan", "Agriculture", "Ministry of Agriculture", "central", [
    { field: "isFarmer", operator: "boolean", value: true, label: "Must be a registered farmer" },
    { field: "annualIncome", operator: "lte", value: 200000, label: "Annual income below ₹2 lakh" },
  ], { icon: "🌾", colorTheme: "#16A34A", benefits: ["₹6,000/year in 3 installments", "Direct bank transfer"], requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Passbook", "Farmer Certificate"] }),

  scheme("ayushman-bharat", "Ayushman Bharat", "Healthcare", "Ministry of Health", "central", [
    { field: "annualIncome", operator: "lte", value: 500000, label: "Annual income below ₹5 lakh" },
    { field: "category", operator: "in", value: ["SC", "ST", "OBC", "EWS", "General"], label: "All categories eligible" },
  ], { icon: "🏥", colorTheme: "#DC2626", benefits: ["Health cover up to ₹5 lakh/family", "Cashless treatment at empanelled hospitals"], requiredDocuments: ["Aadhaar Card", "Ration Card", "Income Certificate"] }),

  scheme("pm-mudra", "PM Mudra Loan", "Business & Startup", "Ministry of Finance", "central", [
    { field: "isBusinessOwner", operator: "boolean", value: true, label: "Non-corporate small business" },
    { field: "annualIncome", operator: "lte", value: 1000000, label: "Annual income below ₹10 lakh" },
  ], { icon: "💰", colorTheme: "#7C3AED", benefits: ["Loans up to ₹10 lakh", "Shishu/Kishore/Tarun categories"], requiredDocuments: ["Aadhaar Card", "PAN Card", "Business Registration", "Bank Passbook"] }),

  scheme("startup-india", "Startup India", "Business & Startup", "DPIIT", "central", [
    { field: "isBusinessOwner", operator: "boolean", value: true, label: "Registered startup entity" },
    { field: "age", operator: "lte", value: 50, label: "Entity less than 10 years old" },
  ], { icon: "🚀", colorTheme: "#F59E0B", benefits: ["Tax exemptions", "Patent fee rebate", "Fund of Funds access"], requiredDocuments: ["Business Registration", "PAN Card", "Aadhaar Card"] }),

  scheme("stand-up-india", "Stand-Up India", "Business & Startup", "Ministry of Finance", "central", [
    { field: "isBusinessOwner", operator: "boolean", value: true, label: "Entrepreneur from SC/ST/Woman category" },
    { field: "category", operator: "in", value: ["SC", "ST"], label: "SC/ST or Woman entrepreneur" },
  ], { icon: "🤝", colorTheme: "#0891B2", benefits: ["Bank loans ₹10 lakh to ₹1 crore", "Composite loan for greenfield enterprise"], requiredDocuments: ["Aadhaar Card", "Caste Certificate", "Business Plan", "Bank Passbook"] }),

  scheme("pm-vishwakarma", "PM Vishwakarma", "Skill Development", "Ministry of MSME", "central", [
    { field: "occupation", operator: "in", value: ["Self-Employed", "Daily Wage Worker"], label: "Traditional artisan/craftsman" },
    { field: "annualIncome", operator: "lte", value: 300000, label: "Annual income below ₹3 lakh" },
  ], { icon: "🔨", colorTheme: "#EA580C", benefits: ["Skill training", "Toolkit incentive ₹15,000", "Collateral-free credit"], requiredDocuments: ["Aadhaar Card", "Skill Certificate", "Bank Passbook"] }),

  scheme("nsp", "National Scholarship Portal", "Education", "Ministry of Education", "central", [
    { field: "isStudent", operator: "boolean", value: true, label: "Currently enrolled student" },
    { field: "annualIncome", operator: "lte", value: 800000, label: "Family income below ₹8 lakh" },
  ], { icon: "🎓", colorTheme: "#2563EB", benefits: ["Merit & means scholarships", "Pre-matric and post-matric support"], requiredDocuments: ["Aadhaar Card", "College ID", "Income Certificate", "Caste Certificate"] }),

  scheme("skill-india", "Skill India", "Skill Development", "Ministry of Skill Development", "central", [
    { field: "age", operator: "gte", value: 15, label: "Age 15 years or above" },
    { field: "age", operator: "lte", value: 45, label: "Age below 45 years" },
  ], { icon: "🛠️", colorTheme: "#0D9488", benefits: ["Free skill training", "Industry-recognized certification", "Placement assistance"], requiredDocuments: ["Aadhaar Card", "Passport Photo"] }),

  scheme("sukanya-samriddhi", "Sukanya Samriddhi Yojana", "Women & Child", "Ministry of Finance", "central", [
    { field: "gender", operator: "eq", value: "female", label: "Account for girl child" },
    { field: "age", operator: "lte", value: 10, label: "Girl child below 10 years" },
  ], { icon: "👧", colorTheme: "#DB2777", benefits: ["High interest rate ~8%", "Tax benefits under 80C", "Maturity at 21 years"], requiredDocuments: ["Birth Certificate", "Aadhaar Card", "Passport Photo"] }),

  scheme("atal-pension", "Atal Pension Yojana", "Pension", "PFRDA", "central", [
    { field: "age", operator: "gte", value: 18, label: "Age 18-40 years" },
    { field: "age", operator: "lte", value: 40, label: "Age 18-40 years" },
  ], { icon: "👴", colorTheme: "#4F46E5", benefits: ["Guaranteed pension ₹1,000-5,000/month", "Government co-contribution"], requiredDocuments: ["Aadhaar Card", "Bank Passbook", "Mobile number"] }),

  scheme("pm-awas", "PM Awas Yojana", "Housing", "Ministry of Housing", "central", [
    { field: "annualIncome", operator: "lte", value: 600000, label: "Annual income below ₹6 lakh (EWS/LIG)" },
    { field: "category", operator: "in", value: ["EWS", "LIG", "MIG", "General", "SC", "ST", "OBC"], label: "EWS/LIG/MIG categories" },
  ], { icon: "🏠", colorTheme: "#059669", benefits: ["Interest subsidy on home loan", "Affordable housing support"], requiredDocuments: ["Aadhaar Card", "Income Certificate", "Bank Passbook", "Land Records"] }),

  scheme("ujjwala", "Ujjwala Yojana", "Social Welfare", "Ministry of Petroleum", "central", [
    { field: "gender", operator: "eq", value: "female", label: "Woman from BPL household" },
    { field: "annualIncome", operator: "lte", value: 150000, label: "BPL family income" },
  ], { icon: "🔥", colorTheme: "#E11D48", benefits: ["Free LPG connection", "First refill and stove subsidy"], requiredDocuments: ["Aadhaar Card", "BPL Ration Card", "Bank Passbook"] }),

  scheme("digital-india", "Digital India", "Financial Inclusion", "Ministry of Electronics & IT", "central", [
    { field: "age", operator: "gte", value: 14, label: "Indian citizen" },
  ], { icon: "💻", colorTheme: "#0284C7", benefits: ["Digital literacy training", "Access to e-governance services"], requiredDocuments: ["Aadhaar Card"] }),

  scheme("pmegp", "PMEGP", "Business & Startup", "Ministry of MSME", "central", [
    { field: "isBusinessOwner", operator: "boolean", value: true, label: "New micro enterprise" },
    { field: "age", operator: "gte", value: 18, label: "Age 18 years or above" },
  ], { icon: "🏭", colorTheme: "#9333EA", benefits: ["Margin money subsidy 15-35%", "Micro enterprise setup support"], requiredDocuments: ["Aadhaar Card", "Project Report", "Caste Certificate", "EDP Certificate"] }),

  scheme("pm-fasal-bima", "PM Fasal Bima Yojana", "Agriculture", "Ministry of Agriculture", "central", [
    { field: "isFarmer", operator: "boolean", value: true, label: "Farmer with insurable crop" },
  ], { icon: "🌱", colorTheme: "#65A30D", benefits: ["Crop insurance at low premium", "Coverage for natural calamities"], requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Passbook", "Sowing Certificate"] }),

  scheme("e-shram", "E-Shram Portal", "Employment", "Ministry of Labour", "central", [
    { field: "occupation", operator: "in", value: ["Daily Wage Worker", "Self-Employed", "Unemployed"], label: "Unorganized sector worker" },
    { field: "annualIncome", operator: "lte", value: 300000, label: "Annual income below ₹3 lakh" },
  ], { icon: "👷", colorTheme: "#CA8A04", benefits: ["Universal Account Number", "Accident insurance ₹2 lakh", "Social security benefits"], requiredDocuments: ["Aadhaar Card", "Bank Passbook", "Mobile number"] }),

  scheme("nulm", "NULM", "Social Welfare", "Ministry of Housing & Urban Affairs", "central", [
    { field: "annualIncome", operator: "lte", value: 200000, label: "Urban poor household" },
    { field: "occupation", operator: "in", value: ["Self-Employed", "Daily Wage Worker", "Unemployed"], label: "Urban poor/self-employed" },
  ], { icon: "🏙️", colorTheme: "#6366F1", benefits: ["Self-employment programme", "Skill training", "Shelters for urban homeless"], requiredDocuments: ["Aadhaar Card", "Income Certificate", "Residence Certificate"] }),

  scheme("maharashtra-scholarship", "Maharashtra State Scholarship", "Education", "Maharashtra Education Dept", "state", [
    { field: "isStudent", operator: "boolean", value: true, label: "Maharashtra domicile student" },
    { field: "state", operator: "eq", value: "Maharashtra", label: "Maharashtra resident" },
    { field: "annualIncome", operator: "lte", value: 800000, label: "Income below ₹8 lakh" },
  ], { applicableStates: ["Maharashtra"], icon: "📚", colorTheme: "#FF6B35", benefits: ["State scholarship for SC/ST/OBC/EBC", "Fee reimbursement"] }),

  scheme("karnataka-raitha", "Karnataka Raitha Siri", "Agriculture", "Karnataka Agriculture Dept", "state", [
    { field: "isFarmer", operator: "boolean", value: true, label: "Karnataka farmer" },
    { field: "state", operator: "eq", value: "Karnataka", label: "Karnataka resident" },
  ], { applicableStates: ["Karnataka"], icon: "🚜", colorTheme: "#FFD700", benefits: ["₹4,000/acre support", "Crop diversification incentive"] }),

  scheme("tamil-nadu-women", "Tamil Nadu Women Welfare", "Women & Child", "Tamil Nadu Social Welfare", "state", [
    { field: "gender", operator: "eq", value: "female", label: "Woman resident" },
    { field: "state", operator: "eq", value: "Tamil Nadu", label: "Tamil Nadu resident" },
    { field: "annualIncome", operator: "lte", value: 250000, label: "Income below ₹2.5 lakh" },
  ], { applicableStates: ["Tamil Nadu"], icon: "👩", colorTheme: "#E91E63", benefits: ["Marriage assistance", "Self-help group support", "Skill training"] }),

  scheme("up-farmer-pension", "UP Farmer Pension", "Agriculture", "Uttar Pradesh Agriculture Dept", "state", [
    { field: "isFarmer", operator: "boolean", value: true, label: "Small/marginal farmer" },
    { field: "state", operator: "eq", value: "Uttar Pradesh", label: "UP resident" },
    { field: "age", operator: "gte", value: 60, label: "Senior citizen farmer" },
  ], { applicableStates: ["Uttar Pradesh"], icon: "🌾", colorTheme: "#FF9800", benefits: ["Monthly pension ₹500", "Direct bank transfer"] }),

  scheme("delhi-electricity", "Delhi Electricity Subsidy", "Social Welfare", "Delhi Government", "state", [
    { field: "state", operator: "eq", value: "Delhi", label: "Delhi resident" },
    { field: "annualIncome", operator: "lte", value: 300000, label: "Income below ₹3 lakh" },
  ], { applicableStates: ["Delhi"], icon: "⚡", colorTheme: "#2196F3", benefits: ["Free/subsidized electricity up to 200 units", "Zero bill for low consumption"] }),

  scheme("kerala-health", "Kerala Karunya Health", "Healthcare", "Kerala Health Dept", "state", [
    { field: "state", operator: "eq", value: "Kerala", label: "Kerala resident" },
    { field: "annualIncome", operator: "lte", value: 300000, label: "Income below ₹3 lakh" },
  ], { applicableStates: ["Kerala"], icon: "❤️", colorTheme: "#00897B", benefits: ["Free treatment for serious illnesses", "Coverage up to ₹3 lakh"] }),

  scheme("gujarat-kisan", "Gujarat Kisan Sarvoday", "Agriculture", "Gujarat Agriculture Dept", "state", [
    { field: "isFarmer", operator: "boolean", value: true, label: "Gujarat farmer" },
    { field: "state", operator: "eq", value: "Gujarat", label: "Gujarat resident" },
  ], { applicableStates: ["Gujarat"], icon: "🌽", colorTheme: "#FF5722", benefits: ["₹4,000/year per farmer family", "Additional crop support"] }),

  scheme("rajasthan-girl-child", "Rajasthan Girl Child Scheme", "Women & Child", "Rajasthan Women & Child Dept", "state", [
    { field: "gender", operator: "eq", value: "female", label: "Girl child" },
    { field: "state", operator: "eq", value: "Rajasthan", label: "Rajasthan resident" },
    { field: "age", operator: "lte", value: 18, label: "Girl below 18 years" },
  ], { applicableStates: ["Rajasthan"], icon: "🎀", colorTheme: "#9C27B0", benefits: ["Birth incentive", "Education scholarship", "Marriage assistance at 18"] }),

  scheme("wb-kanyashree", "WB Kanyashree Prakalpa", "Women & Child", "West Bengal Women Development", "state", [
    { field: "gender", operator: "eq", value: "female", label: "Girl student" },
    { field: "state", operator: "eq", value: "West Bengal", label: "West Bengal resident" },
    { field: "isStudent", operator: "boolean", value: true, label: "Enrolled in school/college" },
  ], { applicableStates: ["West Bengal"], icon: "📖", colorTheme: "#3F51B5", benefits: ["Annual scholarship ₹750-1000", "One-time grant at 18"] }),

  scheme("punjab-farmer-debt", "Punjab Farmer Debt Waiver", "Agriculture", "Punjab Agriculture Dept", "state", [
    { field: "isFarmer", operator: "boolean", value: true, label: "Indebted farmer" },
    { field: "state", operator: "eq", value: "Punjab", label: "Punjab resident" },
    { field: "annualIncome", operator: "lte", value: 500000, label: "Small farmer income criteria" },
  ], { applicableStates: ["Punjab"], icon: "🌾", colorTheme: "#FFC107", benefits: ["Crop loan waiver up to ₹2 lakh", "Fresh credit access"] }),

  scheme("bihar-student-credit", "Bihar Student Credit Card", "Education", "Bihar Education Dept", "state", [
    { field: "isStudent", operator: "boolean", value: true, label: "Bihar domicile student" },
    { field: "state", operator: "eq", value: "Bihar", label: "Bihar resident" },
    { field: "age", operator: "lte", value: 25, label: "Age below 25 years" },
  ], { applicableStates: ["Bihar"], icon: "💳", colorTheme: "#795548", benefits: ["Education loan up to ₹4 lakh", "Low interest rate", "No collateral up to ₹4 lakh"] }),

  scheme("telangana-rythu", "Telangana Rythu Bandhu", "Agriculture", "Telangana Agriculture Dept", "state", [
    { field: "isFarmer", operator: "boolean", value: true, label: "Telangana farmer with land" },
    { field: "state", operator: "eq", value: "Telangana", label: "Telangana resident" },
  ], { applicableStates: ["Telangana"], icon: "🌻", colorTheme: "#CDDC39", benefits: ["₹5,000/acre per season", "Investment support for crops"] }),

  scheme("senior-citizen-pension", "Indira Gandhi National Old Age Pension", "Senior Citizens", "Ministry of Rural Development", "central", [
    { field: "isSeniorCitizen", operator: "boolean", value: true, label: "Age 60 years or above" },
    { field: "annualIncome", operator: "lte", value: 100000, label: "BPL category income" },
  ], { icon: "🧓", colorTheme: "#607D8B", benefits: ["Monthly pension ₹200-500", "State top-up additional amount"], requiredDocuments: ["Aadhaar Card", "Age Proof", "Bank Passbook", "BPL Certificate"] }),

  scheme("disability-pension", "National Disability Pension", "Social Welfare", "Ministry of Social Justice", "central", [
    { field: "hasDisability", operator: "boolean", value: true, label: "Person with disability (40%+)" },
    { field: "annualIncome", operator: "lte", value: 150000, label: "BPL family income" },
  ], { icon: "♿", colorTheme: "#009688", benefits: ["Monthly pension ₹300", "Additional state benefits"], requiredDocuments: ["Aadhaar Card", "Disability Certificate", "Income Certificate", "Bank Passbook"] }),

  scheme("widow-pension", "National Widow Pension", "Women & Child", "Ministry of Rural Development", "central", [
    { field: "isWidow", operator: "boolean", value: true, label: "Widow aged 40-79 years" },
    { field: "gender", operator: "eq", value: "female", label: "Woman" },
    { field: "annualIncome", operator: "lte", value: 100000, label: "BPL category" },
  ], { icon: "🕊️", colorTheme: "#673AB7", benefits: ["Monthly pension ₹300", "State supplementary amount"], requiredDocuments: ["Aadhaar Card", "Husband Death Certificate", "Income Certificate"] }),
];
