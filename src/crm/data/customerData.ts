export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContact: string;
  status: 'active' | 'inactive' | 'prospect' | 'lead';
  avatar?: string;
}

export interface Activity {
  id: string;
  customerId: string;
  type: 'call' | 'meeting' | 'email';
  title: string;
  description: string;
  date: string;
  time: string;
  metadata?: {
    duration?: number; // for calls, in minutes
    outcome?: string; // for calls
    attendees?: string[]; // for meetings
    meetingType?: 'in-person' | 'virtual'; // for meetings
    subject?: string; // for emails
    direction?: 'sent' | 'received'; // for emails
    sender?: string; // for emails
    recipient?: string; // for emails
  };
}

export const customersData: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Acme Corp',
    email: 'john.smith@acmecorp.com',
    phone: '+1 (555) 123-4567',
    lastContact: '2024-01-15',
    status: 'active',
    avatar: 'JS'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'TechSolutions Inc',
    email: 'sarah.johnson@techsolutions.com',
    phone: '+1 (555) 234-5678',
    lastContact: '2024-01-14',
    status: 'active',
    avatar: 'SJ'
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Global Media',
    email: 'michael.brown@globalmedia.com',
    phone: '+1 (555) 345-6789',
    lastContact: '2024-01-12',
    status: 'prospect',
    avatar: 'MB'
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'RetailGiant',
    email: 'emily.davis@retailgiant.com',
    phone: '+1 (555) 456-7890',
    lastContact: '2024-01-10',
    status: 'active',
    avatar: 'ED'
  },
  {
    id: '5',
    name: 'David Wilson',
    company: 'HealthCare Pro',
    email: 'david.wilson@healthcarepro.com',
    phone: '+1 (555) 567-8901',
    lastContact: '2024-01-08',
    status: 'lead',
    avatar: 'DW'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    company: 'Innovation Labs',
    email: 'lisa.anderson@innovationlabs.com',
    phone: '+1 (555) 678-9012',
    lastContact: '2024-01-05',
    status: 'inactive',
    avatar: 'LA'
  },
  {
    id: '7',
    name: 'Robert Miller',
    company: 'Enterprise Systems',
    email: 'robert.miller@enterprisesystems.com',
    phone: '+1 (555) 789-0123',
    lastContact: '2024-01-03',
    status: 'active',
    avatar: 'RM'
  },
  {
    id: '8',
    name: 'Jennifer Garcia',
    company: 'Digital Dynamics',
    email: 'jennifer.garcia@digitaldynamics.com',
    phone: '+1 (555) 890-1234',
    lastContact: '2023-12-28',
    status: 'prospect',
    avatar: 'JG'
  }
];

export const activitiesData: Activity[] = [
  // John Smith (Customer 1) activities
  {
    id: 'act-1',
    customerId: '1',
    type: 'call',
    title: 'Follow-up call about Q1 requirements',
    description: 'Discussed upcoming project requirements and timeline for Q1 delivery.',
    date: '2024-01-15',
    time: '2:30 PM',
    metadata: {
      duration: 25,
      outcome: 'Positive - Moving to proposal stage'
    }
  },
  {
    id: 'act-2',
    customerId: '1',
    type: 'email',
    title: 'Project proposal sent',
    description: 'Sent detailed project proposal with pricing and timeline.',
    date: '2024-01-14',
    time: '10:15 AM',
    metadata: {
      subject: 'Q1 Project Proposal - Acme Corp',
      direction: 'sent',
      recipient: 'john.smith@acmecorp.com'
    }
  },
  {
    id: 'act-3',
    customerId: '1',
    type: 'meeting',
    title: 'Initial requirements gathering',
    description: 'Met with the technical team to understand project scope and requirements.',
    date: '2024-01-10',
    time: '1:00 PM',
    metadata: {
      meetingType: 'virtual',
      attendees: ['John Smith', 'Technical Lead', 'Project Manager']
    }
  },
  
  // Sarah Johnson (Customer 2) activities
  {
    id: 'act-4',
    customerId: '2',
    type: 'email',
    title: 'Contract revision received',
    description: 'Received contract revisions from legal team.',
    date: '2024-01-14',
    time: '3:45 PM',
    metadata: {
      subject: 'Contract Revisions - TechSolutions Agreement',
      direction: 'received',
      sender: 'sarah.johnson@techsolutions.com'
    }
  },
  {
    id: 'act-5',
    customerId: '2',
    type: 'call',
    title: 'Contract negotiation call',
    description: 'Discussed contract terms and pricing adjustments.',
    date: '2024-01-12',
    time: '11:00 AM',
    metadata: {
      duration: 40,
      outcome: 'Agreement on revised terms'
    }
  },
  {
    id: 'act-6',
    customerId: '2',
    type: 'meeting',
    title: 'Quarterly business review',
    description: 'Reviewed Q4 performance and discussed 2024 goals.',
    date: '2024-01-08',
    time: '9:30 AM',
    metadata: {
      meetingType: 'in-person',
      attendees: ['Sarah Johnson', 'VP Sales', 'Account Manager']
    }
  },

  // Michael Brown (Customer 3) activities
  {
    id: 'act-7',
    customerId: '3',
    type: 'call',
    title: 'Discovery call for website redesign',
    description: 'Initial conversation about website redesign project needs.',
    date: '2024-01-12',
    time: '4:15 PM',
    metadata: {
      duration: 30,
      outcome: 'Interested - Scheduling demo'
    }
  },
  {
    id: 'act-8',
    customerId: '3',
    type: 'email',
    title: 'Portfolio and case studies shared',
    description: 'Sent relevant portfolio pieces and case studies.',
    date: '2024-01-11',
    time: '9:20 AM',
    metadata: {
      subject: 'Website Redesign Portfolio - Global Media',
      direction: 'sent',
      recipient: 'michael.brown@globalmedia.com'
    }
  },

  // Emily Davis (Customer 4) activities
  {
    id: 'act-9',
    customerId: '4',
    type: 'meeting',
    title: 'Implementation kickoff meeting',
    description: 'Project kickoff for CRM implementation with technical team.',
    date: '2024-01-10',
    time: '10:00 AM',
    metadata: {
      meetingType: 'virtual',
      attendees: ['Emily Davis', 'IT Director', 'Implementation Team']
    }
  },
  {
    id: 'act-10',
    customerId: '4',
    type: 'email',
    title: 'Implementation schedule confirmed',
    description: 'Confirmed project timeline and key milestones.',
    date: '2024-01-09',
    time: '2:30 PM',
    metadata: {
      subject: 'CRM Implementation Schedule - RetailGiant',
      direction: 'sent',
      recipient: 'emily.davis@retailgiant.com'
    }
  },

  // David Wilson (Customer 5) activities
  {
    id: 'act-11',
    customerId: '5',
    type: 'call',
    title: 'Introduction call',
    description: 'Initial introduction and needs assessment call.',
    date: '2024-01-08',
    time: '3:00 PM',
    metadata: {
      duration: 20,
      outcome: 'Qualified lead - Scheduling follow-up'
    }
  },
  {
    id: 'act-12',
    customerId: '5',
    type: 'email',
    title: 'Welcome email and company overview',
    description: 'Sent introduction email with company overview and capabilities.',
    date: '2024-01-07',
    time: '11:45 AM',
    metadata: {
      subject: 'Welcome to our partnership - HealthCare Pro',
      direction: 'sent',
      recipient: 'david.wilson@healthcarepro.com'
    }
  }
];

export const getCustomerById = (id: string): Customer | undefined => {
  return customersData.find(customer => customer.id === id);
};

export const getActivitiesByCustomerId = (customerId: string): Activity[] => {
  return activitiesData
    .filter(activity => activity.customerId === customerId)
    .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
};

export const getStatusColor = (status: Customer['status']): 'success' | 'warning' | 'info' | 'default' => {
  switch (status) {
    case 'active':
      return 'success';
    case 'prospect':
      return 'info';
    case 'lead':
      return 'warning';
    case 'inactive':
      return 'default';
    default:
      return 'default';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string, timeString: string): string => {
  const date = new Date(dateString + ' ' + timeString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
