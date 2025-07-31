import * as React from 'react';
import { Builder } from '@builder.io/sdk-react';

// Example custom component for Builder.io
function HelloWorldCard(props: { title?: string; message?: string; backgroundColor?: string }) {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: props.backgroundColor || '#f5f5f5',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
        {props.title || 'Hello World!'}
      </h3>
      <p style={{ margin: 0, color: '#666' }}>
        {props.message || 'This is a custom Builder.io component!'}
      </p>
    </div>
  );
}

// Register the component with Builder.io
Builder.registerComponent(HelloWorldCard, {
  name: 'HelloWorldCard',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Hello World!',
      helperText: 'The title text to display'
    },
    {
      name: 'message',
      type: 'string',
      defaultValue: 'This is a custom Builder.io component!',
      helperText: 'The message text to display'
    },
    {
      name: 'backgroundColor',
      type: 'color',
      defaultValue: '#f5f5f5',
      helperText: 'Background color for the card'
    }
  ]
});

// You can register more components here as needed
export default function initBuilder() {
  // This function can be called to ensure components are registered
  console.log('Builder.io components registered');
}
