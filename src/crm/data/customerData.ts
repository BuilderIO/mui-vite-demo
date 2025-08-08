export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContactDate: string;
  status: 'Active' | 'Inactive' | 'Prospect' | 'Lead';
  avatar?: string;
  title?: string;
  address?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  customerId: string;
  type: 'call' | 'meeting' | 'email';
  date: string;
  title: string;
  description: string;
  duration?: number; // in minutes for calls/meetings
  outcome?: string;
  attendees?: string[];
  subject?: string; // for emails
  sender?: string; // for emails
  recipient?: string; // for emails
  meetingType?: 'in-person' | 'virtual'; // for meetings
}

export const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Solutions',
    email: 'sarah.johnson@techcorp.com',
    phone: '(555) 123-4567',
    lastContactDate: '2024-01-15',
    status: 'Active',
    title: 'VP of Engineering',
    address: '123 Tech Street, San Francisco, CA 94105',
    notes: 'Key decision maker for enterprise software purchases'
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Innovate Industries',
    email: 'michael.chen@innovate.com',
    phone: '(555) 234-5678',
    lastContactDate: '2024-01-12',
    status: 'Prospect',
    title: 'CTO',
    address: '456 Innovation Blvd, Austin, TX 73301',
    notes: 'Interested in our enterprise platform, evaluating competitors'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Growth Dynamics',
    email: 'emily.rodriguez@growthdyn.com',
    phone: '(555) 345-6789',
    lastContactDate: '2024-01-10',
    status: 'Active',
    title: 'Director of Operations',
    address: '789 Growth Ave, New York, NY 10001',
    notes: 'Long-term customer, considering upgrade to premium tier'
  },
  {
    id: '4',
    name: 'David Williams',
    company: 'StartupFlow',
    email: 'david@startupflow.com',
    phone: '(555) 456-7890',
    lastContactDate: '2024-01-08',
    status: 'Lead',
    title: 'Founder & CEO',
    address: '321 Startup Lane, Seattle, WA 98101',
    notes: 'Early-stage startup, potential for growth as company scales'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    company: 'Enterprise Global',
    email: 'lisa.thompson@entglobal.com',
    phone: '(555) 567-8901',
    lastContactDate: '2024-01-05',
    status: 'Active',
    title: 'IT Director',
    address: '654 Enterprise Way, Chicago, IL 60601',
    notes: 'Manages IT procurement for 1000+ employee organization'
  },
  {
    id: '6',
    name: 'James Parker',
    company: 'Parker Consulting',
    email: 'james@parkerconsult.com',
    phone: '(555) 678-9012',
    lastContactDate: '2024-01-03',
    status: 'Inactive',
    title: 'Senior Consultant',
    address: '987 Consulting Circle, Boston, MA 02101',
    notes: 'Former customer, contract ended last quarter'
  }
];

export const sampleActivities: Activity[] = [
  // Activities for Sarah Johnson (Customer 1)
  {
    id: 'a1',
    customerId: '1',
    type: 'call',
    date: '2024-01-15',
    title: 'Quarterly Business Review',
    description: 'Discussed Q4 results and 2024 planning. Customer is very satisfied with current implementation.',
    duration: 45,
    outcome: 'Positive - planning renewal meeting'
  },
  {
    id: 'a2',
    customerId: '1',
    type: 'email',
    date: '2024-01-12',
    title: 'QBR Preparation Materials',
    description: 'Sent quarterly reports and usage analytics ahead of our scheduled call.',
    subject: 'Q4 Performance Reports - TechCorp Solutions',
    sender: 'account@ourcompany.com',
    recipient: 'sarah.johnson@techcorp.com'
  },
  {
    id: 'a3',
    customerId: '1',
    type: 'meeting',
    date: '2024-01-08',
    title: 'Product Demo - New Features',
    description: 'Demonstrated the new analytics dashboard and automation features to the engineering team.',
    duration: 60,
    meetingType: 'virtual',
    attendees: ['Sarah Johnson', 'Dev Team Lead', 'Product Manager']
  },

  // Activities for Michael Chen (Customer 2)
  {
    id: 'a4',
    customerId: '2',
    type: 'call',
    date: '2024-01-12',
    title: 'Discovery Call',
    description: 'Initial discovery to understand their current tech stack and pain points.',
    duration: 30,
    outcome: 'Interested - scheduling technical demo'
  },
  {
    id: 'a5',
    customerId: '2',
    type: 'email',
    date: '2024-01-10',
    title: 'Follow-up with Case Studies',
    description: 'Sent relevant case studies from similar companies in their industry.',
    subject: 'Case Studies - Enterprise Implementation Success Stories',
    sender: 'sales@ourcompany.com',
    recipient: 'michael.chen@innovate.com'
  },
  {
    id: 'a6',
    customerId: '2',
    type: 'meeting',
    date: '2024-01-05',
    title: 'Initial Consultation',
    description: 'First meeting to discuss their enterprise software needs and timeline.',
    duration: 45,
    meetingType: 'in-person',
    attendees: ['Michael Chen', 'VP Engineering', 'Sales Representative']
  },

  // Activities for Emily Rodriguez (Customer 3)
  {
    id: 'a7',
    customerId: '3',
    type: 'email',
    date: '2024-01-10',
    title: 'Premium Tier Information',
    description: 'Sent detailed information about premium features and pricing.',
    subject: 'Premium Tier Features and Benefits',
    sender: 'account@ourcompany.com',
    recipient: 'emily.rodriguez@growthdyn.com'
  },
  {
    id: 'a8',
    customerId: '3',
    type: 'call',
    date: '2024-01-07',
    title: 'Support Check-in',
    description: 'Regular support call to ensure everything is running smoothly.',
    duration: 20,
    outcome: 'Positive - considering upgrade'
  },

  // Activities for David Williams (Customer 4)
  {
    id: 'a9',
    customerId: '4',
    type: 'call',
    date: '2024-01-08',
    title: 'Startup Consultation',
    description: 'Discussed their current stage and how our solution could scale with their growth.',
    duration: 35,
    outcome: 'Interested - needs board approval'
  },
  {
    id: 'a10',
    customerId: '4',
    type: 'email',
    date: '2024-01-06',
    title: 'Startup Pricing Information',
    description: 'Provided startup-friendly pricing options and implementation timeline.',
    subject: 'Startup Package - Special Pricing & Implementation',
    sender: 'sales@ourcompany.com',
    recipient: 'david@startupflow.com'
  },

  // Activities for Lisa Thompson (Customer 5)
  {
    id: 'a11',
    customerId: '5',
    type: 'meeting',
    date: '2024-01-05',
    title: 'Enterprise Implementation Planning',
    description: 'Detailed planning session for enterprise-wide deployment across all departments.',
    duration: 90,
    meetingType: 'virtual',
    attendees: ['Lisa Thompson', 'IT Team', 'Department Heads', 'Implementation Specialist']
  },
  {
    id: 'a12',
    customerId: '5',
    type: 'call',
    date: '2024-01-03',
    title: 'Implementation Update',
    description: 'Status update on the enterprise rollout progress.',
    duration: 25,
    outcome: 'On track - next milestone in 2 weeks'
  },

  // Activities for James Parker (Customer 6)
  {
    id: 'a13',
    customerId: '6',
    type: 'email',
    date: '2024-01-03',
    title: 'Contract Completion',
    description: 'Final communication regarding contract completion and data export.',
    subject: 'Contract Completion - Data Export Available',
    sender: 'account@ourcompany.com',
    recipient: 'james@parkerconsult.com'
  },
  {
    id: 'a14',
    customerId: '6',
    type: 'call',
    date: '2023-12-28',
    title: 'Exit Interview',
    description: 'Conducted exit interview to understand reasons for not renewing.',
    duration: 30,
    outcome: 'Budget constraints - open to future discussions'
  }
];

// Helper functions
export const getCustomerById = (id: string): Customer | undefined => {
  return sampleCustomers.find(customer => customer.id === id);
};

export const getActivitiesByCustomerId = (customerId: string): Activity[] => {
  return sampleActivities
    .filter(activity => activity.customerId === customerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const formatPhoneNumber = (phone: string): string => {
  // Simple phone number formatting
  return phone.replace(/^\((\d{3})\)\s(\d{3})-(\d{4})$/, '$1-$2-$3');
};

export const getStatusColor = (status: Customer['status']): string => {
  switch (status) {
    case 'Active': return 'success';
    case 'Prospect': return 'info';
    case 'Lead': return 'warning';
    case 'Inactive': return 'default';
    default: return 'default';
  }
};

export const getActivityIcon = (type: Activity['type']): string => {
  switch (type) {
    case 'call': return 'PhoneRounded';
    case 'meeting': return 'VideoCallRounded';
    case 'email': return 'EmailRounded';
    default: return 'EventRounded';
  }
};
