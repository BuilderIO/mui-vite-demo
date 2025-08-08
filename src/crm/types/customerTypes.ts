export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastContactDate: string;
  accountStatus: 'Active' | 'Inactive' | 'Prospect' | 'Closed';
  avatar?: string;
  title?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  tags?: string[];
  value?: number;
  joinDate: string;
}

export type ActivityType = 'call' | 'meeting' | 'email';

export interface ActivityBase {
  id: string;
  customerId: string;
  type: ActivityType;
  date: string;
  title: string;
  description?: string;
}

export interface CallActivity extends ActivityBase {
  type: 'call';
  duration: number; // in minutes
  outcome: 'Connected' | 'Voicemail' | 'No Answer' | 'Busy';
  notes?: string;
}

export interface MeetingActivity extends ActivityBase {
  type: 'meeting';
  meetingType: 'In-person' | 'Virtual' | 'Phone';
  attendees: string[];
  location?: string;
  notes?: string;
}

export interface EmailActivity extends ActivityBase {
  type: 'email';
  subject: string;
  direction: 'sent' | 'received';
  sender: string;
  recipient: string;
}

export type Activity = CallActivity | MeetingActivity | EmailActivity;
