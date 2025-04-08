
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { deviceService, campaignService } from '@/services/api';
import { 
  Plus,
  Monitor,
  Power,
  Laptop,
  Tv,
  Info,
  MoreHorizontal,
  RefreshCw,
  PlayCircle,
  StopCircle,
  Download,
  Trash
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
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import QRCode from 'react-qr-code';

const Devices = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [deviceDetails, setDeviceDetails] = useState<any>(null);
  const [deviceType, setDeviceType] = useState<string>("tv");
  const [newDeviceData, setNewDeviceData] = useState({
    name: '',
    location: 'Jakarta',
    model: '',
  });
  const navigate = useNavigate();
  const { connected, emit } = useSocket();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const devicesData = await deviceService.getDevices();
        const campaignsData = await campaignService.getCampaigns();
        
        setDevices(devicesData);
        setCampaigns(campaignsData);
      } catch (error) {
        console.error('Error fetching devices data:', error);
        toast.error('Failed to fetch devices');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDeviceData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddDevice = async () => {
    try {
      const newDevice = await deviceService.registerDevice({
        ...newDeviceData,
        model: deviceType === 'tv' ? 'Smart TV' : 'Media Player',
        osVersion: '1.0.1',
      });
      
      setDevices((prev) => [...prev, newDevice]);
      toast.success(`Device "${newDevice.name}" added successfully`);
      setAddDeviceOpen(false);
      setNewDeviceData({
        name: '',
        location: 'Jakarta',
        model: '',
      });
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
    }
  };
  
  const handleDeviceAction = (action: string, device: any) => {
    switch (action) {
      case 'view':
        navigate(`/tv-client/${device.id}`);
        break;
      case 'details':
        setDeviceDetails(device);
        break;
      case 'restart':
        toast.success(`Restarting ${device.name}...`);
        emit('device-restart', { deviceId: device.id });
        break;
      case 'update':
        toast.success(`Updating ${device.name}...`);
        emit('device-update', { deviceId: device.id });
        break;
      default:
        console.log('Unknown action:', action);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Device Management</h1>
            <p className="text-muted-foreground">
              Manage your BriLink TV devices and monitor their status
            </p>
          </div>
          <Button onClick={() => setAddDeviceOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center text-sm font-medium">
                <div className="bg-blue-100 p-2 rounded-full text-blue-500 mr-3">
                  <Monitor className="h-4 w-4" />
                </div>
                Total Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{devices.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center text-sm font-medium">
                <div className="bg-green-100 p-2 rounded-full text-green-500 mr-3">
                  <Power className="h-4 w-4" />
                </div>
                Online Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {devices.filter(d => d.status === 'online').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center text-sm font-medium">
                <div className="bg-red-100 p-2 rounded-full text-red-500 mr-3">
                  <Power className="h-4 w-4" />
                </div>
                Offline Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {devices.filter(d => d.status === 'offline').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="flex items-center text-sm font-medium">
                <div className="bg-purple-100 p-2 rounded-full text-purple-500 mr-3">
                  <PlayCircle className="h-4 w-4" />
                </div>
                Active Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {devices.filter(d => d.currentCampaign).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Device List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : devices.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Monitor className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No devices registered</h3>
            <p className="text-muted-foreground mb-4">
              Register your first BriLink TV device to start broadcasting content.
            </p>
            <Button onClick={() => setAddDeviceOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Register Device
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => (
              <Card key={device.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex border-l-4 border-l-transparent hover:border-l-bri-blue transition-all">
                    <div className="p-6 flex-1 flex items-center">
                      <div className={`${device.status === 'online' ? 'bg-green-100' : 'bg-gray-100'} p-3 rounded-full mr-4`}>
                        {device.model?.includes('TV') ? (
                          <Tv className={`h-6 w-6 ${device.status === 'online' ? 'text-green-500' : 'text-gray-500'}`} />
                        ) : (
                          <Laptop className={`h-6 w-6 ${device.status === 'online' ? 'text-green-500' : 'text-gray-500'}`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{device.name}</h3>
                          <div className={`ml-3 h-2 w-2 rounded-full ${getStatusColor(device.status)}`}></div>
                          <Badge variant={device.status === 'online' ? 'outline' : 'secondary'} className="ml-2">
                            {device.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 mt-1">
                          <span>{device.location}</span>
                          <span>•</span>
                          <span>{device.model}</span>
                          <span>•</span>
                          <span>IP: {device.ipAddress}</span>
                        </div>
                        
                        {device.currentCampaign && (
                          <div className="mt-3">
                            <Badge variant="outline" className="bg-blue-50 text-bri-blue border-blue-200">
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Playing: {campaigns.find(c => c.id === device.currentCampaign)?.name || 'Unknown campaign'}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeviceAction('view', device)}
                        >
                          View Screen
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeviceAction('details', device)}>
                              <Info className="h-4 w-4 mr-2" />
                              Device Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeviceAction('restart', device)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Restart Device
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Update Software
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Device Dialog */}
      <Dialog open={addDeviceOpen} onOpenChange={setAddDeviceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Register a new BriLink TV device to your network
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Setup</TabsTrigger>
                <TabsTrigger value="qr">QR Code Setup</TabsTrigger>
              </TabsList>
              <TabsContent value="manual" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. BriLink Jakarta 001"
                    value={newDeviceData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select 
                    value={newDeviceData.location} 
                    onValueChange={(value) => setNewDeviceData({...newDeviceData, location: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jakarta">Jakarta</SelectItem>
                      <SelectItem value="Bandung">Bandung</SelectItem>
                      <SelectItem value="Surabaya">Surabaya</SelectItem>
                      <SelectItem value="Medan">Medan</SelectItem>
                      <SelectItem value="Makassar">Makassar</SelectItem>
                      <SelectItem value="Bali">Bali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Device Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition-all ${
                        deviceType === 'tv' ? 'border-bri-blue bg-blue-50' : 'hover:border-gray-400'
                      }`}
                      onClick={() => setDeviceType('tv')}
                    >
                      <Tv className={`h-8 w-8 mb-2 ${deviceType === 'tv' ? 'text-bri-blue' : 'text-gray-500'}`} />
                      <span className={deviceType === 'tv' ? 'font-medium text-bri-blue' : 'text-gray-700'}>Smart TV</span>
                    </div>
                    
                    <div
                      className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition-all ${
                        deviceType === 'player' ? 'border-bri-blue bg-blue-50' : 'hover:border-gray-400'
                      }`}
                      onClick={() => setDeviceType('player')}
                    >
                      <Laptop className={`h-8 w-8 mb-2 ${deviceType === 'player' ? 'text-bri-blue' : 'text-gray-500'}`} />
                      <span className={deviceType === 'player' ? 'font-medium text-bri-blue' : 'text-gray-700'}>Media Player</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="qr" className="mt-4">
                <div className="flex flex-col items-center space-y-4 py-4">
                  <QRCode 
                    value="https://brilink-tv.com/register-device" 
                    size={180}
                    className="mb-4"
                  />
                  <div className="text-center">
                    <h4 className="font-medium mb-1">Scan with BriLink TV App</h4>
                    <p className="text-sm text-gray-500">
                      Use the BriLink TV mobile app to scan this code and connect your device automatically.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDeviceOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDevice}>Register Device</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Device Details Dialog */}
      <Dialog open={!!deviceDetails} onOpenChange={() => setDeviceDetails(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
            <DialogDescription>
              Technical information about {deviceDetails?.name}
            </DialogDescription>
          </DialogHeader>
          
          {deviceDetails && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Device Name</p>
                <p className="text-sm text-gray-500">{deviceDetails.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(deviceDetails.status)} mr-2`}></div>
                  <p className="text-sm text-gray-500">{deviceDetails.status}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-500">{deviceDetails.location}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">IP Address</p>
                <p className="text-sm text-gray-500">{deviceDetails.ipAddress}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Model</p>
                <p className="text-sm text-gray-500">{deviceDetails.model}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">OS Version</p>
                <p className="text-sm text-gray-500">{deviceDetails.osVersion}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Connection</p>
                <p className="text-sm text-gray-500">
                  {new Date(deviceDetails.lastConnection).toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Registered Date</p>
                <p className="text-sm text-gray-500">
                  {new Date(deviceDetails.registeredAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="col-span-2 space-y-1">
                <p className="text-sm font-medium">Current Campaign</p>
                <p className="text-sm text-gray-500">
                  {deviceDetails.currentCampaign ? 
                    campaigns.find(c => c.id === deviceDetails.currentCampaign)?.name || 'Unknown campaign' : 
                    'No active campaign'
                  }
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeviceDetails(null)}>Close</Button>
            <Button 
              variant="default" 
              onClick={() => navigate(`/tv-client/${deviceDetails.id}`)}
            >
              View Screen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Devices;
