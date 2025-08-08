import { Customer, Activity, CallActivity, MeetingActivity, EmailActivity } from '../types/customerTypes';

export const customers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Sarah Wilson',
    company: 'TechCorp Solutions',
    email: 'sarah.wilson@techcorp.com',
    phone: '+1 (555) 123-4567',
    lastContactDate: '2024-01-15',
    accountStatus: 'Active',
    title: 'VP of Technology',
    address: {
      street: '123 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States'
    },
    tags: ['Enterprise', 'Technology'],
    value: 250000,
    joinDate: '2023-03-15'
  },
  {
    id: 'cust-002',
    name: 'Michael Chen',
    company: 'DataFlow Analytics',
    email: 'michael.chen@dataflow.com',
    phone: '+1 (555) 234-5678',
    lastContactDate: '2024-01-12',
    accountStatus: 'Active',
    title: 'Chief Data Officer',
    address: {
      street: '456 Analytics Boulevard',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'United States'
    },
    tags: ['Analytics', 'Data Science'],
    value: 180000,
    joinDate: '2023-07-22'
  },
  {
    id: 'cust-003',
    name: 'Emily Rodriguez',
    company: 'StartupHQ',
    email: 'emily@startuphq.com',
    phone: '+1 (555) 345-6789',
    lastContactDate: '2024-01-10',
    accountStatus: 'Prospect',
    title: 'Founder & CEO',
    address: {
      street: '789 Startup Street',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      country: 'United States'
    },
    tags: ['Startup', 'SaaS'],
    value: 75000,
    joinDate: '2024-01-05'
  },
  {
    id: 'cust-004',
    name: 'David Thompson',
    company: 'Manufacturing Plus',
    email: 'david.thompson@mfgplus.com',
    phone: '+1 (555) 456-7890',
    lastContactDate: '2024-01-08',
    accountStatus: 'Active',
    title: 'Operations Director',
    address: {
      street: '321 Industrial Way',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      country: 'United States'
    },
    tags: ['Manufacturing', 'Industrial'],
    value: 320000,
    joinDate: '2022-11-10'
  },
  {
    id: 'cust-005',
    name: 'Lisa Park',
    company: 'HealthTech Innovations',
    email: 'lisa.park@healthtech.com',
    phone: '+1 (555) 567-8901',
    lastContactDate: '2024-01-05',
    accountStatus: 'Inactive',
    title: 'Product Manager',
    address: {
      street: '654 Medical Center Drive',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'United States'
    },
    tags: ['Healthcare', 'Medical Devices'],
    value: 150000,
    joinDate: '2023-01-18'
  },
  {
    id: 'cust-006',
    name: 'Robert Garcia',
    company: 'RetailMax',
    email: 'robert.garcia@retailmax.com',
    phone: '+1 (555) 678-9012',
    lastContactDate: '2024-01-14',
    accountStatus: 'Active',
    title: 'IT Director',
    address: {
      street: '987 Commerce Plaza',
      city: 'Miami',
      state: 'FL',
      zipCode: '33131',
      country: 'United States'
    },
    tags: ['Retail', 'E-commerce'],
    value: 200000,
    joinDate: '2023-05-30'
  }
];

export const activities: Activity[] = [
  // Sarah Wilson (cust-001) activities
  {
    id: 'act-001',
    customerId: 'cust-001',
    type: 'call',
    date: '2024-01-15T14:30:00Z',
    title: 'Quarterly Business Review',
    description: 'Discussed Q4 performance and 2024 goals',
    duration: 45,
    outcome: 'Connected',
    notes: 'Very positive call. Sarah is happy with the current solution and wants to expand to 3 more departments.'
  } as CallActivity,
  {
    id: 'act-002',
    customerId: 'cust-001',
    type: 'email',
    date: '2024-01-10T09:15:00Z',
    title: 'Follow-up on integration requirements',
    subject: 'API Integration Timeline and Requirements',
    direction: 'sent',
    sender: 'alex@acmecrm.com',
    recipient: 'sarah.wilson@techcorp.com'
  } as EmailActivity,
  {
    id: 'act-003',
    customerId: 'cust-001',
    type: 'meeting',
    date: '2024-01-05T11:00:00Z',
    title: 'Technical Requirements Workshop',
    description: 'Deep dive into integration requirements for Q1',
    meetingType: 'Virtual',
    attendees: ['Sarah Wilson', 'Alex Thompson', 'Technical Team'],
    notes: 'Identified 3 key integration points. Sarah\'s team will provide API documentation by end of week.'
  } as MeetingActivity,

  // Michael Chen (cust-002) activities
  {
    id: 'act-004',
    customerId: 'cust-002',
    type: 'email',
    date: '2024-01-12T16:45:00Z',
    title: 'Data Migration Update',
    subject: 'Weekly Data Migration Progress Report',
    direction: 'received',
    sender: 'michael.chen@dataflow.com',
    recipient: 'alex@acmecrm.com'
  } as EmailActivity,
  {
    id: 'act-005',
    customerId: 'cust-002',
    type: 'call',
    date: '2024-01-08T10:00:00Z',
    title: 'Monthly Check-in',
    description: 'Regular monthly sync on project progress',
    duration: 30,
    outcome: 'Connected',
    notes: 'Migration is on track. Michael mentioned potential budget increase for Q2.'
  } as CallActivity,
  {
    id: 'act-006',
    customerId: 'cust-002',
    type: 'meeting',
    date: '2024-01-03T13:30:00Z',
    title: 'New Year Planning Session',
    description: 'Planning for 2024 data analytics initiatives',
    meetingType: 'In-person',
    attendees: ['Michael Chen', 'Alex Thompson', 'Data Science Team'],
    location: 'DataFlow Analytics Office, Austin',
    notes: 'Great session. Identified 5 new use cases for our platform in 2024.'
  } as MeetingActivity,

  // Emily Rodriguez (cust-003) activities
  {
    id: 'act-007',
    customerId: 'cust-003',
    type: 'call',
    date: '2024-01-10T15:00:00Z',
    title: 'Initial Discovery Call',
    description: 'First call to understand StartupHQ needs',
    duration: 60,
    outcome: 'Connected',
    notes: 'Emily is very interested. Startup needs cost-effective solution with room to scale.'
  } as CallActivity,
  {
    id: 'act-008',
    customerId: 'cust-003',
    type: 'email',
    date: '2024-01-07T08:30:00Z',
    title: 'Welcome and next steps',
    subject: 'Welcome to our CRM evaluation process!',
    direction: 'sent',
    sender: 'alex@acmecrm.com',
    recipient: 'emily@startuphq.com'
  } as EmailActivity,

  // David Thompson (cust-004) activities
  {
    id: 'act-009',
    customerId: 'cust-004',
    type: 'email',
    date: '2024-01-08T14:20:00Z',
    title: 'System performance report',
    subject: 'Monthly System Performance and Usage Analytics',
    direction: 'sent',
    sender: 'alex@acmecrm.com',
    recipient: 'david.thompson@mfgplus.com'
  } as EmailActivity,
  {
    id: 'act-010',
    customerId: 'cust-004',
    type: 'call',
    date: '2024-01-02T11:30:00Z',
    title: 'Year-end wrap-up',
    description: 'Review of 2023 achievements and 2024 planning',
    duration: 40,
    outcome: 'Connected',
    notes: 'David very pleased with ROI. Wants to discuss expansion to European operations.'
  } as CallActivity,

  // Lisa Park (cust-005) activities
  {
    id: 'act-011',
    customerId: 'cust-005',
    type: 'call',
    date: '2024-01-05T09:00:00Z',
    title: 'Re-engagement call',
    description: 'Attempting to re-engage inactive account',
    duration: 15,
    outcome: 'Connected',
    notes: 'Lisa mentioned budget constraints but showed interest in a smaller package.'
  } as CallActivity,
  {
    id: 'act-012',
    customerId: 'cust-005',
    type: 'email',
    date: '2023-12-20T10:00:00Z',
    title: 'Account status follow-up',
    subject: 'Following up on your account status',
    direction: 'sent',
    sender: 'alex@acmecrm.com',
    recipient: 'lisa.park@healthtech.com'
  } as EmailActivity,

  // Robert Garcia (cust-006) activities
  {
    id: 'act-013',
    customerId: 'cust-006',
    type: 'meeting',
    date: '2024-01-14T10:00:00Z',
    title: 'E-commerce Integration Review',
    description: 'Review of e-commerce platform integration',
    meetingType: 'Virtual',
    attendees: ['Robert Garcia', 'Alex Thompson', 'Integration Team'],
    notes: 'Integration performing well. Robert interested in adding mobile app analytics.'
  } as MeetingActivity,
  {
    id: 'act-014',
    customerId: 'cust-006',
    type: 'call',
    date: '2024-01-09T16:00:00Z',
    title: 'Support ticket follow-up',
    description: 'Following up on resolved support ticket',
    duration: 20,
    outcome: 'Connected',
    notes: 'Issue resolved successfully. Robert appreciates quick response time.'
  } as CallActivity
];

// Helper functions
export const getCustomerById = (customerId: string): Customer | undefined => {
  return customers.find(customer => customer.id === customerId);
};

export const getActivitiesByCustomerId = (customerId: string): Activity[] => {
  return activities
    .filter(activity => activity.customerId === customerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getCustomerStats = () => {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.accountStatus === 'Active').length;
  const prospectCustomers = customers.filter(c => c.accountStatus === 'Prospect').length;
  const totalValue = customers.reduce((sum, c) => sum + (c.value || 0), 0);
  
  return {
    totalCustomers,
    activeCustomers,
    prospectCustomers,
    totalValue
  };
};
