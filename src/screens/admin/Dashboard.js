import React, { useState, useEffect, useMemo, useRef } from "react";
import { SectionList, RefreshControl, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import {
  initializeSocket,
  joinRoom,
  leaveRoom,
  subscribeToNewReports,
  unsubscribeFromReports,
} from "@/services/socketService";
import ChartsSection from "./sections/ChartsSection";
import DistributionSection from "./sections/DistributionSection";
import ReportsSection from "./sections/ReportsSection";
import {
  getBasicAnalytics,
  getTypeDistribution,
  getStatusDistribution,
  getMonthlyTrend,
  getLocationHotspots,
} from "../../redux/actions/dashboardActions";
import { OverviewSection } from "./sections";
import DutyStatusCard from "@/components/admin/DutyStatusCard";
import PoliceOfficersList from "@/components/admin/PoliceOfficersList";

const Dashboard = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { basicAnalytics, typeDistribution, statusDistribution, monthlyTrend, locationHotspots, loading } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    let mounted = true;

    const setupSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const socket = await initializeSocket(token);

        if (socket && mounted) {
          socketRef.current = socket;

          if (user?.policeStation) {
            joinRoom(`policeStation_${user.policeStation}`);
          }
          if (user?.address?.city) {
            joinRoom(`city_${user.address.city}`);
          }

          subscribeToNewReports((data) => {
            if (mounted) loadData();
          });
        }
      } catch (error) {
        console.error("Socket setup error:", error);
      }
    };

    setupSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        if (user?.policeStation) {
          leaveRoom(`policeStation_${user.policeStation}`);
        }
        if (user?.address?.city) {
          leaveRoom(`city_${user.address.city}`);
        }
        unsubscribeFromReports();
      }
    };
  }, [user]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(getBasicAnalytics()),
        dispatch(getTypeDistribution()),
        dispatch(getStatusDistribution()),
        dispatch(getMonthlyTrend()),
        dispatch(getLocationHotspots()),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadData();
    setRefreshing(false);
  };

  const sections = useMemo(
    () => [
      {
        title: "Header",
        data: [{}],
        renderItem: () => (
          <>
            <DutyStatusCard />
            <PoliceOfficersList />
          </>
        ),
      },
      {
        title: "Analytics",
        data: [
          {
            overview: basicAnalytics?.overview || {},
            loading,
          },
        ],
        renderItem: ({ item }) => <OverviewSection {...item} />,
      },
      {
        title: "Distribution",
        data: [
          {
            distribution: {
              byType: basicAnalytics?.distribution?.byType || {},
              byStatus: basicAnalytics?.distribution?.byStatus || {},
            },
            loading,
          },
        ],
        renderItem: ({ item }) => <DistributionSection distribution={item.distribution} loading={item.loading} />,
      },
      {
        title: "Charts",
        data: [
          {
            typeDistribution,
            statusDistribution,
            monthlyTrend,
            locationHotspots,
            loading,
          },
        ],
        renderItem: ({ item }) => <ChartsSection {...item} />,
      },
    ],
    [basicAnalytics, typeDistribution, statusDistribution, monthlyTrend, locationHotspots, loading, refreshing, page]
  );

  return (
    <View style={tw`bg-white flex-1`}>
      <SectionList
        sections={sections}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-20`}
      />
    </View>
  );
};

export default Dashboard;
