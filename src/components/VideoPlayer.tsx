
import React from "react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  // Determine if it's a YouTube URL
  const isYouTubeUrl = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  
  // Get YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  if (isYouTubeUrl) {
    const videoId = getYouTubeId(videoUrl);
    
    if (videoId) {
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }
  }
  
  // If it's a direct video URL, use the HTML5 video player
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        className="w-full h-full"
        controls
        src={videoUrl}
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
