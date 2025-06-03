import * as React from "react";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import CrmStatCard from "./CrmStatCard";
import { UsersApiService } from "../services/usersApi";
import { UserStats } from "../types/User";

// Generate sample trend data for visualization
const generateTrendData = (baseValue: number, trend: "up" | "down") => {
  const data: number[] = [];
  let current = baseValue * 0.8; // Start at 80% of current value

  for (let i = 0; i < 30; i++) {
    const variation = (Math.random() - 0.5) * 0.1 * current; // ±5% variation
    const trendFactor = trend === "up" ? 1.01 : 0.99; // 1% daily trend
    current = current * trendFactor + variation;
    data.push(Math.round(current));
  }

  return data;
};

export default function CustomerStatsCards() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const userStats = await UsersApiService.getUserStats();
        setStats(userStats);
      } catch (err) {
        console.error("Error in CustomerStatsCards:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch user statistics",
        );

        // Set fallback stats to show something rather than empty state
        setStats({
          totalUsers: 0,
          newUsersThisMonth: 0,
          averageAge: 0,
          topCountries: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((index) => (
          <Grid key={index} item xs={12} sm={6} lg={3}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading customer statistics: {error}
      </Alert>
    );
  }

  if (!stats) {
    return null;
  }

  const statCardsData = [
    {
      title: "Total Customers",
      value: stats.totalUsers.toLocaleString(),
      interval: "All time",
      trend: "up" as const,
      trendValue: "+8%",
      data: generateTrendData(stats.totalUsers, "up"),
    },
    {
      title: "New This Month",
      value: stats.newUsersThisMonth.toString(),
      interval: "Current month",
      trend: "up" as const,
      trendValue: "+15%",
      data: generateTrendData(stats.newUsersThisMonth, "up"),
    },
    {
      title: "Average Age",
      value: `${stats.averageAge} years`,
      interval: "Current data",
      trend: "down" as const,
      trendValue: "-1%",
      data: generateTrendData(stats.averageAge, "down"),
    },
    {
      title: "Top Country",
      value: stats.topCountries[0]?.country || "N/A",
      interval: `${stats.topCountries[0]?.count || 0} customers`,
      trend: "up" as const,
      trendValue: "+5%",
      data: generateTrendData(stats.topCountries[0]?.count || 0, "up"),
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statCardsData.map((card, index) => (
        <Grid key={index} item xs={12} sm={6} lg={3}>
          <CrmStatCard
            title={card.title}
            value={card.value}
            interval={card.interval}
            trend={card.trend}
            trendValue={card.trendValue}
            data={card.data}
          />
        </Grid>
      ))}
    </Grid>
  );
}
