
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsService, deviceService, videoService, campaignService } from '@/services/api';
import { MonitorPlay, Film, CalendarIcon, BarChart3, Activity, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [deviceStats, setDeviceStats] = useState<any>(null);
  const [campaignStats, setCampaignStats] = useState<any>(null);
  const [videoStats, setVideoStats] = useState<any>(null);
  const [playbackData, setPlaybackData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentDevices, setRecentDevices] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all statistics
        const deviceStatsData = await analyticsService.getDeviceStatistics();
        const campaignStatsData = await analyticsService.getCampaignStatistics();
        const videoStatsData = await analyticsService.getVideoStatistics();
        const playbackData = await analyticsService.getPlaybackData();
        const devices = await deviceService.getDevices();
        
        setDeviceStats(deviceStatsData);
        setCampaignStats(campaignStatsData);
        setVideoStats(videoStatsData);
        setPlaybackData(playbackData);
        
        // Sort devices by last connection to show most recent first
        const sortedDevices = [...devices].sort((a, b) => 
          new Date(b.lastConnection).getTime() - new Date(a.lastConnection).getTime()
        ).slice(0, 5);
        
        setRecentDevices(sortedDevices);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const statsCards = [
    { 
      title: 'Devices', 
      value: deviceStats?.totalDevices || 0, 
      description: `${deviceStats?.onlineDevices || 0} online`, 
      icon: MonitorPlay,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Videos', 
      value: videoStats?.totalVideos || 0, 
      description: `${videoStats?.totalPlaytime || 0}s total duration`, 
      icon: Film,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    { 
      title: 'Campaigns', 
      value: campaignStats?.totalCampaigns || 0, 
      description: `${campaignStats?.activeCampaigns || 0} active`, 
      icon: CalendarIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Today\'s Plays', 
      value: playbackData[playbackData.length - 1]?.playCount || 0, 
      description: 'Across all devices', 
      icon: BarChart3,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`${card.bgColor} ${card.color} p-2 rounded-full`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Charts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Playback Trends */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Playback Trends</CardTitle>
              <CardDescription>Ad plays over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={playbackData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`${value} plays`, 'Plays']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        });
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="playCount" 
                      stroke="#0066AE" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, stroke: '#0066AE', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Device Status */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Devices</CardTitle>
              <CardDescription>Latest TV device activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDevices.map((device) => (
                  <div key={device.id} className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition">
                    <div className={`p-2 rounded-full ${device.status === 'online' ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                      {device.status === 'online' ? <Activity className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{device.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${device.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {device.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-0.5">
                        <span className="truncate">{device.location}</span>
                        <span className="mx-1">•</span>
                        <span className="whitespace-nowrap">
                          {new Date(device.lastConnection).toLocaleString(undefined, { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Campaign Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Active Campaign Status</CardTitle>
            <CardDescription>Current campaigns progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock campaign progress data */}
              <div>
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium">Ramadan Special</h4>
                  <span className="text-sm text-gray-500">50% complete</span>
                </div>
                <Progress value={50} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>March 10, 2024</span>
                  <span>April 10, 2024</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium">SME Financing Campaign</h4>
                  <span className="text-sm text-gray-500">Not started</span>
                </div>
                <Progress value={0} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>May 1, 2024</span>
                  <span>June 1, 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
