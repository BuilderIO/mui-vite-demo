import { alpha, Theme, Components } from "@mui/material/styles";
import { gray } from "../themePrimitives";

/* eslint-disable import/prefer-default-export */
export const surfacesCustomizations: Components<Theme> = {
  MuiAccordion: {
    defaultProps: {
      elevation: 0,
      disableGutters: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 4,
        overflow: "clip",
        backgroundColor: (theme.vars || theme).palette.background.default,
        border: "1px solid",
        borderColor: (theme.vars || theme).palette.divider,
        ":before": {
          backgroundColor: "transparent",
        },
        "&:not(:last-of-type)": {
          borderBottom: "none",
        },
        "&:first-of-type": {
          borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
        },
        "&:last-of-type": {
          borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: "none",
        borderRadius: 8,
        "&:hover": { backgroundColor: gray[50] },
        "&:focus-visible": { backgroundColor: "transparent" },
        ...theme.applyStyles("dark", {
          "&:hover": { backgroundColor: gray[800] },
        }),
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: { mb: 20, border: "none" },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => {
        return {
          padding: 20,
          gap: 20,
          transition: "all 150ms ease",
          backgroundColor: "hsl(210, 25%, 99%)",
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          ...theme.applyStyles("dark", {
            backgroundColor: gray[800],
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
            "&:hover": {
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
            },
          }),
          variants: [
            {
              props: {
                variant: "outlined",
              },
              style: {
                border: `1px solid ${(theme.vars || theme).palette.divider}`,
                boxShadow: "none",
                background: "hsl(0, 0%, 100%)",
                ...theme.applyStyles("dark", {
                  background: alpha(gray[900], 0.4),
                }),
              },
            },
          ],
        };
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
        "&:last-child": { paddingBottom: 0 },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
};
