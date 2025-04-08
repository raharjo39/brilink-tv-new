
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "sonner";

const TVClient = () => {
  const { deviceId = "preview" } = useParams();
  const [videos, setVideos] = useState<any[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Mock video data
  const mockVideos = [
    {
      id: '1',
      title: 'BRI KPR Promo Video',
      url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    },
    {
      id: '2',
      title: 'BRI Savings Account',
      url: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
    },
    {
      id: '3',
      title: 'BRImo Mobile Banking',
      url: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    }
  ];
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch videos from the API based on campaign assignment
        // const response = await fetch(`https://api.brilink-tv.com/devices/${deviceId}/videos`);
        // const data = await response.json();
        
        // For demo, use mock videos
        setVideos(mockVideos);
        
        // Simulate connection to server
        setTimeout(() => {
          setConnectionStatus('connected');
          toast.success('Connected to BriLink TV server');
        }, 1500);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to fetch videos');
        setConnectionStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
    
    // Simulate sending heartbeats to the server
    const heartbeatInterval = setInterval(() => {
      if (connectionStatus === 'connected') {
        console.log('Sending heartbeat to server for device:', deviceId);
      }
    }, 30000);
    
    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [deviceId]);
  
  // Handle video playback
  useEffect(() => {
    if (videos.length === 0 || loading) return;
    
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handleVideoEnd = () => {
      // Move to next video in playlist
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };
    
    videoElement.addEventListener('ended', handleVideoEnd);
    
    // Start playing current video
    videoElement.src = videos[currentVideoIndex].url;
    videoElement.load();
    
    // Report playback started
    console.log(`Started playing: ${videos[currentVideoIndex].title}`);
    
    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [videos, currentVideoIndex, loading]);
  
  return (
    <div className="tv-client-screen">
      {loading ? (
        <div className="flex flex-col items-center animate-pulse">
          <div className="bg-bri-blue text-white font-bold rounded-md h-16 w-16 flex items-center justify-center mb-4">
            B
          </div>
          <p className="text-white font-heading text-xl">Loading BriLink TV content...</p>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            className="w-full h-full object-contain"
            playsInline
          />
          
          {/* Status overlay */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black bg-opacity-50 text-white text-xs px-3 py-1.5 rounded-full">
            <div className={`h-2 w-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span>{deviceId} - {videos[currentVideoIndex]?.title}</span>
          </div>
          
          {/* BRI branding in corner */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black bg-opacity-50 px-3 py-2 rounded-md">
            <div className="bg-bri-blue text-white font-bold rounded-md h-6 w-6 flex items-center justify-center">
              B
            </div>
            <span className="text-white font-heading font-bold">BriLink TV</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TVClient;
