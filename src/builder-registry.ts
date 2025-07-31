import { Builder } from '@builder.io/sdk-react';
import { 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  CardActions,
  Container,
  Paper,
  Chip,
  Alert
} from '@mui/material';

// Register Material-UI Typography component
Builder.registerComponent(Typography, {
  name: 'MUI Typography',
  inputs: [
    {
      name: 'variant',
      type: 'string',
      enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'overline'],
      defaultValue: 'body1'
    },
    {
      name: 'children',
      type: 'string',
      defaultValue: 'Typography text'
    },
    {
      name: 'color',
      type: 'string',
      enum: ['primary', 'secondary', 'textPrimary', 'textSecondary', 'error'],
      defaultValue: 'textPrimary'
    },
    {
      name: 'align',
      type: 'string',
      enum: ['left', 'center', 'right', 'justify'],
      defaultValue: 'left'
    },
    {
      name: 'gutterBottom',
      type: 'boolean',
      defaultValue: false
    }
  ]
});

// Register Material-UI Button component
Builder.registerComponent(Button, {
  name: 'MUI Button',
  inputs: [
    {
      name: 'children',
      type: 'string',
      defaultValue: 'Button'
    },
    {
      name: 'variant',
      type: 'string',
      enum: ['text', 'outlined', 'contained'],
      defaultValue: 'contained'
    },
    {
      name: 'color',
      type: 'string',
      enum: ['primary', 'secondary', 'success', 'error', 'info', 'warning'],
      defaultValue: 'primary'
    },
    {
      name: 'size',
      type: 'string',
      enum: ['small', 'medium', 'large'],
      defaultValue: 'medium'
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: false
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      defaultValue: false
    }
  ]
});

// Register Material-UI Box component
Builder.registerComponent(Box, {
  name: 'MUI Box',
  inputs: [
    {
      name: 'children',
      type: 'blocks',
      defaultValue: []
    }
  ],
  canHaveChildren: true,
  defaultChildren: [
    {
      '@type': '@builder.io/sdk:Element',
      component: {
        name: 'Text',
        options: {
          text: 'Box content'
        }
      }
    }
  ]
});

// Register Material-UI Card component
Builder.registerComponent(Card, {
  name: 'MUI Card',
  inputs: [
    {
      name: 'children',
      type: 'blocks',
      defaultValue: []
    },
    {
      name: 'elevation',
      type: 'number',
      defaultValue: 1,
      min: 0,
      max: 24
    }
  ],
  canHaveChildren: true,
  defaultChildren: [
    {
      '@type': '@builder.io/sdk:Element',
      component: {
        name: 'MUI CardContent'
      }
    }
  ]
});

// Register Material-UI CardContent component
Builder.registerComponent(CardContent, {
  name: 'MUI CardContent',
  inputs: [
    {
      name: 'children',
      type: 'blocks',
      defaultValue: []
    }
  ],
  canHaveChildren: true,
  defaultChildren: [
    {
      '@type': '@builder.io/sdk:Element',
      component: {
        name: 'MUI Typography',
        options: {
          variant: 'h5',
          children: 'Card Title'
        }
      }
    },
    {
      '@type': '@builder.io/sdk:Element',
      component: {
        name: 'MUI Typography',
        options: {
          variant: 'body2',
          color: 'textSecondary',
          children: 'Card description text goes here.'
        }
      }
    }
  ]
});

// Register Material-UI CardActions component
Builder.registerComponent(CardActions, {
  name: 'MUI CardActions',
  inputs: [
    {
      name: 'children',
      type: 'blocks',
      defaultValue: []
    }
  ],
  canHaveChildren: true,
  defaultChildren: [
    {
      '@type': '@builder.io/sdk:Element',
      component: {
        name: 'MUI Button',
        options: {
          size: 'small',
          children: 'Learn More'
        }
      }
    }
  ]
});

// Register Material-UI Container component
Builder.registerComponent(Container, {
  name: 'MUI Container',
  inputs: [
    {
      name: 'children',
      type: 'blocks',
      defaultValue: []
    },
    {
      name: 'maxWidth',
      type: 'string',
      enum: ['xs', 'sm', 'md', 'lg', 'xl', false],
      defaultValue: 'lg'
    }
  ],
  canHaveChildren: true
});

// Register Material-UI Paper component
Builder.registerComponent(Paper, {
  name: 'MUI Paper',
  inputs: [
    {
      name: 'children',
      type: 'blocks',
      defaultValue: []
    },
    {
      name: 'elevation',
      type: 'number',
      defaultValue: 1,
      min: 0,
      max: 24
    }
  ],
  canHaveChildren: true
});

// Register Material-UI Chip component
Builder.registerComponent(Chip, {
  name: 'MUI Chip',
  inputs: [
    {
      name: 'label',
      type: 'string',
      defaultValue: 'Chip'
    },
    {
      name: 'variant',
      type: 'string',
      enum: ['filled', 'outlined'],
      defaultValue: 'filled'
    },
    {
      name: 'color',
      type: 'string',
      enum: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      defaultValue: 'default'
    },
    {
      name: 'size',
      type: 'string',
      enum: ['small', 'medium'],
      defaultValue: 'medium'
    }
  ]
});

// Register Material-UI Alert component
Builder.registerComponent(Alert, {
  name: 'MUI Alert',
  inputs: [
    {
      name: 'children',
      type: 'string',
      defaultValue: 'This is an alert message'
    },
    {
      name: 'severity',
      type: 'string',
      enum: ['error', 'warning', 'info', 'success'],
      defaultValue: 'info'
    },
    {
      name: 'variant',
      type: 'string',
      enum: ['filled', 'outlined', 'standard'],
      defaultValue: 'standard'
    }
  ]
});

export {};
