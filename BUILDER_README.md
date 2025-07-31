# Builder.io Integration - Hello World Project

This project demonstrates Builder.io integration with a Material-UI + Vite + React application.

## 🎯 Project Overview

**Jira Issue:** ENG-10004 - Build a hello world page  
**Project:** mui-vite-demo

## 🚀 Features Implemented

- ✅ Builder.io SDK integration for React
- ✅ Hello World page with Builder.io content area
- ✅ Custom Builder.io components registry
- ✅ Material-UI styling integration
- ✅ Navigation menu integration

## 📁 Project Structure

```
src/
├── pages/
│   └── HelloWorld.tsx          # Main Hello World page component
├── builder-registry.ts         # Builder.io custom components
└── crm/components/
    └── CrmMenuContent.tsx      # Updated navigation menu
```

## 🔧 Setup Instructions

### 1. Builder.io Account Setup

1. Sign up for a free Builder.io account at https://builder.io
2. Create a new space/project
3. Get your API key from the account settings

### 2. Configure API Key

The environment variable is already set up. Replace the placeholder with your actual API key:

```bash
# Option 1: Update via DevServerControl (recommended)
# This is already set to a placeholder value

# Option 2: Update .env file directly
VITE_BUILDER_PUBLIC_API_KEY=your-actual-api-key-here
```

### 3. Access the Hello World Page

1. Start the development server: `npm run dev`
2. Navigate to the CRM dashboard
3. Click "Hello World" in the sidebar navigation
4. Or directly visit: `http://localhost:5173/hello-world`

## 🎨 Builder.io Features

### Custom Components Available

1. **HelloWorld** - Simple static hello world component
2. **CustomHelloWorld** - Configurable component with props:
   - Title (text)
   - Subtitle (text)
   - Background Color (color picker)
   - Text Color (color picker)

### Content Management

1. Log into your Builder.io dashboard
2. Create a new "Page" model content
3. Set the URL to "/"
4. Add and configure the custom components
5. Publish the content
6. The content will appear in the Builder.io content area

## 🔗 Integration Details

### Builder.io SDK Integration

- Uses `@builder.io/react` package
- Components registered in `src/builder-registry.ts`
- Content fetched via `BuilderComponent`
- Fallback content for when no Builder.io content exists

### Material-UI Integration

- Maintains Material-UI theming and components
- Builder.io content area styled with Material-UI Paper component
- Navigation integrated with existing CRM menu structure

## 🛠️ Development

### Adding New Builder.io Components

1. Create your React component
2. Register it in `src/builder-registry.ts`
3. Define input fields for the visual editor
4. Restart the dev server

Example:
```typescript
Builder.registerComponent(YourComponent, {
  name: 'YourComponent',
  inputs: [
    {
      name: 'title',
      type: 'string',
      defaultValue: 'Default Title'
    }
  ]
});
```

### Supported Input Types

- `string` - Text input
- `number` - Number input
- `boolean` - Checkbox
- `color` - Color picker
- `file` - File upload

## 📝 Notes

- The Hello World page includes both static Material-UI content and dynamic Builder.io content
- Custom components are registered to appear in the Builder.io visual editor
- The integration maintains the existing CRM dashboard structure
- Environment variables use Vite's `VITE_` prefix convention

## 🔍 Troubleshooting

1. **No content showing:** Check your API key configuration
2. **Components not appearing:** Ensure `builder-registry.ts` is imported
3. **Build errors:** Verify all Builder.io packages are installed correctly

## 📚 Resources

- [Builder.io Documentation](https://www.builder.io/c/docs/developers)
- [Builder.io React SDK](https://github.com/BuilderIO/builder/tree/main/packages/react)
- [Material-UI Documentation](https://mui.com/)
