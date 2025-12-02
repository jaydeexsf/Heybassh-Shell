// Types
export type CompanyStatus = 'New' | 'In Progress' | 'Customer' | 'Churned';

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  status: CompanyStatus;
  owner: string;
  createdAt: string;
  lastActivity: string;
}

export type DealStage = 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type DealStatus = 'Open' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  name: string;
  company: string;
  amount: number;
  stage: DealStage;
  status: DealStatus;
  owner: string;
  closeDate: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

// Local storage keys
const COMPANIES_KEY = 'heybassh-companies';
const DEALS_KEY = 'heybassh-deals';

// Initialize with dummy data if empty
const initializeStorage = <T>(key: string, initialData: T[]): T[] => {
  if (typeof window === 'undefined') return initialData;
  
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(stored) as T[];
};

// Generate dummy data
const generateDummyCompanies = (): Company[] => {
  const now = new Date().toISOString();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return [
    {
      id: '1',
      name: 'Acme Inc',
      domain: 'acme.com',
      industry: 'Technology',
      size: '51-200',
      status: 'Customer',
      owner: 'John Doe',
      createdAt: '2023-01-15T10:30:00Z',
      lastActivity: '2023-03-20T14:45:00Z',
    },
    {
      id: '2',
      name: 'Globex Corp',
      domain: 'globex.com',
      industry: 'Manufacturing',
      size: '201-500',
      status: 'In Progress',
      owner: 'Jane Smith',
      createdAt: '2023-02-10T09:15:00Z',
      lastActivity: '2023-04-05T11:20:00Z',
    },
    {
      id: '3',
      name: 'Initech',
      domain: 'initech.com',
      industry: 'Finance',
      size: '1001-5000',
      status: 'New',
      owner: 'Michael Scott',
      createdAt: '2023-03-05T13:45:00Z',
      lastActivity: '2023-03-05T13:45:00Z',
    },
  ];
};

const generateDummyDeals = (): Deal[] => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  return [
    {
      id: '1',
      name: 'Enterprise Plan',
      company: 'Acme Inc',
      amount: 50000,
      stage: 'Proposal',
      status: 'Open',
      owner: 'John Doe',
      closeDate: '2023-06-30',
      createdAt: '2023-03-10T10:30:00Z',
      updatedAt: '2023-04-15T14:20:00Z',
      lastActivity: sevenDaysAgo.toISOString(),
    },
    {
      id: '2',
      name: 'Premium Support',
      company: 'Globex Corp',
      amount: 25000,
      stage: 'Negotiation',
      status: 'Open',
      owner: 'Jane Smith',
      closeDate: '2023-05-15',
      createdAt: '2023-03-20T11:15:00Z',
      updatedAt: '2023-04-10T16:45:00Z',
      lastActivity: thirtyDaysAgo.toISOString(),
    },
  ];
};

// Initialize local storage with dummy data if empty
const initializeDummyData = () => {
  if (typeof window === 'undefined') return;
  
  // Initialize companies
  const companies = initializeStorage<Company>(COMPANIES_KEY, generateDummyCompanies());
  
  // Initialize deals with company names that exist in the companies data
  const companyNames = companies.map(c => c.name);
  const validDeals = generateDummyDeals().filter(deal => 
    companyNames.includes(deal.company)
  );
  initializeStorage<Deal>(DEALS_KEY, validDeals);
};

// CRUD operations for Companies
export const getCompanies = (): Company[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(COMPANIES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addCompany = (company: Omit<Company, 'id' | 'createdAt' | 'lastActivity'> & { lastActivity?: string }): Company => {
  if (typeof window === 'undefined') throw new Error('Cannot access localStorage on server');
  
  const companies = getCompanies();
  const now = new Date().toISOString();
  const newCompany: Company = {
    ...company,
    id: Date.now().toString(),
    createdAt: now,
    lastActivity: company.lastActivity || now,
  };
  
  localStorage.setItem(COMPANIES_KEY, JSON.stringify([...companies, newCompany]));
  return newCompany;
};

// CRUD operations for Deals
export const getDeals = (): Deal[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DEALS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addDeal = (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'lastActivity'> & { lastActivity?: string }): Deal => {
  if (typeof window === 'undefined') throw new Error('Cannot access localStorage on server');
  
  const deals = getDeals();
  const now = new Date().toISOString();
  const newDeal: Deal = {
    ...deal,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
    lastActivity: deal.lastActivity || now,
  };
  
  localStorage.setItem(DEALS_KEY, JSON.stringify([...deals, newDeal]));
  return newDeal;
};

// Initialize dummy data when the module is imported
if (typeof window !== 'undefined') {
  initializeDummyData();
}
