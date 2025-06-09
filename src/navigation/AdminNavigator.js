import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  LayoutDashboard,
  FileText,
  Search,
  Building2,
  MapPin,
  Bell,
  Radio,
  FileSearch,
  CircleUser,
  Phone,
  Database
} from "lucide-react-native";
import AdminDashboard from "@/screens/admin/Dashboard";
import CustomAdminDrawer from "@/components/admin/CustomAdminDrawer";
import tw from "twrnc";
import Reports from "@/screens/admin/reports/Reports";
import PoliceStation from "@/screens/admin/policeStation/PoliceStation";
import City from "@/screens/admin/city/City";
import Alert from "@/screens/admin/alerts/Alert";
// import Broadcast from "@/screens/admin/broadcast/Broadcast";
import Finder from "@/screens/admin/finder/Finder";
import ReportDetails from "@/screens/admin/reports/ReportDetails";
import Alpr from "@/screens/admin/alpr/Alpr";
// import AlertDetails from "@/screens/alerts/AlertDetails";
import Users from "@/screens/admin/users/Users";
import EmergencyContact from "@/screens/admin/emergency/EmergencyContact";
import DataManagement from "@/screens/admin/reports/DataManagement";

const Drawer = createDrawerNavigator();

const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomAdminDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#ffff" },
        headerTintColor: "#041562",
        drawerStyle: tw`bg-white p-2`,
        drawerActiveTintColor: "#11468F",
      }}
    >
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          title: "Dashboard",
          drawerIcon: ({ focused, size }) => <LayoutDashboard size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      <Drawer.Screen
        name="AdminReports"
        component={Reports}
        options={{
          title: "Reports",
          drawerIcon: ({ focused, size }) => <FileText size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      <Drawer.Screen
        name="AdminFinder"
        component={Finder}
        options={{
          title: "Finder",
          drawerIcon: ({ focused, size }) => <Search size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      <Drawer.Screen
        name="AdminPoliceStations"
        component={PoliceStation}
        options={{
          title: "Police Stations",
          drawerIcon: ({ focused, size }) => <Building2 size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      <Drawer.Screen
        name="AdminCities"
        component={City}
        options={{
          title: "Cities",
          drawerIcon: ({ focused, size }) => <MapPin size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      <Drawer.Screen
        name="AdminAlerts"
        component={Alert}
        options={{
          title: "Alerts",
          drawerIcon: ({ focused, size }) => <Bell size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      {/* <Drawer.Screen
        name="AdminBroadcasts"
        component={Broadcast}
        options={{
          title: "Broadcasts",
          drawerIcon: ({ focused, size }) => <Radio size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      /> */}
      <Drawer.Screen
        name="ReportDetails"
        component={ReportDetails}
        options={{
          title: "Report Details",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="AdminAlpr"
        component={Alpr}
        options={{
          title: "ALPR",
          drawerIcon: ({ focused, size }) => <FileSearch size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      <Drawer.Screen
        name="AdminEmergency"
        component={EmergencyContact}
        options={{
          title: "Emergency Contacts",
          drawerIcon: ({ focused, size }) => <Phone size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      <Drawer.Screen
        name="AdminUsers"
        component={Users}
        options={{
          title: "Officers",
          drawerIcon: ({ focused, size }) => <CircleUser size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
      <Drawer.Screen
        name="AdminData"
        component={DataManagement}
        options={{
          title: "Storage",
          drawerIcon: ({ focused, size }) => <Database size={24} color={focused ? "#11468F" : "#666"} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;
