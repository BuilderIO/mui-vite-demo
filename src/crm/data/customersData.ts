export interface CustomerActivity {
  id: string;
  type: 'call' | 'meeting' | 'email';
  date: string;
  title: string;
  description: string;
  // Call specific fields
  duration?: number; // in minutes
  outcome?: string;
  // Meeting specific fields
  meetingType?: 'in-person' | 'virtual';
  attendees?: string[];
  // Email specific fields
  subject?: string;
  sender?: string;
  recipient?: string;
  direction?: 'sent' | 'received';
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContact: string;
  status: 'active' | 'inactive' | 'prospect' | 'closed';
  activities: CustomerActivity[];
}

export const customersData: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp Solutions',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    lastContact: '2024-01-15',
    status: 'active',
    activities: [
      {
        id: 'a1',
        type: 'email',
        date: '2024-01-15T10:30:00Z',
        title: 'Follow-up on Q1 Requirements',
        description: 'Sent detailed proposal for Q1 implementation including timeline and resource allocation.',
        subject: 'Q1 Implementation Proposal - TechCorp Solutions',
        sender: 'alex@acmecrm.com',
        recipient: 'sarah.johnson@techcorp.com',
        direction: 'sent'
      },
      {
        id: 'a2',
        type: 'call',
        date: '2024-01-12T14:00:00Z',
        title: 'Requirements Discovery Call',
        description: 'Discussed technical requirements for the upcoming project. Customer needs scalable solution.',
        duration: 45,
        outcome: 'Positive - needs proposal'
      },
      {
        id: 'a3',
        type: 'meeting',
        date: '2024-01-08T09:00:00Z',
        title: 'Project Kickoff Meeting',
        description: 'Initial meeting to discuss project scope and timeline. Great engagement from their team.',
        meetingType: 'virtual',
        attendees: ['Sarah Johnson', 'Mike Chen', 'Alex Thompson']
      },
      {
        id: 'a4',
        type: 'email',
        date: '2024-01-05T16:20:00Z',
        title: 'Introduction and Calendar Invite',
        description: 'Received initial inquiry about our services and sent meeting invitation.',
        subject: 'Re: Inquiry about CRM Solutions',
        sender: 'sarah.johnson@techcorp.com',
        recipient: 'alex@acmecrm.com',
        direction: 'received'
      }
    ]
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'StartupHub Inc',
    email: 'michael.chen@startuphub.com',
    phone: '+1 (555) 987-6543',
    lastContact: '2024-01-14',
    status: 'prospect',
    activities: [
      {
        id: 'b1',
        type: 'call',
        date: '2024-01-14T11:00:00Z',
        title: 'Product Demo Call',
        description: 'Demonstrated key features and answered technical questions. Customer very interested.',
        duration: 60,
        outcome: 'Very positive - scheduling next steps'
      },
      {
        id: 'b2',
        type: 'email',
        date: '2024-01-10T08:45:00Z',
        title: 'Demo Scheduling',
        description: 'Coordinated demo session and sent calendar invitation with meeting details.',
        subject: 'Product Demo - StartupHub Inc',
        sender: 'alex@acmecrm.com',
        recipient: 'michael.chen@startuphub.com',
        direction: 'sent'
      },
      {
        id: 'b3',
        type: 'meeting',
        date: '2024-01-06T15:30:00Z',
        title: 'Initial Consultation',
        description: 'First meeting to understand their needs and explain our solutions.',
        meetingType: 'in-person',
        attendees: ['Michael Chen', 'Lisa Wong', 'Alex Thompson']
      }
    ]
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Global Dynamics Ltd',
    email: 'emily.rodriguez@globaldynamics.com',
    phone: '+1 (555) 456-7890',
    lastContact: '2024-01-13',
    status: 'active',
    activities: [
      {
        id: 'c1',
        type: 'meeting',
        date: '2024-01-13T13:00:00Z',
        title: 'Quarterly Business Review',
        description: 'Reviewed performance metrics and discussed expansion opportunities for Q2.',
        meetingType: 'virtual',
        attendees: ['Emily Rodriguez', 'John Smith', 'Alex Thompson', 'Sarah Lee']
      },
      {
        id: 'c2',
        type: 'email',
        date: '2024-01-11T12:15:00Z',
        title: 'QBR Preparation',
        description: 'Sent performance report and agenda for upcoming quarterly review meeting.',
        subject: 'Q4 Performance Report & QBR Agenda',
        sender: 'alex@acmecrm.com',
        recipient: 'emily.rodriguez@globaldynamics.com',
        direction: 'sent'
      },
      {
        id: 'c3',
        type: 'call',
        date: '2024-01-09T10:30:00Z',
        title: 'Support Issue Resolution',
        description: 'Helped resolve integration issues and provided technical guidance.',
        duration: 30,
        outcome: 'Issue resolved successfully'
      }
    ]
  },
  {
    id: '4',
    name: 'David Park',
    company: 'Innovation Labs',
    email: 'david.park@innovationlabs.com',
    phone: '+1 (555) 321-9876',
    lastContact: '2024-01-11',
    status: 'inactive',
    activities: [
      {
        id: 'd1',
        type: 'email',
        date: '2024-01-11T09:20:00Z',
        title: 'Account Status Check-in',
        description: 'Sent email to check on account status and potential reactivation opportunities.',
        subject: 'Checking in - Innovation Labs Account',
        sender: 'alex@acmecrm.com',
        recipient: 'david.park@innovationlabs.com',
        direction: 'sent'
      },
      {
        id: 'd2',
        type: 'call',
        date: '2024-01-04T14:45:00Z',
        title: 'Contract Renewal Discussion',
        description: 'Discussed renewal options but customer decided to pause services temporarily.',
        duration: 25,
        outcome: 'Account put on hold'
      }
    ]
  },
  {
    id: '5',
    name: 'Jennifer Walsh',
    company: 'Future Systems Corp',
    email: 'jennifer.walsh@futuresystems.com',
    phone: '+1 (555) 654-3210',
    lastContact: '2024-01-16',
    status: 'active',
    activities: [
      {
        id: 'e1',
        type: 'call',
        date: '2024-01-16T16:00:00Z',
        title: 'New Feature Request Discussion',
        description: 'Customer requested custom reporting features. Discussed implementation timeline.',
        duration: 40,
        outcome: 'Feature request documented'
      },
      {
        id: 'e2',
        type: 'meeting',
        date: '2024-01-14T11:30:00Z',
        title: 'Technical Architecture Review',
        description: 'Reviewed current system architecture and discussed scaling requirements.',
        meetingType: 'virtual',
        attendees: ['Jennifer Walsh', 'Tom Wilson', 'Alex Thompson', 'Maria Garcia']
      },
      {
        id: 'e3',
        type: 'email',
        date: '2024-01-12T13:45:00Z',
        title: 'Architecture Documentation',
        description: 'Shared system architecture documentation and best practices guide.',
        subject: 'System Architecture Documentation - Future Systems',
        sender: 'alex@acmecrm.com',
        recipient: 'jennifer.walsh@futuresystems.com',
        direction: 'sent'
      }
    ]
  }
];
