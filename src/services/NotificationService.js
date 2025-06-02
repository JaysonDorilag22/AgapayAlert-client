// src/services/NotificationService.js
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import serverConfig from '../config/serverConfig';

class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = [];
  }

  initialize(user, token) {
    if (user && token && user.roles === 'police_officer') {
      this.initializeSocket(user, token);
    }
  }

  initializeSocket(user, token) {
    this.socket = io(serverConfig.socketURL, {
      auth: { token },
    });

    // Join police station room
    if (user.policeStation) {
      this.socket.emit('join', `policeStation_${user.policeStation._id}`);
    }

    // Listen for NEW_REPORT events from your backend
    this.socket.on('NEW_REPORT', (data) => {
      this.handleNewReport(data, user);
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  handleNewReport(data, user) {
    const { report, message, eligibleOfficers } = data;
    
    // Find current user in eligible officers
    const userOfficer = eligibleOfficers?.find(o => o.id === user._id);
    
    if (userOfficer) {
      const notification = {
        id: Date.now(),
        title: userOfficer.isAssigned ? 'CASE ASSIGNED TO YOU!' : 'NEW CASE ALERT',
        message: userOfficer.isAssigned 
          ? `You have been automatically assigned to ${report.type} case ${report.caseId}`
          : `New ${report.type} case available at your station`,
        data: {
          reportId: report._id,
          caseId: report.caseId,
          type: report.type,
          isAssigned: userOfficer.isAssigned,
          isNearestOfficer: userOfficer.isNearest,
          report: report,
          officer: userOfficer
        },
        priority: userOfficer.isAssigned ? 'urgent' : 'normal',
        timestamp: new Date()
      };
      
      this.notifyListeners(notification);
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(notification) {
    this.listeners.forEach(listener => listener(notification));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new NotificationService();