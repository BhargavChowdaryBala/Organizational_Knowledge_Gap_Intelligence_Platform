import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 backdrop-blur-md pt-16 pb-8 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="Knowledge Gap Analyzer Logo"
                className="h-8 w-auto object-contain mix-blend-multiply dark:mix-blend-normal"
              />
              <span className="font-semibold text-xl tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                Knowledge Gap Analyzer
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 transition-colors duration-300">
              Empowering enterprises to identify, analyze, and bridge hidden knowledge gaps with AI-driven intelligence.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-medium mb-6 transition-colors duration-300">Product</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-medium mb-6 transition-colors duration-300">Resources</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-medium mb-6 transition-colors duration-300">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-cyan-600 dark:hover:text-[#d9f95d] transition-colors">Partners</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Knowledge Gap Analyzer Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
