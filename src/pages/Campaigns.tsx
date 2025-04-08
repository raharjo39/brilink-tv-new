
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { campaignService, videoService, deviceService } from '@/services/api';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Film, 
  Play, 
  Pause,
  Trash, 
  Edit,
  MoreHorizontal, 
  CalendarRange,
  MonitorPlay
} from 'lucide-react';
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

interface CampaignWithProgress extends Record<string, any> {
  progress: number;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<CampaignWithProgress[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addCampaignOpen, setAddCampaignOpen] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const campaignsData = await campaignService.getCampaigns();
        const videosData = await videoService.getVideos();
        const devicesData = await deviceService.getDevices();
        
        // Calculate progress for each campaign
        const campaignsWithProgress = campaignsData.map((campaign: any) => {
          const start = new Date(campaign.startDate).getTime();
          const end = new Date(campaign.endDate).getTime();
          const now = new Date().getTime();
          
          let progress = 0;
          if (now >= end) {
            progress = 100;
          } else if (now >= start) {
            progress = Math.round(((now - start) / (end - start)) * 100);
          }
          
          return { ...campaign, progress };
        });
        
        setCampaigns(campaignsWithProgress);
        setVideos(videosData);
        setDevices(devicesData);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
        toast.error('Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCampaign((prev) => ({ ...prev, [name]: value }));
  };
  
  const toggleVideoSelection = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId));
    } else {
      setSelectedVideos([...selectedVideos, videoId]);
    }
  };
  
  const toggleLocationSelection = (location: string) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(loc => loc !== location));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };
  
  const handleCreateCampaign = async () => {
    try {
      if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (selectedVideos.length === 0) {
        toast.error('Please select at least one video');
        return;
      }
      
      if (selectedLocations.length === 0) {
        toast.error('Please select at least one location');
        return;
      }
      
      const startDate = new Date(newCampaign.startDate);
      const endDate = new Date(newCampaign.endDate);
      
      if (startDate >= endDate) {
        toast.error('End date must be after start date');
        return;
      }
      
      const now = new Date();
      let status = 'scheduled';
      
      if (startDate <= now && endDate >= now) {
        status = 'active';
      } else if (endDate < now) {
        status = 'completed';
      }
      
      const newCampaignData = {
        ...newCampaign,
        videos: selectedVideos,
        locations: selectedLocations,
        status,
      };
      
      const createdCampaign = await campaignService.createCampaign(newCampaignData);
      
      // Add progress to created campaign
      const start = new Date(createdCampaign.startDate).getTime();
      const end = new Date(createdCampaign.endDate).getTime();
      const currentTime = now.getTime();
      
      let progress = 0;
      if (currentTime >= end) {
        progress = 100;
      } else if (currentTime >= start) {
        progress = Math.round(((currentTime - start) / (end - start)) * 100);
      }
      
      const campaignWithProgress = { ...createdCampaign, progress };
      
      setCampaigns([...campaigns, campaignWithProgress]);
      toast.success(`Campaign "${createdCampaign.name}" created successfully`);
      
      // Reset form
      setAddCampaignOpen(false);
      setNewCampaign({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
      });
      setSelectedVideos([]);
      setSelectedLocations([]);
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    }
  };
  
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get unique locations from devices array
  const uniqueLocations = Array.from(new Set(devices.map(d => d.location)));
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Campaign Management</h1>
            <p className="text-muted-foreground">
              Schedule and manage advertising campaigns for your BriLink TV network
            </p>
          </div>
          <Button onClick={() => setAddCampaignOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
        
        {/* Campaign Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center text-sm font-medium">
                <div className="bg-blue-100 p-2 rounded-full text-blue-500 mr-3">
                  <Calendar className="h-4 w-4" />
                </div>
                Total Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{campaigns.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center text-sm font-medium">
                <div className="bg-green-100 p-2 rounded-full text-green-500 mr-3">
                  <Play className="h-4 w-4" />
                </div>
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center text-sm font-medium">
                <div className="bg-blue-100 p-2 rounded-full text-blue-500 mr-3">
                  <Clock className="h-4 w-4" />
                </div>
                Scheduled Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {campaigns.filter(c => c.status === 'scheduled').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center text-sm font-medium">
                <div className="bg-gray-100 p-2 rounded-full text-gray-500 mr-3">
                  <Pause className="h-4 w-4" />
                </div>
                Completed Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {campaigns.filter(c => c.status === 'completed').length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Campaign List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center p-12">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No campaigns found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first advertising campaign.
                </p>
                <Button onClick={() => setAddCampaignOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarRange className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">
                            {formatDateRange(campaign.startDate, campaign.endDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusClass(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{campaign.progress}%</span>
                            {campaign.status === 'active' && (
                              <span className="text-green-600">Active</span>
                            )}
                          </div>
                          <Progress value={campaign.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {campaign.status === 'active' ? (
                              <DropdownMenuItem>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            ) : campaign.status === 'paused' || campaign.status === 'scheduled' ? (
                              <DropdownMenuItem>
                                <Play className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem>
                              <MonitorPlay className="h-4 w-4 mr-2" />
                              Assigned Devices
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Create Campaign Dialog */}
      <Dialog open={addCampaignOpen} onOpenChange={setAddCampaignOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Create an advertising campaign to schedule content for specific locations and times.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Campaign Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Ramadan Special"
                  value={newCampaign.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Campaign description"
                  value={newCampaign.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Content Selection */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Select Videos</Label>
                <div className="border rounded-md max-h-[150px] overflow-y-auto p-2 space-y-2">
                  {videos.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-2">No videos available</p>
                  ) : (
                    videos.map((video) => (
                      <div key={video.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`video-${video.id}`}
                          checked={selectedVideos.includes(video.id)}
                          onCheckedChange={() => toggleVideoSelection(video.id)}
                        />
                        <Label htmlFor={`video-${video.id}`} className="text-sm flex items-center cursor-pointer">
                          <Film className="h-3 w-3 mr-2 text-gray-500" />
                          {video.title}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Select Locations</Label>
                <div className="border rounded-md max-h-[150px] overflow-y-auto p-2 space-y-2">
                  {uniqueLocations.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-2">No locations available</p>
                  ) : (
                    uniqueLocations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`location-${location}`}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={() => toggleLocationSelection(location)}
                        />
                        <Label htmlFor={`location-${location}`} className="text-sm flex items-center cursor-pointer">
                          <MapPin className="h-3 w-3 mr-2 text-gray-500" />
                          {location}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setAddCampaignOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Campaigns;
