import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

export default function ApiTest() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult("");

    try {
      console.log("Testing direct API call...");
      const response = await fetch(
        "https://user-api.builder-io.workers.dev/api/users",
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      if (!response.ok) {
        const errorText = await response.text();
        setResult(
          `Error: ${response.status} ${response.statusText}\n${errorText}`,
        );
        return;
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      console.log("API Test Success:", data);
    } catch (error) {
      console.error("API Test Error:", error);
      setResult(
        `Network Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          API Test
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={testApi} disabled={loading}>
            {loading ? "Testing..." : "Test API"}
          </Button>
        </Box>
        {result && (
          <Alert
            severity={
              result.startsWith("Error") || result.startsWith("Network")
                ? "error"
                : "success"
            }
          >
            <Typography
              variant="body2"
              component="pre"
              sx={{ fontSize: "0.75rem", overflowX: "auto" }}
            >
              {result}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
