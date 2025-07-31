import { builder } from '@builder.io/sdk-react';

// Initialize Builder.io with API key
const apiKey = import.meta.env.VITE_BUILDER_API_KEY;

if (!apiKey) {
  console.warn('Builder.io API key not found. Please set VITE_BUILDER_API_KEY in your .env file');
} else {
  builder.init(apiKey);
}

export { builder };
