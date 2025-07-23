# Hello World Page

A simple Hello World page built with Material-UI components, showcasing basic MUI patterns and theming.

## Features

- **Material-UI Components**: Uses Typography, Button, Paper, and Box components
- **Theme Integration**: Supports both light and dark mode with proper color schemes
- **Interactive Elements**: Includes a click counter button with animations
- **Responsive Design**: Adapts to different screen sizes
- **Gradient Background**: Beautiful gradient background that changes with theme
- **Animation**: Smooth fade-in animation for dynamic content

## Components Used

- `AppTheme`: Shared theme provider
- `ColorModeSelect`: Theme switcher component
- `Typography`: For text content with various styles
- `Button`: Interactive button with click tracking
- `Paper`: Elevated card container
- `Box`: Layout and positioning

## Routing

The Hello World page is accessible at:
- `/` (homepage)
- `/hello` (direct route)

## Styling

The component uses Material-UI's styled system with:
- Custom styled components (`HelloWorldContainer`, `WelcomeCard`)
- Theme-aware styling that adapts to light/dark mode
- CSS-in-JS animations
- Gradient text effects
- Responsive design patterns

## Usage

```tsx
import HelloWorld from './hello-world/HelloWorld';

function App() {
  return <HelloWorld />;
}
```

The component accepts an optional `disableCustomTheme` prop to disable the custom theme wrapper.
