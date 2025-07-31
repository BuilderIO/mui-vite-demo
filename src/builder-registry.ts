import { Builder } from '@builder.io/react';

// Register custom components with Builder.io
// This file registers components that can be used in the Builder.io visual editor

// Simple Hello World component
const HelloWorldComponent = () => {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '10px',
      margin: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        Hello World! 🌍
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '0' }}>
        Welcome to your Builder.io powered application!
      </p>
    </div>
  );
};

// Register the component with Builder.io
Builder.registerComponent(HelloWorldComponent, {
  name: 'HelloWorld',
  inputs: []
});

// Customizable Hello World component with props
const CustomHelloWorldComponent = (props: { 
  title?: string; 
  subtitle?: string; 
  backgroundColor?: string;
  textColor?: string;
}) => {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      backgroundColor: props.backgroundColor || '#667eea',
      color: props.textColor || 'white',
      borderRadius: '10px',
      margin: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        {props.title || 'Hello World! 🌍'}
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '0' }}>
        {props.subtitle || 'Welcome to your Builder.io powered application!'}
      </p>
    </div>
  );
};

// Register the customizable component
Builder.registerComponent(CustomHelloWorldComponent, {
  name: 'CustomHelloWorld',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Hello World! 🌍'
    },
    {
      name: 'subtitle',
      type: 'string',
      defaultValue: 'Welcome to your Builder.io powered application!'
    },
    {
      name: 'backgroundColor',
      type: 'color',
      defaultValue: '#667eea'
    },
    {
      name: 'textColor',
      type: 'color',
      defaultValue: '#ffffff'
    }
  ]
});

export default Builder;