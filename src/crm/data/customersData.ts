export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContactDate: string;
  accountStatus: 'Active' | 'Inactive' | 'Prospect' | 'Lost';
}

export interface Activity {
  id: string;
  customerId: string;
  type: 'call' | 'meeting' | 'email';
  date: string;
  title: string;
  details: {
    duration?: string;
    outcome?: string;
    notes?: string;
    meetingType?: 'In-person' | 'Virtual';
    attendees?: string[];
    subject?: string;
    sender?: string;
    recipient?: string;
  };
}

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Solutions',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    lastContactDate: '2024-01-15',
    accountStatus: 'Active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'DataFlow Systems',
    email: 'michael.chen@dataflow.com',
    phone: '+1 (555) 234-5678',
    lastContactDate: '2024-01-12',
    accountStatus: 'Active'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'CloudFirst Inc',
    email: 'emily.rodriguez@cloudfirst.com',
    phone: '+1 (555) 345-6789',
    lastContactDate: '2024-01-10',
    accountStatus: 'Prospect'
  },
  {
    id: '4',
    name: 'David Williams',
    company: 'Enterprise Solutions',
    email: 'david.williams@enterprise.com',
    phone: '+1 (555) 456-7890',
    lastContactDate: '2024-01-08',
    accountStatus: 'Active'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    company: 'StartUp Innovations',
    email: 'lisa.thompson@startup.com',
    phone: '+1 (555) 567-8901',
    lastContactDate: '2024-01-05',
    accountStatus: 'Inactive'
  },
  {
    id: '6',
    name: 'Robert Anderson',
    company: 'Global Enterprises',
    email: 'robert.anderson@global.com',
    phone: '+1 (555) 678-9012',
    lastContactDate: '2024-01-03',
    accountStatus: 'Lost'
  },
  {
    id: '7',
    name: 'Jennifer Miller',
    company: 'InnovateTech',
    email: 'jennifer.miller@innovate.com',
    phone: '+1 (555) 789-0123',
    lastContactDate: '2024-01-14',
    accountStatus: 'Active'
  },
  {
    id: '8',
    name: 'Christopher Davis',
    company: 'Future Systems',
    email: 'christopher.davis@future.com',
    phone: '+1 (555) 890-1234',
    lastContactDate: '2024-01-11',
    accountStatus: 'Prospect'
  }
];

export const activities: Activity[] = [
  // Activities for Sarah Johnson (Customer 1)
  {
    id: 'a1',
    customerId: '1',
    type: 'call',
    date: '2024-01-15T10:30:00Z',
    title: 'Quarterly Review Call',
    details: {
      duration: '45 minutes',
      outcome: 'Positive',
      notes: 'Discussed Q1 goals and potential expansion opportunities. Sarah mentioned interest in our new analytics module.'
    }
  },
  {
    id: 'a2',
    customerId: '1',
    type: 'email',
    date: '2024-01-12T14:20:00Z',
    title: 'Follow-up on Analytics Module',
    details: {
      subject: 'Analytics Module Demo Schedule',
      sender: 'alex@acmecrm.com',
      recipient: 'sarah.johnson@techcorp.com'
    }
  },
  {
    id: 'a3',
    customerId: '1',
    type: 'meeting',
    date: '2024-01-08T15:00:00Z',
    title: 'Product Demo Session',
    details: {
      meetingType: 'Virtual',
      attendees: ['Sarah Johnson', 'Alex Thompson', 'Tech Team Lead'],
      notes: 'Comprehensive demo of new features. Positive feedback received.'
    }
  },
  
  // Activities for Michael Chen (Customer 2)
  {
    id: 'a4',
    customerId: '2',
    type: 'email',
    date: '2024-01-12T09:15:00Z',
    title: 'Contract Renewal Discussion',
    details: {
      subject: 'Annual Contract Renewal - DataFlow Systems',
      sender: 'michael.chen@dataflow.com',
      recipient: 'alex@acmecrm.com'
    }
  },
  {
    id: 'a5',
    customerId: '2',
    type: 'call',
    date: '2024-01-09T16:45:00Z',
    title: 'Technical Support Call',
    details: {
      duration: '30 minutes',
      outcome: 'Resolved',
      notes: 'Helped resolve integration issues with their legacy systems.'
    }
  },
  {
    id: 'a6',
    customerId: '2',
    type: 'meeting',
    date: '2024-01-05T11:00:00Z',
    title: 'Strategic Planning Meeting',
    details: {
      meetingType: 'In-person',
      attendees: ['Michael Chen', 'CTO DataFlow', 'Alex Thompson'],
      notes: 'Discussed roadmap alignment and upcoming feature requests.'
    }
  },

  // Activities for Emily Rodriguez (Customer 3)
  {
    id: 'a7',
    customerId: '3',
    type: 'call',
    date: '2024-01-10T13:30:00Z',
    title: 'Initial Discovery Call',
    details: {
      duration: '60 minutes',
      outcome: 'Interested',
      notes: 'Emily showed strong interest in our cloud solutions. Needs to discuss with board.'
    }
  },
  {
    id: 'a8',
    customerId: '3',
    type: 'email',
    date: '2024-01-07T10:00:00Z',
    title: 'Proposal Sent',
    details: {
      subject: 'CloudFirst Inc - Customized Solution Proposal',
      sender: 'alex@acmecrm.com',
      recipient: 'emily.rodriguez@cloudfirst.com'
    }
  },

  // Activities for David Williams (Customer 4)
  {
    id: 'a9',
    customerId: '4',
    type: 'meeting',
    date: '2024-01-08T14:00:00Z',
    title: 'Implementation Review',
    details: {
      meetingType: 'Virtual',
      attendees: ['David Williams', 'Implementation Team', 'Alex Thompson'],
      notes: 'Reviewed implementation progress. 80% complete, on track for deadline.'
    }
  },
  {
    id: 'a10',
    customerId: '4',
    type: 'call',
    date: '2024-01-04T12:00:00Z',
    title: 'Weekly Check-in',
    details: {
      duration: '20 minutes',
      outcome: 'On Track',
      notes: 'Regular progress update. No blockers identified.'
    }
  },

  // Activities for Lisa Thompson (Customer 5)
  {
    id: 'a11',
    customerId: '5',
    type: 'email',
    date: '2024-01-05T16:30:00Z',
    title: 'Account Reactivation Inquiry',
    details: {
      subject: 'Re: Account Status - StartUp Innovations',
      sender: 'lisa.thompson@startup.com',
      recipient: 'alex@acmecrm.com'
    }
  },
  {
    id: 'a12',
    customerId: '5',
    type: 'call',
    date: '2024-01-02T11:30:00Z',
    title: 'Account Suspension Discussion',
    details: {
      duration: '25 minutes',
      outcome: 'Paused',
      notes: 'Discussed budget constraints. Agreed to pause account temporarily.'
    }
  },

  // Activities for Robert Anderson (Customer 6)
  {
    id: 'a13',
    customerId: '6',
    type: 'call',
    date: '2024-01-03T15:45:00Z',
    title: 'Final Attempt Call',
    details: {
      duration: '15 minutes',
      outcome: 'Lost',
      notes: 'Customer decided to go with competitor solution. Competitive pricing was the main factor.'
    }
  },
  {
    id: 'a14',
    customerId: '6',
    type: 'email',
    date: '2023-12-28T14:00:00Z',
    title: 'Last Effort Proposal',
    details: {
      subject: 'Final Proposal - Global Enterprises Partnership',
      sender: 'alex@acmecrm.com',
      recipient: 'robert.anderson@global.com'
    }
  },

  // Activities for Jennifer Miller (Customer 7)
  {
    id: 'a15',
    customerId: '7',
    type: 'meeting',
    date: '2024-01-14T10:00:00Z',
    title: 'Feature Request Discussion',
    details: {
      meetingType: 'Virtual',
      attendees: ['Jennifer Miller', 'Product Manager', 'Alex Thompson'],
      notes: 'Discussed new feature requirements for mobile app integration.'
    }
  },
  {
    id: 'a16',
    customerId: '7',
    type: 'email',
    date: '2024-01-11T13:20:00Z',
    title: 'Mobile Integration Update',
    details: {
      subject: 'Mobile App Integration Timeline',
      sender: 'alex@acmecrm.com',
      recipient: 'jennifer.miller@innovate.com'
    }
  },

  // Activities for Christopher Davis (Customer 8)
  {
    id: 'a17',
    customerId: '8',
    type: 'call',
    date: '2024-01-11T14:15:00Z',
    title: 'Needs Assessment Call',
    details: {
      duration: '40 minutes',
      outcome: 'Promising',
      notes: 'Comprehensive needs assessment. Good fit for our enterprise package.'
    }
  },
  {
    id: 'a18',
    customerId: '8',
    type: 'email',
    date: '2024-01-08T11:45:00Z',
    title: 'Information Request Response',
    details: {
      subject: 'Re: Enterprise Package Information',
      sender: 'alex@acmecrm.com',
      recipient: 'christopher.davis@future.com'
    }
  }
];

// Helper function to get activities for a specific customer
export const getCustomerActivities = (customerId: string): Activity[] => {
  return activities
    .filter(activity => activity.customerId === customerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Helper function to get a customer by ID
export const getCustomerById = (customerId: string): Customer | undefined => {
  return customers.find(customer => customer.id === customerId);
};
