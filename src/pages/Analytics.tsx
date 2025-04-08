
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsService, videoService, deviceService } from '@/services/api';
import {
  BarChart3,
  Activity,
  PlayCircle,
  Clock,
  MonitorPlay,
  Calendar,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Check
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [deviceStats, setDeviceStats] = useState<any>(null);
  const [campaignStats, setCampaignStats] = useState<any>(null);
  const [videoStats, setVideoStats] = useState<any>(null);
  const [playbackData, setPlaybackData] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('week');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all statistics
        const deviceStatsData = await analyticsService.getDeviceStatistics();
        const campaignStatsData = await analyticsService.getCampaignStatistics();
        const videoStatsData = await analyticsService.getVideoStatistics();
        const playbackData = await analyticsService.getPlaybackData();
        const videosData = await videoService.getVideos();
        const devicesData = await deviceService.getDevices();
        
        setDeviceStats(deviceStatsData);
        setCampaignStats(campaignStatsData);
        setVideoStats(videoStatsData);
        setPlaybackData(playbackData);
        setVideos(videosData);
        setDevices(devicesData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generate mock device status data for pie chart
  const deviceStatusData = [
    { name: 'Online', value: deviceStats?.onlineDevices || 0, color: '#10B981' },
    { name: 'Offline', value: deviceStats?.offlineDevices || 0, color: '#6B7280' },
  ];
  
  // Generate mock campaign status data for pie chart
  const campaignStatusData = [
    { name: 'Active', value: campaignStats?.activeCampaigns || 0, color: '#3B82F6' },
    { name: 'Scheduled', value: campaignStats?.scheduledCampaigns || 0, color: '#8B5CF6' },
    { name: 'Completed', value: campaignStats?.completedCampaigns || 0, color: '#D1D5DB' },
  ];
  
  // Generate mock video playback data by location
  const playbackByLocationData = [
    { name: 'Jakarta', plays: 245 },
    { name: 'Surabaya', plays: 158 },
    { name: 'Bandung', plays: 142 },
    { name: 'Medan', plays: 98 },
    { name: 'Makassar', plays: 62 },
    { name: 'Bali', plays: 45 },
  ];
  
  // Generate mock hourly playback distribution
  const hourlyPlaybackData = [
    { hour: '6AM', plays: 12 },
    { hour: '7AM', plays: 18 },
    { hour: '8AM', plays: 27 },
    { hour: '9AM', plays: 45 },
    { hour: '10AM', plays: 56 },
    { hour: '11AM', plays: 68 },
    { hour: '12PM', plays: 72 },
    { hour: '1PM', plays: 65 },
    { hour: '2PM', plays: 58 },
    { hour: '3PM', plays: 52 },
    { hour: '4PM', plays: 48 },
    { hour: '5PM', plays: 42 },
    { hour: '6PM', plays: 38 },
    { hour: '7PM', plays: 25 },
    { hour: '8PM', plays: 15 },
  ];
  
  // Generate mock video popularity data
  const videoPopularityData = videos.map((video) => ({
    name: video.title,
    plays: Math.floor(Math.random() * 200) + 50, // Mock data
  }));
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Insights and statistics about your BriLink TV network
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Playbacks</CardTitle>
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  '720'
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                +14% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
              <MonitorPlay className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  deviceStats?.onlineDevices || '0'
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                of {deviceStats?.totalDevices || '0'} total devices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  campaignStats?.activeCampaigns || '0'
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                across {deviceStats?.activeDevices || '0'} devices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Content Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  `${Math.round((videoStats?.totalPlaytime || 0) / 60)}m`
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                across {videoStats?.totalVideos || '0'} videos
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <PlayCircle className="h-4 w-4 mr-2" />
              Content Analytics
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center">
              <MonitorPlay className="h-4 w-4 mr-2" />
              Device Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Playback Trends
                  </CardTitle>
                  <CardDescription>Daily playback count over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {loading ? (
                      <div className="h-full w-full bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={playbackData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0066AE" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#0066AE" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                          />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
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
                          <Area 
                            type="monotone" 
                            dataKey="playCount" 
                            stroke="#0066AE" 
                            fillOpacity={1} 
                            fill="url(#colorPlays)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-purple-500" />
                    Playback by Location
                  </CardTitle>
                  <CardDescription>Number of ads played per location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {loading ? (
                      <div className="h-full w-full bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={playbackByLocationData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value: any) => [`${value} plays`, 'Plays']} />
                          <Bar dataKey="plays" fill="#FF6B35" barSize={40} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-green-500" />
                    Device Status
                  </CardTitle>
                  <CardDescription>Overview of device connectivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {loading ? (
                      <div className="h-full w-full bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {deviceStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => [`${value} devices`, 'Count']} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <PieChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Campaign Status
                  </CardTitle>
                  <CardDescription>Distribution of campaign statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {loading ? (
                      <div className="h-full w-full bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={campaignStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {campaignStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => [`${value} campaigns`, 'Count']} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-amber-500" />
                    Hourly Distribution
                  </CardTitle>
                  <CardDescription>Ad plays by hour of day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {loading ? (
                      <div className="h-full w-full bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={hourlyPlaybackData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip formatter={(value: any) => [`${value} plays`, 'Plays']} />
                          <Line 
                            type="monotone" 
                            dataKey="plays" 
                            stroke="#FF6B35" 
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Performance</CardTitle>
                <CardDescription>
                  Analysis of playback statistics per video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  {loading ? (
                    <div className="h-full w-full bg-gray-100 animate-pulse rounded-md" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={videoPopularityData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          tick={{ fontSize: 12 }} 
                          width={150}
                        />
                        <Tooltip formatter={(value: any) => [`${value} plays`, 'Plays']} />
                        <Bar dataKey="plays" fill="#0066AE" barSize={20} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* More content analytics components would go here */}
          </TabsContent>
          
          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Performance</CardTitle>
                <CardDescription>
                  Uptime and playback statistics per device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-2 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    devices.map((device) => (
                      <div key={device.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{device.name}</h4>
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
                            <span className="text-sm text-gray-500">{device.status}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {device.location} • Last active: {new Date(device.lastConnection).toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-bri-blue rounded-full" 
                              style={{ width: device.status === 'online' ? '98%' : '45%' }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {device.status === 'online' ? '98%' : '45%'} uptime
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>
                            {Math.floor(Math.random() * 100) + 50} plays today
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* More device analytics components would go here */}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
