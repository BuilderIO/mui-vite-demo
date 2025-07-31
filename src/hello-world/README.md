# Builder.io Hello World Page

This implementation provides a "Hello World" page integrated with Builder.io for the mui-vite-demo project.

## Features

- **Builder.io Integration**: Visual page builder with React + Material-UI
- **Material-UI Components**: Pre-registered MUI components available in Builder.io editor
- **Responsive Design**: Mobile-friendly layout using MUI Container and responsive typography
- **Error Handling**: Graceful fallback when Builder.io content is unavailable
- **Loading States**: Proper loading indicators while fetching content

## Setup Instructions

1. **Get Builder.io API Key**:
   - Sign up at [builder.io](https://builder.io)
   - Go to Account Settings → API Keys
   - Copy your Public API Key

2. **Configure Environment**:
   ```bash
   # Update .env file
   VITE_BUILDER_API_KEY=your-actual-api-key-here
   ```

3. **Create Content in Builder.io**:
   - Go to your Builder.io dashboard
   - Create a new "Page" model if it doesn't exist
   - Create a new page with URL: `/hello-world`
   - Use the visual editor to build your content

## Available Material-UI Components

The following MUI components are registered and available in the Builder.io editor:

- **MUI Typography** - Text with Material-UI styling
- **MUI Button** - Interactive buttons with variants
- **MUI Box** - Layout container
- **MUI Card** - Card container
- **MUI CardContent** - Card content area
- **MUI CardActions** - Card action buttons
- **MUI Container** - Responsive container
- **MUI Paper** - Material design surface
- **MUI Chip** - Compact information chips
- **MUI Alert** - Alert messages

## Usage

1. **Development**: Visit `/hello-world` in your app
2. **Builder.io Editor**: Edit content visually at builder.io
3. **Live Preview**: Changes in Builder.io reflect immediately in your app

## File Structure

```
src/hello-world/
├── HelloWorldPage.tsx      # Main page component
├── README.md              # This documentation
├── builder-config.ts      # Builder.io configuration
└── builder-registry.ts    # MUI component registrations
```

## Implementation Details

- **Error Fallback**: Shows setup instructions when Builder.io is not configured
- **Loading State**: Displays progress indicator while fetching content
- **Material-UI Theme**: Inherits app theme for consistent styling
- **Type Safety**: Full TypeScript support

## Troubleshooting

**No content showing?**
1. Verify your API key is set correctly
2. Ensure you've created a page at `/hello-world` in Builder.io
3. Check browser console for error messages

**Styling issues?**
- MUI components inherit the app's theme automatically
- Use Builder.io's style editor for custom styling
- Material-UI props are configurable in the Builder.io editor

## Related Documentation

- [Builder.io React SDK](https://www.builder.io/c/docs/react/intro)
- [Material-UI Components](https://mui.com/material-ui/getting-started/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
