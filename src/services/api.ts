
import axios from 'axios';
import { toast } from "sonner";

// Mock API base URL (in a real app, you would use an environment variable)
const API_URL = 'https://api.brilink-tv.com';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('brilink_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The server responded with a status code outside of 2xx range
      if (error.response.status === 401) {
        localStorage.removeItem('brilink_token');
        window.location.href = '/login';
      } else {
        toast.error(error.response.data.message || 'An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (username: string, password: string) => {
    // For demo purposes, we'll use mock data
    if (username === 'admin' && password === 'password') {
      // Mock successful login
      const response = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          username: 'admin',
          name: 'Admin User',
          role: 'admin'
        }
      };
      localStorage.setItem('brilink_token', response.token);
      localStorage.setItem('brilink_user', JSON.stringify(response.user));
      return response;
    } else {
      // Mock failed login
      throw new Error('Invalid credentials');
    }
    
    // In a real app, you would do:
    // const response = await api.post('/auth/login', { username, password });
    // return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('brilink_token');
    localStorage.removeItem('brilink_user');
    window.location.href = '/login';
  },
  
  getUser: () => {
    const user = localStorage.getItem('brilink_user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('brilink_token');
  }
};

// Video Content Service
export const videoService = {
  // Mock videos data for demo
  mockVideos: [
    {
      id: '1',
      title: 'BRI KPR Promo Video',
      description: 'Promotional video for BRI home loans',
      thumbnail: 'https://picsum.photos/seed/bri1/300/200',
      url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      duration: 45,
      status: 'active',
      createdAt: '2024-04-01T10:30:00Z'
    },
    {
      id: '2',
      title: 'BRI Savings Account',
      description: 'Benefits of BRI savings accounts',
      thumbnail: 'https://picsum.photos/seed/bri2/300/200',
      url: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
      duration: 30,
      status: 'active',
      createdAt: '2024-03-28T14:20:00Z'
    },
    {
      id: '3',
      title: 'BRImo Mobile Banking',
      description: 'Introduction to BRImo mobile banking app',
      thumbnail: 'https://picsum.photos/seed/bri3/300/200',
      url: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
      duration: 60,
      status: 'active',
      createdAt: '2024-03-20T09:15:00Z'
    }
  ],

  getVideos: async () => {
    // Mock implementation
    return videoService.mockVideos;
    
    // In a real app:
    // const response = await api.get('/videos');
    // return response.data;
  },
  
  getVideo: async (id: string) => {
    // Mock implementation
    return videoService.mockVideos.find(v => v.id === id);
    
    // In a real app:
    // const response = await api.get(`/videos/${id}`);
    // return response.data;
  },
  
  createVideo: async (videoData: any) => {
    // Mock implementation
    const newVideo = {
      id: Math.random().toString(36).substr(2, 9),
      ...videoData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    videoService.mockVideos.push(newVideo);
    return newVideo;
    
    // In a real app:
    // const response = await api.post('/videos', videoData);
    // return response.data;
  },
  
  deleteVideo: async (id: string) => {
    // Mock implementation
    const index = videoService.mockVideos.findIndex(v => v.id === id);
    if (index !== -1) {
      videoService.mockVideos.splice(index, 1);
    }
    return { success: true };
    
    // In a real app:
    // const response = await api.delete(`/videos/${id}`);
    // return response.data;
  }
};

// Campaign Service
export const campaignService = {
  // Mock campaigns data for demo
  mockCampaigns: [
    {
      id: '1',
      name: 'New Year Promotion',
      description: 'Special rates for the new year',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-02-01T00:00:00Z',
      status: 'completed',
      videos: ['1', '2'],
      locations: ['Jakarta', 'Surabaya', 'Bandung'],
      createdAt: '2023-12-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Ramadan Special',
      description: 'Special rates during Ramadan',
      startDate: '2024-03-10T00:00:00Z',
      endDate: '2024-04-10T00:00:00Z',
      status: 'active',
      videos: ['2', '3'],
      locations: ['Jakarta', 'Medan'],
      createdAt: '2024-02-25T14:20:00Z'
    },
    {
      id: '3',
      name: 'SME Financing Campaign',
      description: 'Promoting SME financing options',
      startDate: '2024-05-01T00:00:00Z',
      endDate: '2024-06-01T00:00:00Z',
      status: 'scheduled',
      videos: ['1', '3'],
      locations: ['Jakarta', 'Bali', 'Makassar'],
      createdAt: '2024-03-20T09:15:00Z'
    }
  ],
  
  getCampaigns: async () => {
    // Mock implementation
    return campaignService.mockCampaigns;
    
    // In a real app:
    // const response = await api.get('/campaigns');
    // return response.data;
  },
  
  getCampaign: async (id: string) => {
    // Mock implementation
    return campaignService.mockCampaigns.find(c => c.id === id);
    
    // In a real app:
    // const response = await api.get(`/campaigns/${id}`);
    // return response.data;
  },
  
  createCampaign: async (campaignData: any) => {
    // Mock implementation
    const newCampaign = {
      id: Math.random().toString(36).substr(2, 9),
      ...campaignData,
      createdAt: new Date().toISOString()
    };
    campaignService.mockCampaigns.push(newCampaign);
    return newCampaign;
    
    // In a real app:
    // const response = await api.post('/campaigns', campaignData);
    // return response.data;
  }
};

// Device Service
export const deviceService = {
  // Mock devices data for demo
  mockDevices: [
    {
      id: '1',
      name: 'BriLink Jakarta 001',
      location: 'Jakarta',
      status: 'online',
      lastConnection: '2024-04-08T08:35:12Z',
      ipAddress: '192.168.1.101',
      currentCampaign: '2',
      model: 'TCL-40S325',
      osVersion: '1.0.1',
      registeredAt: '2023-11-10T09:00:00Z'
    },
    {
      id: '2',
      name: 'BriLink Surabaya 003',
      location: 'Surabaya',
      status: 'offline',
      lastConnection: '2024-04-07T14:22:30Z',
      ipAddress: '192.168.1.102',
      currentCampaign: null,
      model: 'Samsung-UA43T5300',
      osVersion: '1.0.1',
      registeredAt: '2023-11-12T11:15:00Z'
    },
    {
      id: '3',
      name: 'BriLink Medan 002',
      location: 'Medan',
      status: 'online',
      lastConnection: '2024-04-08T09:15:45Z',
      ipAddress: '192.168.1.103',
      currentCampaign: '2',
      model: 'LG-32LM630',
      osVersion: '1.0.0',
      registeredAt: '2023-11-15T10:30:00Z'
    },
    {
      id: '4',
      name: 'BriLink Bandung 001',
      location: 'Bandung',
      status: 'online',
      lastConnection: '2024-04-08T09:05:22Z',
      ipAddress: '192.168.1.104',
      currentCampaign: null,
      model: 'Polytron-32T1500',
      osVersion: '1.0.1',
      registeredAt: '2023-12-01T08:45:00Z'
    }
  ],
  
  getDevices: async () => {
    // Mock implementation
    return deviceService.mockDevices;
    
    // In a real app:
    // const response = await api.get('/devices');
    // return response.data;
  },
  
  getDevice: async (id: string) => {
    // Mock implementation
    return deviceService.mockDevices.find(d => d.id === id);
    
    // In a real app:
    // const response = await api.get(`/devices/${id}`);
    // return response.data;
  },
  
  registerDevice: async (deviceData: any) => {
    // Mock implementation
    const newDevice = {
      id: Math.random().toString(36).substr(2, 9),
      ...deviceData,
      status: 'online',
      lastConnection: new Date().toISOString(),
      registeredAt: new Date().toISOString()
    };
    deviceService.mockDevices.push(newDevice);
    return newDevice;
    
    // In a real app:
    // const response = await api.post('/devices/register', deviceData);
    // return response.data;
  }
};

// Analytics Service
export const analyticsService = {
  // Mock analytics data for demo
  getDeviceStatistics: async () => {
    // Mock implementation
    return {
      totalDevices: 4,
      onlineDevices: 3,
      offlineDevices: 1,
      activeDevices: 2  // Devices currently playing content
    };
  },
  
  getCampaignStatistics: async () => {
    // Mock implementation
    return {
      totalCampaigns: 3,
      activeCampaigns: 1,
      scheduledCampaigns: 1,
      completedCampaigns: 1
    };
  },
  
  getVideoStatistics: async () => {
    // Mock implementation
    return {
      totalVideos: 3,
      totalPlaytime: 135, // seconds
      mostPlayedVideo: '2'
    };
  },
  
  getPlaybackData: async () => {
    // Mock implementation
    return [
      { date: '2024-04-01', playCount: 120 },
      { date: '2024-04-02', playCount: 134 },
      { date: '2024-04-03', playCount: 95 },
      { date: '2024-04-04', playCount: 105 },
      { date: '2024-04-05', playCount: 125 },
      { date: '2024-04-06', playCount: 80 },
      { date: '2024-04-07', playCount: 70 }
    ];
  }
};

export default api;
