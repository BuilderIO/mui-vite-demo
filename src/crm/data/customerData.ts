export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContactDate: string;
  status: 'active' | 'inactive' | 'prospect' | 'lead';
}

export interface Activity {
  id: string;
  customerId: string;
  type: 'call' | 'meeting' | 'email';
  date: string;
  title: string;
  details: {
    duration?: number; // for calls, in minutes
    outcome?: string; // for calls
    notes?: string;
    meetingType?: 'in-person' | 'virtual'; // for meetings
    attendees?: string[]; // for meetings
    subject?: string; // for emails
    sender?: string; // for emails
    recipient?: string; // for emails
  };
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Solutions',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    lastContactDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Global Dynamics',
    email: 'sarah.j@globaldynamics.com',
    phone: '+1 (555) 987-6543',
    lastContactDate: '2024-01-14',
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Chen',
    company: 'Innovation Labs',
    email: 'mchen@innovationlabs.io',
    phone: '+1 (555) 456-7890',
    lastContactDate: '2024-01-12',
    status: 'prospect'
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'StartupCo',
    email: 'emily@startupco.com',
    phone: '+1 (555) 234-5678',
    lastContactDate: '2024-01-10',
    status: 'lead'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    company: 'Enterprise Systems',
    email: 'rwilson@enterprisesys.com',
    phone: '+1 (555) 345-6789',
    lastContactDate: '2024-01-08',
    status: 'inactive'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    company: 'Digital Solutions',
    email: 'lisa.anderson@digitalsol.com',
    phone: '+1 (555) 567-8901',
    lastContactDate: '2024-01-16',
    status: 'active'
  }
];

export const mockActivities: Activity[] = [
  // John Smith activities
  {
    id: 'a1',
    customerId: '1',
    type: 'call',
    date: '2024-01-15T10:30:00Z',
    title: 'Follow-up call',
    details: {
      duration: 25,
      outcome: 'Interested in proposal',
      notes: 'Customer expressed interest in our enterprise package. Scheduled demo for next week.'
    }
  },
  {
    id: 'a2',
    customerId: '1',
    type: 'email',
    date: '2024-01-12T14:22:00Z',
    title: 'Proposal sent',
    details: {
      subject: 'Enterprise Package Proposal - TechCorp Solutions',
      sender: 'alex@acmecrm.com',
      recipient: 'john.smith@techcorp.com'
    }
  },
  {
    id: 'a3',
    customerId: '1',
    type: 'meeting',
    date: '2024-01-10T09:00:00Z',
    title: 'Initial consultation',
    details: {
      meetingType: 'virtual',
      attendees: ['John Smith', 'Alex Thompson', 'Sarah Miller'],
      notes: 'Discussed current pain points and potential solutions. Very promising lead.'
    }
  },
  
  // Sarah Johnson activities
  {
    id: 'a4',
    customerId: '2',
    type: 'email',
    date: '2024-01-14T16:45:00Z',
    title: 'Contract review',
    details: {
      subject: 'Contract Amendment - Global Dynamics',
      sender: 'sarah.j@globaldynamics.com',
      recipient: 'alex@acmecrm.com'
    }
  },
  {
    id: 'a5',
    customerId: '2',
    type: 'call',
    date: '2024-01-11T11:15:00Z',
    title: 'Contract negotiation',
    details: {
      duration: 45,
      outcome: 'Terms agreed',
      notes: 'Finalized pricing and implementation timeline. Contract to be signed this week.'
    }
  },
  
  // Michael Chen activities
  {
    id: 'a6',
    customerId: '3',
    type: 'meeting',
    date: '2024-01-12T14:00:00Z',
    title: 'Product demo',
    details: {
      meetingType: 'in-person',
      attendees: ['Michael Chen', 'Alex Thompson', 'Tech Team'],
      notes: 'Comprehensive product demonstration. Customer impressed with AI features.'
    }
  },
  {
    id: 'a7',
    customerId: '3',
    type: 'call',
    date: '2024-01-09T15:30:00Z',
    title: 'Discovery call',
    details: {
      duration: 30,
      outcome: 'Qualified lead',
      notes: 'Budget confirmed, decision timeline established. Good fit for our solution.'
    }
  },
  
  // Emily Davis activities
  {
    id: 'a8',
    customerId: '4',
    type: 'email',
    date: '2024-01-10T08:30:00Z',
    title: 'Welcome email',
    details: {
      subject: 'Welcome to our CRM platform!',
      sender: 'alex@acmecrm.com',
      recipient: 'emily@startupco.com'
    }
  },
  
  // Robert Wilson activities
  {
    id: 'a9',
    customerId: '5',
    type: 'call',
    date: '2024-01-08T13:20:00Z',
    title: 'Check-in call',
    details: {
      duration: 15,
      outcome: 'No immediate needs',
      notes: 'Routine check-in. Customer satisfied with current service, no immediate needs.'
    }
  },
  
  // Lisa Anderson activities
  {
    id: 'a10',
    customerId: '6',
    type: 'meeting',
    date: '2024-01-16T10:00:00Z',
    title: 'Quarterly review',
    details: {
      meetingType: 'virtual',
      attendees: ['Lisa Anderson', 'Alex Thompson', 'Account Manager'],
      notes: 'Reviewed Q4 performance metrics. Discussed expansion opportunities for Q2.'
    }
  },
  {
    id: 'a11',
    customerId: '6',
    type: 'email',
    date: '2024-01-13T09:15:00Z',
    title: 'Meeting invitation',
    details: {
      subject: 'Q4 Review Meeting - Digital Solutions',
      sender: 'alex@acmecrm.com',
      recipient: 'lisa.anderson@digitalsol.com'
    }
  }
];
