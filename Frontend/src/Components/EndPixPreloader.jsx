import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EndPixPreloader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsComplete(true), 500);
          return 100;
        }
        return prev + (0.5 + Math.random() * 2.5); // Variable loading speed
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-emerald-950 flex flex-col items-center justify-center p-6 z-50 overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400 opacity-10 blur-xl"
            style={{
              width: `${100 + Math.random() * 150}px`,
              height: `${100 + Math.random() * 150}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-2xl bg-gray-800 bg-opacity-50 backdrop-blur-md border border-emerald-500 border-opacity-30 flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl bg-emerald-500 opacity-20 blur-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* App title */}
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 mb-3">
          EndPix NextGen
        </h1>

        {/* Loading state */}
        {!isComplete ? (
          <>
            <p className="text-gray-300 mb-6">Initializing image enhancement engine...</p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 bg-opacity-50 rounded-full h-2.5 mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <p className="text-sm text-emerald-300">{Math.floor(loadingProgress)}% complete</p>
            
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mt-8 inline-block"
            >
              <svg
                className="w-8 h-8 text-emerald-400 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-emerald-400 text-4xl mb-4"
            >
              ✓
            </motion.div>
            <p className="text-xl text-emerald-300 font-medium">Ready to enhance!</p>
            <p className="text-gray-400 mt-2">Redirecting to application...</p>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 text-xs text-gray-500"
      >
        AI-Powered Image Enhancement
      </motion.div>
    </div>
  );
};

export default EndPixPreloader;