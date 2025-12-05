import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import CrmDashboard from "./crm/CrmDashboard";
import NotFound from "./not-found/NotFound";
// change just for testing diff

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline enableColorScheme />
      <Routes>
        <Route path="/*" element={<CrmDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
