# Hello World Builder.io Integration

This folder contains the Builder.io integration for the hello world page, implementing the requirements from Jira issue **ENG-10004**.

## Features

- **Hello World Page**: A simple greeting page with Builder.io integration
- **Custom Components**: MUI-based components that can be used in Builder.io
- **Dynamic Content**: Content management through Builder.io CMS

## Files

- `HelloWorld.tsx` - Main hello world page component
- `components/CustomGreeting.tsx` - Custom MUI component for Builder.io
- `builder-registry.ts` - Builder.io component registration
- `README.md` - This documentation

## Setup

1. **Get Builder.io API Key**:
   - Sign up at [builder.io](https://builder.io)
   - Get your API key from the account settings
   - Copy `.env.example` to `.env.local` and add your API key

2. **Environment Variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your VITE_BUILDER_API_KEY
   ```

3. **Access the Page**:
   - Navigate to `/hello-world` in your application
   - The page will show static content and a Builder.io content area

## Builder.io Content Management

1. **Create Content**:
   - Log into your Builder.io space
   - Create a new "Page" model entry
   - Set the URL to `/hello-world`
   - Add content using the visual editor

2. **Use Custom Components**:
   - The `CustomGreeting` component is available in Builder.io
   - Drag and drop it from the components panel
   - Customize its properties (title, message, colors, etc.)

## Component Properties

### CustomGreeting
- **title** (string): Main greeting title
- **message** (string): Welcome message text
- **showIcon** (boolean): Display the waving hand icon
- **backgroundColor** (color): Card background color

## Technical Details

- Built with React + TypeScript
- Uses Material-UI components for styling
- Integrates with Builder.io React SDK
- Follows MUI design patterns and accessibility guidelines
