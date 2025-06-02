// src/utils/useNotifications.js
import { useState, useEffect } from 'react';
import { setNewReportCallback, clearNewReportCallback } from '@/services/socketService';

export const useNotifications = () => {
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    console.log('Setting up notification callbacks...');
    
    // Handle socket NEW_REPORT events
    setNewReportCallback((reportData) => {
      console.log('Socket callback triggered with data:', reportData);
      
      // Transform socket data to notification format
      const notification = {
        id: Date.now(),
        type: 'CASE_ASSIGNMENT',
        title: 'New Case Assignment',
        message: reportData.message,
        data: {
          reportId: reportData.report._id,
          caseId: reportData.report.caseId,
          type: reportData.report.type,
          report: reportData.report,
          eligibleOfficers: reportData.eligibleOfficers,
          isAssigned: reportData.eligibleOfficers?.some(officer => officer.isAssigned),
          isNearestOfficer: false // You can determine this from the data
        },
        timestamp: new Date()
      };
      
      console.log('Setting notification:', notification);
      setCurrentNotification(notification);
    });

    return () => {
      console.log('Cleaning up notification callbacks...');
      clearNewReportCallback();
    };
  }, []);

  const dismissNotification = () => {
    console.log('Dismissing notification...');
    setCurrentNotification(null);
  };

  return {
    currentNotification,
    dismissNotification
  };
};