export type nodeType = "item" | "group";

export interface TreeNode {
  id: string;
  title: string;
  type: nodeType;
  sortOrder?: string;
  keys?: any;
  items?: TreeNode[];
}

export const menuItems: TreeNode[] = [
  {
    id: "1",
    type: "item",
    sortOrder: "4",
    title: "Home",
    items: [],
    keys: {},
  },
  {
    id: "2",
    title: "Master",
    type: "group",
    sortOrder: "1",
    items: [
      {
        id: "2-1",
        type: "item",
        sortOrder: "1",
        title: "Bank master",
        keys: {},
      },
      {
        id: "2-2",
        type: "item",
        sortOrder: "2",
        title: "Branch master",
        keys: {},
      },
      {
        id: "2-3",
        type: "item",
        sortOrder: "3",
        title: "Account master",
        keys: {},
      },
    ],
  },
  {
    id: "3",
    title: "User",
    type: "group",
    sortOrder: "1",
    items: [
      { id: "3-1", type: "item", sortOrder: "1", title: "Admin", keys: {} },
      { id: "3-2", type: "item", sortOrder: "2", title: "tenants", keys: {} },
      { id: "3-3", type: "item", sortOrder: "3", title: "Privacy", keys: {} },
    ],
  },
  {
    id: "4",
    title: "Accounts",
    sortOrder: "2",
    type: "group",
    items: [
      {
        id: "4-1",
        title: "Loans",
        type: "group",
        sortOrder: "1",
        items: [
          {
            id: "4-1-1",
            type: "item",
            sortOrder: "1",
            title: "Loan processing",
            keys: {},
          },
          {
            id: "4-1-2",
            type: "item",
            sortOrder: "2",
            title: "Querying",
            keys: {},
          },
        ],
      },
      { id: "4-2", type: "item", sortOrder: "2", title: "Savings", keys: {} },
    ],
  },
];

export type sortingConditions =
  | "Newest"
  | "Oldest"
  | "Recently Modified"
  | "Recently Created"
  | "";

export const countryList = [
  {
    country: "India",

    code: "+91",

    mobile_number_length: 10,

    flag_image: "https://flagcdn.com/in.svg",
  },

  {
    country: "USA",

    code: "+1",

    mobile_number_length: 10,

    flag_image: "https://flagcdn.com/us.svg",
  },

  {
    country: "Kenya",

    code: "+254",

    mobile_number_length: 9,

    flag_image: "https://flagcdn.com/ke.svg",
  },

  {
    country: "Dubai",

    code: "+971",

    mobile_number_length: 9,

    flag_image: "https://flagcdn.com/ae.svg",
  },

  {
    country: "Australia",

    code: "+61",

    mobile_number_length: 9,

    flag_image: "https://flagcdn.com/au.svg",
  },
];

export const tenantData = [
  {
    Code: "ABC",
    Name: "ABC bank",
    Logo: "",
    ENV: [
      {
        code: "DEV",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
      {
        code: "BETA",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
      {
        code: "RELEASE",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
    ],
  },
  {
    Code: "GSS",
    Name: "Global Software Solutions",
    Logo: "",
    ENV: [
      {
        code: "DEV",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
      {
        code: "BETA",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
      {
        code: "RELEASE",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
    ],
  },
  {
    Code: "EQB",
    Name: "Equity bank",
    Logo: "",
    ENV: [
      {
        code: "DEV",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
      {
        code: "BETA",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
      {
        code: "RELEASE",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
    ],
  },
  {
    Code: "FAB",
    Name: "First Abudhabi bank",
    Logo: "",
    ENV: [
      {
        code: "DEV",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
      {
        code: "BETA",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
      {
        code: "RELEASE",
        HostName: "DevServer",
        HostIP: "192.168.2.165",
        volumePath: "3005",
      },
    ],
  },
];

export const industryList = {
  "Information Technology (IT)": [
    "Software Development Company",
    "IT Consultancy Firm",
    "Cloud Services Provider",
    "Managed Services Provider (MSP)",
    "Data Analytics Company",
    "Cybersecurity Firm",
  ],
  Healthcare: [
    "Hospital/Healthcare Provider",
    "Medical Device Manufacturer",
    "HealthTech Start-Up",
    "Pharmaceutical Research Company",
    "Telemedicine Service Provider",
  ],
  "Financial Services": [
    "Bank/Financial Institution",
    "Insurance Company",
    "Investment Firm",
    "FinTech Start-Up",
    "Payment Gateway Provider",
  ],
  Manufacturing: [
    "Industrial Manufacturing Company",
    "Electronics Manufacturer",
    "Automotive Manufacturer",
    "Consumer Goods Manufacturer",
    "Aerospace Manufacturer",
  ],
  "Retail & E-commerce": [
    "Online Retailer (E-commerce)",
    "Brick-and-Mortar Retail Store",
    "Wholesale Distributor",
    "Marketplace Platform Provider",
    "Retail Tech Company",
  ],
  Telecommunications: [
    "Telecom Network Provider",
    "Internet Service Provider (ISP)",
    "Mobile Network Operator",
    "Telecom Equipment Manufacturer",
    "Satellite Communications Company",
  ],
  Education: [
    "Educational Institution (School, College, University)",
    "EdTech Start-Up",
    "Online Learning Platform",
    "Educational Publishing Company",
    "Training & Development Organization",
  ],
  "Real Estate": [
    "Real Estate Development Company",
    "Property Management Firm",
    "Real Estate Investment Trust (REIT)",
    "Real Estate Agency",
    "Online Property Marketplace",
  ],
  "Transportation & Logistics": [
    "Logistics Service Provider",
    "Freight Forwarding Company",
    "Transportation Management System (TMS) Provider",
    "Shipping Company",
    "Ride-Hailing/Delivery Service",
  ],
  Construction: [
    "Construction Company",
    "Civil Engineering Firm",
    "General Contractor",
    "Architecture and Design Firm",
    "Building Materials Supplier",
  ],
  "Hospitality & Tourism": [
    "Hotel/Resort Chain",
    "Travel Agency",
    "Online Travel Booking Platform",
    "Restaurant Group",
    "Event Management Company",
  ],
  "Energy & Utilities": [
    "Power Generation Company",
    "Renewable Energy Provider",
    "Oil & Gas Company",
    "Utility Services Provider (Electricity, Water, Gas)",
    "Energy Consultancy Firm",
  ],
  "Media & Entertainment": [
    "Media Production Company (TV, Film, Radio)",
    "Publishing House",
    "Online Streaming Platform",
    "Advertising Agency",
    "Video Game Development Studio",
  ],
  Automotive: [
    "Automobile Manufacturer",
    "Auto Parts Supplier",
    "Automotive Design Firm",
    "Electric Vehicle (EV) Company",
    "Auto Dealership",
  ],
  "Aerospace & Defense": [
    "Aerospace Manufacturer",
    "Defense Contractor",
    "Aviation Services Provider",
    "Space Technology Company",
    "Military Equipment Manufacturer",
  ],
  Agriculture: [
    "Agribusiness Company",
    "Farm Equipment Manufacturer",
    "Food Processing Company",
    "AgriTech Start-Up",
    "Agricultural Cooperative",
  ],
  "Pharmaceuticals & Biotechnology": [
    "Pharmaceutical Manufacturer",
    "Biotech Research Firm",
    "Drug Development Company",
    "Contract Research Organization (CRO)",
    "Clinical Trials Management Organization",
  ],
  "Public Sector & Government": [
    "Government Department or Agency",
    "Public Health Institution",
    "Municipal Corporation",
    "Defense Organization",
    "Government Consultancy Services",
  ],
  "Non-Profit & Social Services": [
    "Charitable Organization",
    "NGO (Non-Governmental Organization)",
    "Social Enterprise",
    "Advocacy Group",
    "Humanitarian Aid Organization",
  ],
  "Professional Services": [
    "Legal Services Firm",
    "Accounting & Audit Firm",
    "Consulting Services Provider",
    "Human Resources (HR) Services Company",
    "Marketing & Advertising Agency",
  ],
  "Food & Beverage": [
    "Restaurant Chain",
    "Food Processing Company",
    "Beverage Manufacturer",
    "Catering Services Provider",
    "Packaged Food Company",
  ],
  Insurance: [
    "Life Insurance Company",
    "General Insurance Company",
    "Reinsurance Company",
    "Insurance Brokerage Firm",
    "InsurTech Start-Up",
  ],
  "Legal Services": [
    "Law Firm",
    "Legal Consultancy Firm",
    "Corporate Legal Department",
    "Intellectual Property (IP) Services Firm",
    "Legal Tech Start-Up",
  ],
  "Mining & Natural Resources": [
    "Mining Company",
    "Natural Gas Extraction Company",
    "Oil Exploration Company",
    "Renewable Resources Company",
    "Commodities Trading Firm",
  ],
  "Environmental Services": [
    "Environmental Consultancy",
    "Waste Management Company",
    "Renewable Energy Provider",
    "Sustainable Development Firm",
    "Water Treatment Services",
  ],
};

export const organizationSize = [
  "1-10 employees.",
  "11-50 employees.",
  "51-200 employees.",
  "201-500 employees.",
  "501-1000 employees.",
  "1000+ employees."
]

export const orpMatrixTemplate = [
  {
    "orgGrpName": "",
    "orgGrpCode": "",
    "org": [
        {
            "orgCode": "",
            "orgName": "",
            "roleGrp": [
                {
                    "roleGrpName": "",
                    "roleGrpCode": "",
                    "roles": [
                        {
                            "roleCode": "",
                            "roleName": "",
                            "psGrp": [
                                {
                                    "psGrpCode": "",
                                    "psGrpName": "",
                                    "ps": [
                                        {
                                            "psCode": "",
                                            "psName": ""
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
]
