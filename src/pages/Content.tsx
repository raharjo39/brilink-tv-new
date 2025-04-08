
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
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
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { videoService } from '@/services/api';
import { 
  Plus, 
  MoreVertical, 
  Trash, 
  Play, 
  Pencil, 
  X,
  AlertCircle,
  Clock,
  Film,
  Eye
} from 'lucide-react';
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

const Content = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    thumbnail: '',
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await videoService.getVideos();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, you would handle file upload here
      const newVideo = await videoService.createVideo({
        ...formData,
        duration: 30, // Mock duration in seconds
        status: 'active',
      });
      
      setVideos((prev) => [...prev, newVideo]);
      toast.success(`Video "${formData.title}" uploaded successfully`);
      setUploadDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        url: '',
        thumbnail: '',
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!selectedVideo) return;
      
      await videoService.deleteVideo(selectedVideo.id);
      setVideos((prev) => prev.filter((video) => video.id !== selectedVideo.id));
      toast.success(`Video "${selectedVideo.title}" deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };
  
  const handlePreviewVideo = (video: any) => {
    setPreviewVideo(video.url);
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Content Library</h1>
            <p className="text-muted-foreground">
              Manage video content for your BriLink TV devices
            </p>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Video
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="video-card animate-pulse">
                <div className="bg-gray-300 h-40"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Film className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No videos found</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first video to start broadcasting content to your BriLink TV devices.
            </p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="video-card group">
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button 
                      size="icon" 
                      variant="secondary"
                      onClick={() => handlePreviewVideo(video)}
                      className="mr-2"
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      onClick={() => {
                        navigate(`/tv-client/preview?video=${video.id}`);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-white bg-black bg-opacity-50 hover:bg-opacity-70">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreviewVideo(video)}>
                          <Play className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedVideo(video);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
                  <div className="flex items-center mt-3 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(video.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className={`ml-auto px-2 py-1 rounded-full text-xs ${
                      video.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Upload Video Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Upload New Video</DialogTitle>
            <DialogDescription>
              Add a new video to your content library for BriLink TV devices.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter video description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">Video URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="Enter video URL or upload file"
                required
              />
              <p className="text-xs text-muted-foreground">
                For demo: Use URL like https://samplelib.com/lib/preview/mp4/sample-5s.mp4
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="Enter thumbnail URL or upload image"
                required
              />
              <p className="text-xs text-muted-foreground">
                For demo: Use URL like https://picsum.photos/seed/briXX/300/200
              </p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="active" defaultChecked />
              <Label htmlFor="active">Active (available for playback)</Label>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Upload Video</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedVideo?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Video Preview Dialog */}
      <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
        <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden">
          <video 
            controls 
            autoPlay 
            className="w-full h-auto" 
            src={previewVideo || undefined} 
          />
          <div className="absolute top-2 right-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setPreviewVideo(null)}
              className="h-8 w-8 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Content;
