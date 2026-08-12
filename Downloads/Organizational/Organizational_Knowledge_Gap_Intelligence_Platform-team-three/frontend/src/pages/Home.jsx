import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Workflow from '../components/Workflow';
import Features from '../components/Features';
import Organization from '../components/Organization';
import Impact from '../components/Impact';
import Footer from '../components/Footer';

import VideoBackground from '../components/VideoBackground';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-slate-900 dark:text-slate-200 font-sans selection:bg-cyan-500/30 relative overflow-x-hidden transition-colors duration-300">
      {/* Video Background */}
      <VideoBackground />
      
      {/* Main Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Content grows to push footer down if needed */}
        <div className="flex-grow">
          <Hero />
          <Workflow />
          <Features />
          <Organization />
          <Impact />
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Home;
