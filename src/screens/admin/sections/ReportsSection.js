import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import { RefreshCw } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import styles from "@/styles/styles";

const STATUS_COLORS = {
  Pending: "bg-yellow-500 text-yellow-800",
  Assigned: "bg-blue-500 text-blue-800",
  "Under Investigation": "bg-purple-500 text-purple-800 text-xsm",
  Resolved: "bg-green-500 text-green-800",
  Closed: "bg-gray-500 text-gray-800",
};

const TYPE_COLORS = {
  Missing: {
    backgroundColor: styles.colorPrimary + "20",
    color: styles.colorPrimary,
  },
  Abducted: {
    backgroundColor: styles.colorPrimary + "20",
    color: styles.colorPrimary,
  },
  Kidnapped: {
    backgroundColor: styles.colorPrimary + "20",
    color: styles.colorPrimary,
  },
  "Hit-and-Run": {
    backgroundColor: styles.colorPrimary + "20",
    color: styles.colorPrimary,
  },
};

const REPORT_TYPES = ["All", "Missing", "Abducted", "Kidnapped", "Hit-and-Run"];

const ReportsSection = ({
  reports = [],
  loading = false,
  refreshing = false,
  onRefresh,
  onLoadMore,
  totalPages = 1,
  currentPage = 1,
  itemsPerPage = 10,
  totalReports = 0,
}) => {
  const navigation = useNavigation();
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("All");

  const handleRowPress = (report) => {
    navigation.navigate("ReportDetails", { reportId: report._id });
  };

  useEffect(() => {
    setPage(currentPage - 1);
  }, [currentPage]);

  const handlePageChange = async (newPage) => {
    try {
      setPage(newPage);
      await onLoadMore?.(
        newPage + 1,
        selectedType !== "All" ? selectedType : null
      );
    } catch (err) {
      console.error("Pagination error:", err);
      setPage(page);
    }
  };

  const handleTypeChange = async (type) => {
    setSelectedType(type);
    setPage(0);
    try {
      await onLoadMore?.(1, type !== "All" ? type : null);
      setError(null);
    } catch (err) {
      setError("Failed to filter reports");
    }
  };

  const renderRow = (report, index) => {
    if (!report) return null;

    return (
      <TouchableOpacity
        key={`report-${report._id || index}`}
        onPress={() => handleRowPress(report)}
      >
        <DataTable.Row>
          <DataTable.Cell>
            <Image
              source={{
                uri:
                  report?.personInvolved?.mostRecentPhoto?.url ||
                  "https://via.placeholder.com/40",
              }}
              style={tw`w-10 h-10 rounded-md`}
            />
          </DataTable.Cell>
          <DataTable.Cell>
            <View
              style={[
                tw`px-2 py-1 rounded-md`,
                TYPE_COLORS[report?.type] || tw`bg-gray-100`,
              ]}
            >
              <Text
                style={[
                  tw`text-sm`,
                  { color: TYPE_COLORS[report?.type]?.color || "#374151" },
                ]}
              >
                {report?.type || "N/A"}
              </Text>
            </View>
          </DataTable.Cell>
          <DataTable.Cell>
            {`${report?.personInvolved?.firstName || ""} ${
              report?.personInvolved?.lastName || ""
            }`.trim() || "N/A"}
          </DataTable.Cell>
          <DataTable.Cell>
            <View
              style={tw`${
                STATUS_COLORS[report?.status]?.split(" ")[0] || "bg-gray-100"
              } px-2 py-1 rounded-lg`}
            >
              <Text
                style={tw`${
                  STATUS_COLORS[report?.status]?.split(" ")[1] ||
                  "text-gray-800"
                } text-sm`}
              >
                {report?.status || "N/A"}
              </Text>
            </View>
          </DataTable.Cell>
        </DataTable.Row>
      </TouchableOpacity>
    );
  };

  const renderSkeletonRow = (index) => (
    <DataTable.Row key={`skeleton-${index}`}>
      <DataTable.Cell>
        <View style={tw`w-10 h-10 bg-gray-200 rounded-full`} />
      </DataTable.Cell>
      <DataTable.Cell>
        <View style={tw`w-16 h-4 bg-gray-200 rounded`} />
      </DataTable.Cell>
      <DataTable.Cell>
        <View style={tw`w-24 h-4 bg-gray-200 rounded`} />
      </DataTable.Cell>
      <DataTable.Cell>
        <View style={tw`w-16 h-4 bg-gray-200 rounded`} />
      </DataTable.Cell>
    </DataTable.Row>
  );

  const isDisabled = Boolean(loading || refreshing);
  const validTotalPages = Math.max(1, totalPages);

  const handleRefresh = async () => {
    try {
      setSelectedType("All");
      await onRefresh?.();
      setError(null);
    } catch (err) {
      setError("Failed to refresh");
    }
  };

  return (
    <View style={tw`bg-white rounded-lg border border-gray-200 p-4 mt-4`}>
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <Text style={tw`text-lg font-bold text-gray-800`}>Recent Reports</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          disabled={isDisabled}
          style={tw`p-2`}
        >
          <RefreshCw size={20} color={isDisabled ? "#9CA3AF" : "#3B82F6"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mb-4`}
      >
        <View style={tw`flex-row`}>
          {REPORT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => handleTypeChange(type)}
              style={[
                tw`min-w-[90px] h-[36px] rounded-lg mr-2 justify-center items-center border`,
                selectedType === type
                  ? styles.backgroundColorPrimary
                  : tw`bg-white border-gray-300`,
              ]}
            >
              <Text
                style={tw`${
                  selectedType === type ? "text-white" : "text-gray-700"
                } text-[14px] font-medium`}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {error && <Text style={tw`text-red-500 mb-2`}>{error}</Text>}

      <DataTable>
        <DataTable.Header style={tw`border-b border-gray-200`}>
          <DataTable.Title>Photo</DataTable.Title>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title>Person</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>

        {loading && !reports.length ? (
          Array(itemsPerPage)
            .fill(0)
            .map((_, index) => renderSkeletonRow(index))
        ) : reports.length > 0 ? (
          reports.map((report, index) => renderRow(report, index))
        ) : (
          <DataTable.Row>
            <DataTable.Cell style={tw`text-center`} colSpan={4}>
              <Text style={tw`text-gray-500`}>
                {selectedType !== "All"
                  ? `No ${selectedType} reports found`
                  : "No reports found"}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
        )}

        {reports.length > 0 && (
          <DataTable.Pagination
            page={page}
            numberOfPages={validTotalPages}
            onPageChange={handlePageChange}
            label={`${page + 1} of ${validTotalPages}`}
            showFastPaginationControls
            numberOfItemsPerPage={itemsPerPage}
          />
        )}
      </DataTable>
    </View>
  );
};

export default ReportsSection;
