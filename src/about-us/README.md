# About Us Page

## Overview
A comprehensive About Us page that showcases company information, team members, values, and mission statement following Material-UI design patterns.

## Features

### 🎨 Design & Layout
- **Enhanced Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop
- **Material-UI Integration**: Uses the project's custom MUI theme with proper color schemes
- **Dark/Light Mode**: Includes color mode toggle with full dark/light theme support
- **Smooth Animations**: Hover effects and transitions for enhanced user experience
- **Mobile-First Approach**: Optimized typography and spacing for mobile devices

### 📝 Content Sections
1. **Hero Section**: Eye-catching title with gradient text effect
2. **Mission Statement**: Highlighted company mission in a featured card
3. **Company Values**: Grid of value cards with icons and descriptions
4. **Team Members**: Professional team showcase with roles and descriptions
5. **Company Stats**: Key metrics and achievements
6. **Contact Information**: Clear contact details for inquiries

### 🛠 Technical Implementation
- **TypeScript**: Fully typed components and interfaces
- **Accessibility**: Semantic HTML and ARIA considerations
- **Theme Integration**: Uses project's color tokens, typography, and spacing
- **Component Structure**: Follows established patterns from other pages in the project

## Route
- **Path**: `/about-us`
- **Component**: `AboutUs.tsx`

## Usage
Navigate to `/about-us` to view the page. The page is fully integrated with the application's routing system.

## Responsive Breakpoints
- **Mobile (xs)**: Optimized for mobile devices with smaller typography, reduced padding, and single-column layouts
- **Small (sm)**: Tablet portrait with adjusted spacing and 2-column grid for cards
- **Medium (md)**: Tablet landscape with enhanced spacing and improved grid layouts
- **Large (lg)**: Desktop with full 4-column layout for team and values sections
- **Extra Large (xl)**: Wide desktop with maximum spacing and typography

## Enhanced Responsive Features
- **Typography Scaling**: All headings and text scale appropriately across breakpoints
- **Grid Adaptability**: Smart grid layouts that adapt from single column on mobile to multi-column on larger screens
- **Avatar Sizing**: Team member avatars scale from 60px on mobile to 80px on larger screens
- **Spacing Optimization**: Container padding, card padding, and section spacing adjust for optimal mobile experience
- **Content Readability**: Text content includes responsive padding and font sizes for better mobile readability

## Theme Support
- Supports both light and dark color schemes
- Uses CSS variables for dynamic theming
- Follows the project's brand colors and typography system

## Customization
The page content can be easily customized by modifying the data arrays:
- `teamMembers`: Update team member information
- `companyValues`: Modify company values and descriptions
- Content strings can be updated directly in the component
