import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminDashboard from '@/screens/admin/Dashboard';
// import AdminReports from '@/screens/admin/Reports';
// import AdminUsers from '@/screens/admin/Users';
// import AdminPoliceStations from '@/screens/admin/PoliceStations';
// import AdminProfile from '@/screens/admin/Profile';
import CustomAdminDrawer from '@/components/admin/CustomAdminDrawer';
import tw from 'twrnc';

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
        component={"#"} 
        options={{ title: 'Reports' }}
      />
      <Drawer.Screen 
        name="AdminPoliceStations" 
        component={"#"}
        options={{ title: 'Police Stations' }}
      />
      <Drawer.Screen 
        name="AdminCities" 
        component={"#"}
        options={{ title: 'Cities' }}
      />
      <Drawer.Screen 
        name="AdminUsers" 
        component={"#"}
        options={{ title: 'Users' }}  
      />
      
      <Drawer.Screen 
        name="AdminProfile" 
        component={"#"}
        options={{ title: 'Profile' }}
      />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;