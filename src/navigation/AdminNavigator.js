import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminDashboard from '@/screens/admin/Dashboard';
import CustomAdminDrawer from '@/components/admin/CustomAdminDrawer';
import tw from 'twrnc';
import Reports from '@/screens/admin/reports/Reports';
import PoliceStation from '@/screens/admin/policeStation/PoliceStation';
import City from '@/screens/admin/city/City';
import Alert from '@/screens/admin/alerts/Alert';
import Broadcast from '@/screens/admin/broadcast/Broadcast'; 
import Finder from '@/screens/admin/finder/Finder';
import ReportDetails from '@/screens/admin/reports/ReportDetails';
import Alpr from '@/screens/admin/alpr/Alpr';
import AlertDetails from '@/screens/alerts/AlertDetails';
import Users from '@/screens/admin/users/Users';


const Drawer = createDrawerNavigator();

const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomAdminDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#041562' },
        headerTintColor: '#fff',
        drawerStyle: tw`bg-white p-2`,
        drawerActiveTintColor: "#11468F",
      }}
    >
      <Drawer.Screen 
        name="AdminDashboard" 
        component={AdminDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen 
        name="AdminReports" 
        component={Reports}
        options={{ title: 'Reports' }}
      />
      <Drawer.Screen 
        name="AdminFinder" 
        component={Finder}
        options={{ title: 'Finder' }}
      />
      <Drawer.Screen 
        name="AdminPoliceStations" 
        component={PoliceStation}
        options={{ title: 'Police Stations' }}
      />
      <Drawer.Screen 
        name="AdminCities" 
        component={City}
        options={{ title: 'Cities' }}
      />
      <Drawer.Screen 
        name="AdminAlerts" 
        component={Alert}
        options={{ title: 'Alerts' }}
      />
      <Drawer.Screen 
        name="AdminBroadcasts" 
        component={Broadcast}
        options={{ title: 'Broadcasts' }}
      />
      <Drawer.Screen 
        name="ReportDetails" 
        component={ReportDetails}
        options={{ 
          title: 'Report Details',
          drawerItemStyle: { display: 'none' } 
        }}
      />
      <Drawer.Screen 
        name="AdminAlpr" 
        component={Alpr}
        options={{ title: 'ALPR' }}
      />
      {/* // users */}
      <Drawer.Screen 
        name="AdminUsers" 
        component={Users}
        options={{ title: 'Users' }}
      />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;