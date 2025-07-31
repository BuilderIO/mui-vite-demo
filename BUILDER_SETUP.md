# Builder.io Setup Guide

This guide will help you set up Builder.io for the Hello World page implementation.

## Quick Start

1. **Sign up for Builder.io**
   - Visit https://builder.io
   - Create a free account
   - Note your API key from Account Settings

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add:
   VITE_BUILDER_API_KEY=your_actual_api_key_here
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

4. **Access Hello World Page**
   - Navigate to `/hello-world` in your app
   - Click "Hello World" in the sidebar menu

## Creating Content in Builder.io

1. **Create a New Page**
   - In Builder.io dashboard, click "Create New" > "Page"
   - Set URL to `/hello-world`
   - Title: "Hello World Content"

2. **Add Components**
   - Use the built-in components or
   - Try the custom "CustomGreeting" component we've registered
   - Customize colors, text, and layout

3. **Publish**
   - Click "Publish" to make content live
   - Content will appear in your app automatically

## Custom Components Available

### CustomGreeting
A Material-UI based greeting card with these properties:
- **Title**: Main heading text
- **Message**: Descriptive text below title  
- **Show Icon**: Toggle for waving hand icon
- **Background Color**: Card background color

## Development Notes

- The hello world page includes both static content and Builder.io managed content
- Static content provides a fallback when Builder.io content isn't available
- All custom components follow Material-UI design patterns
- Components are responsive and accessible

## Troubleshooting

**Issue**: "YOUR_API_KEY_HERE" appears in content
- **Solution**: Make sure you've set `VITE_BUILDER_API_KEY` in `.env.local`

**Issue**: No dynamic content shows
- **Solution**: Create content in Builder.io with URL path `/hello-world`

**Issue**: Components don't appear in Builder.io
- **Solution**: Make sure the dev server is running and components are registered

## Next Steps

1. Create more custom MUI components
2. Add them to `builder-registry.ts`
3. Use Builder.io's visual editor to create rich pages
4. Explore Builder.io's A/B testing and personalization features
