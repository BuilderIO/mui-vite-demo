import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import { PieChart } from "@mui/x-charts/PieChart";
import { UsersApiService } from "../services/usersApi";
import { User } from "../types/User";

interface DemographicsData {
  genderDistribution: { label: string; value: number; color: string }[];
  ageGroups: { label: string; value: number; color: string }[];
  topCountries: { label: string; value: number; color: string }[];
}

const GENDER_COLORS = {
  male: "#1976d2",
  female: "#9c27b0",
  other: "#757575",
};

const AGE_GROUP_COLORS = [
  "#ff9800", // 18-25
  "#2196f3", // 26-35
  "#4caf50", // 36-45
  "#f44336", // 46-55
  "#9c27b0", // 56+
];

const COUNTRY_COLORS = ["#1976d2", "#9c27b0", "#f44336", "#ff9800", "#4caf50"];

export default function CustomerDemographicsChart() {
  const [demographics, setDemographics] = useState<DemographicsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch a larger sample of users to get better demographics
        const response = await UsersApiService.getUsers({
          page: 1,
          perPage: 100,
        });

        const users = response.data;

        // Calculate gender distribution
        const genderCounts = users.reduce(
          (acc, user) => {
            const gender = user.gender.toLowerCase();
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const genderDistribution = Object.entries(genderCounts).map(
          ([gender, count]) => ({
            label: gender.charAt(0).toUpperCase() + gender.slice(1),
            value: count,
            color:
              GENDER_COLORS[gender as keyof typeof GENDER_COLORS] ||
              GENDER_COLORS.other,
          }),
        );

        // Calculate age groups
        const ageGroups = [
          { range: "18-25", min: 18, max: 25 },
          { range: "26-35", min: 26, max: 35 },
          { range: "36-45", min: 36, max: 45 },
          { range: "46-55", min: 46, max: 55 },
          { range: "56+", min: 56, max: 100 },
        ];

        const ageGroupCounts = ageGroups
          .map((group, index) => {
            const count = users.filter(
              (user) => user.dob.age >= group.min && user.dob.age <= group.max,
            ).length;

            return {
              label: group.range,
              value: count,
              color: AGE_GROUP_COLORS[index],
            };
          })
          .filter((group) => group.value > 0);

        // Calculate top countries
        const countryCounts = users.reduce(
          (acc, user) => {
            const country = user.location.country;
            acc[country] = (acc[country] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const topCountries = Object.entries(countryCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([country, count], index) => ({
            label: country,
            value: count,
            color: COUNTRY_COLORS[index],
          }));

        setDemographics({
          genderDistribution,
          ageGroups: ageGroupCounts,
          topCountries,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch demographics",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDemographics();
  }, []);

  if (loading) {
    return (
      <Stack spacing={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Demographics
            </Typography>
            <Skeleton variant="rectangular" height={200} />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Age Distribution
            </Typography>
            <Skeleton variant="rectangular" height={200} />
          </CardContent>
        </Card>
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading demographics: {error}</Alert>;
  }

  if (!demographics) {
    return null;
  }

  return (
    <Stack spacing={2}>
      {/* Gender Distribution */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Gender Distribution
          </Typography>
          <PieChart
            series={[
              {
                data: demographics.genderDistribution.map((item, index) => ({
                  id: index,
                  value: item.value,
                  label: `${item.label} (${item.value})`,
                  color: item.color,
                })),
              },
            ]}
            width={400}
            height={200}
          />
        </CardContent>
      </Card>

      {/* Age Groups */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Age Groups
          </Typography>
          <PieChart
            series={[
              {
                data: demographics.ageGroups.map((item, index) => ({
                  id: index,
                  value: item.value,
                  label: `${item.label} (${item.value})`,
                  color: item.color,
                })),
              },
            ]}
            width={400}
            height={200}
          />
        </CardContent>
      </Card>

      {/* Top Countries */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Countries
          </Typography>
          <PieChart
            series={[
              {
                data: demographics.topCountries.map((item, index) => ({
                  id: index,
                  value: item.value,
                  label: `${item.label} (${item.value})`,
                  color: item.color,
                })),
              },
            ]}
            width={400}
            height={200}
          />
        </CardContent>
      </Card>
    </Stack>
  );
}
