import { Builder } from '@builder.io/react';
import CustomGreeting from './components/CustomGreeting';

// Register custom components with Builder.io
Builder.registerComponent(CustomGreeting, {
  name: 'CustomGreeting',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Hello World',
      friendlyName: 'Greeting Title'
    },
    {
      name: 'message',
      type: 'string',
      defaultValue: 'Welcome to our amazing application!',
      friendlyName: 'Greeting Message'
    },
    {
      name: 'showIcon',
      type: 'boolean',
      defaultValue: true,
      friendlyName: 'Show Icon'
    },
    {
      name: 'backgroundColor',
      type: 'color',
      defaultValue: '#f5f5f5',
      friendlyName: 'Background Color'
    }
  ]
});

// You can register more components here following the same pattern
