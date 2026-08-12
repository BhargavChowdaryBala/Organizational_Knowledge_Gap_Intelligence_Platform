import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-100 hidden dark:block"
      >
        {/* Local video from public folder */}
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Light Mode Clean Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-200 dark:hidden"></div>

      {/* Dark gradient overlay reduced to increase video intensity while keeping text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 hidden dark:block pointer-events-none"></div>

      {/* Increased cyan ambient glow to tie the video into the brand colors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default VideoBackground;
