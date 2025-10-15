import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { StationWebSocket } from "./services/StationWebSocket";
import { AuthProvider } from "@/contextProvider/AuthContext";

const stationId = "station-001";
const stationWS = new StationWebSocket(stationId);

// Connect when page loads
stationWS.connect();

// Example: send status update every 10 seconds
setInterval(() => {
  stationWS.send({
    action: "STATION_STATUS_UPDATE",
    stationId,
    cpuTemperature: Math.random() * 100,
    gpuTemperature: Math.random() * 100,
    networkLatency: Math.floor(Math.random() * 200),
  });
}, 10000);

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;