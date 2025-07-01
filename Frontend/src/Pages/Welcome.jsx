import { useState, useEffect } from 'react';
import { FaMagic, FaImage, FaUpload, FaArrowRight, FaSlidersH, FaPalette, FaHistory, FaBars, FaTimes } from 'react-icons/fa';
import { HiSparkles } from "react-icons/hi";
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import actual image assets
import originalPortrait from '../assets/original-portrait.jpg';
import enhancedPortrait from '../assets/enhanced-portrait.jpg';
import cyberpunkOriginal from '../assets/cyberpunk-original.jpg';
import cyberpunkTransformed from '../assets/cyberpunk-transformed.jpg';
import emptyBackground from '../assets/empty-background.jpg';
import cityscapeAdded from '../assets/cityscape-added.jpg';
import inputExample from '../assets/input-example.jpg';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('enhance');
  const [sliderValue, setSliderValue] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const aiTransformations = [
    {
      original: originalPortrait,
      transformed: enhancedPortrait,
      prompt: "Enhance colors and details"
    },
    {
      original: cyberpunkOriginal,
      transformed: cyberpunkTransformed,
      prompt: "Apply cyberpunk neon style"
    },
    {
      original: emptyBackground,
      transformed: cityscapeAdded,
      prompt: "Add futuristic cityscape background"
    }
  ];

  const features = [
    {
      icon: <FaMagic className="text-3xl" />,
      title: 'AI-Powered Enhancements',
      desc: 'Our neural networks analyze and improve every pixel for stunning results'
    },
    {
      icon: <FaPalette className="text-3xl" />,
      title: 'Style Transformation',
      desc: 'Turn photos into artworks with hundreds of artistic styles'
    },
    {
      icon: <HiSparkles className="text-3xl" />,
      title: 'Element Generation',
      desc: 'Add objects, backgrounds, or effects with simple text prompts'
    },
    {
      icon: <FaSlidersH className="text-3xl" />,
      title: 'Precision Controls',
      desc: 'Fine-tune every aspect of the AI processing'
    },
    {
      icon: <FaHistory className="text-3xl" />,
      title: 'Version History',
      desc: 'Track all your edits and revert to any previous version'
    },
    {
      icon: <FaUpload className="text-3xl" />,
      title: 'Batch Processing',
      desc: 'Apply edits to multiple images simultaneously'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-950 text-gray-100 overflow-x-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            <button className="absolute top-6 right-6 text-2xl text-emerald-400">
              <FaTimes />
            </button>
            <nav className="flex flex-col items-center space-y-6 text-xl">
              <a href="#" className="text-emerald-300 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-emerald-300 hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-emerald-300 hover:text-white transition-colors">Examples</a>
              <a href="#" className="text-emerald-300 hover:text-white transition-colors">About</a>
              <Link to="/register" className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full font-medium shadow-lg">
                Sign In
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Particles */}
      <div className="fixed inset-0 overflow-hidden opacity-10 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400"
            style={{
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Header - Responsive */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8 md:mb-16"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaMagic className="text-2xl md:text-3xl text-emerald-400" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              EndPix NextGen
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-emerald-300 hover:text-white transition-colors"
            >
              Features
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-emerald-300 hover:text-white transition-colors"
            >
              Pricing
            </motion.button>
            <Link 
              to="/register"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full font-medium shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Sign In
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl text-emerald-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars />
          </button>
        </motion.header>

        {/* Hero Section */}
        <main>
          <section className="flex flex-col items-center text-center mt-8 md:mt-12 mb-12 md:mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7 }}
              className="mb-8 md:mb-12 w-full"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-6 md:mb-8"
              >
                <FaImage className="text-5xl md:text-7xl mx-auto text-emerald-400" />
              </motion.div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Redefine Your Images with{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 block md:inline">
                  Next-Gen AI
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 md:mb-8 px-4">
                EndPix NextGen combines cutting-edge artificial intelligence with intuitive controls to transform your photos beyond imagination.
              </p>
              <Link
                to="/register"
                className="px-6 md:w-72 w-56 py-3 md:px-8 md:py-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-emerald-500/40 flex items-center justify-between space-x-3 mx-auto"
              >
                <span>Start Creating Now</span>
                <FaArrowRight />
              </Link>
            </motion.div>

            {/* AI Showcase Section */}
            <div className="w-full max-w-6xl bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl md:rounded-2xl p-1 border border-gray-700 mt-8 md:mt-16">
              <div className="flex overflow-x-auto no-scrollbar space-x-2 mb-4 md:mb-6 border-b border-gray-700">
                {['enhance', 'transform', 'generate'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 md:px-6 md:py-3 whitespace-nowrap rounded-t-lg font-medium transition-colors ${
                      activeTab === tab ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 md:p-6"
                >
                  {activeTab === 'enhance' && (
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-emerald-300">AI Photo Enhancement</h3>
                      <p className="text-gray-300 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
                        Our AI analyzes your image to automatically improve lighting, colors, sharpness, and details while preserving natural look.
                      </p>
                      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-900 rounded-lg md:rounded-xl overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img 
                            src={originalPortrait} 
                            alt="Original" 
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ opacity: 1 - sliderValue / 100 }}
                          />
                          <img 
                            src={enhancedPortrait} 
                            alt="Enhanced" 
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ opacity: sliderValue / 100 }}
                          />
                        </div>
                        <div className="absolute bottom-4 md:bottom-6 left-0 right-0 px-4 md:px-6">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderValue}
                            onChange={(e) => setSliderValue(e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex bg-gray-900/70 justify-between text-xs md:text-sm text-gray-200 mt-1 md:mt-2">
                            <span>Original</span>
                            <span>AI Enhanced</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'transform' && (
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-emerald-300">Style Transformation</h3>
                      <p className="text-gray-300 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
                        Apply artistic styles to your photos or completely change the mood and atmosphere with AI.
                      </p>
                      <Swiper
                        grabCursor={true}
                        effect={'creative'}
                        creativeEffect={{
                          prev: {
                            shadow: true,
                            translate: [0, 0, -400],
                          },
                          next: {
                            translate: ['100%', 0, 0],
                          },
                        }}
                        navigation={true}
                        modules={[EffectCreative, Pagination, Navigation]}
                        className="mySwiper h-64 sm:h-80 md:h-96 w-full rounded-lg md:rounded-xl"
                      >
                        {aiTransformations.map((item, index) => (
                          <SwiperSlide key={index} className="bg-gray-900 rounded-lg md:rounded-xl overflow-hidden">
                            <div className="relative h-full w-full">
                              <div className="absolute inset-0 flex flex-col sm:flex-row">
                                <div className="w-full sm:w-1/2 h-1/2 sm:h-full border-b sm:border-b-0 sm:border-r border-gray-700">
                                  <img 
                                    src={item.original} 
                                    alt="Original" 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 md:p-3">
                                    <p className="text-xs md:text-sm text-gray-300">Original Image</p>
                                  </div>
                                </div>
                                <div className="w-full sm:w-1/2 h-1/2 sm:h-full">
                                  <img 
                                    src={item.transformed} 
                                    alt="Transformed" 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-emerald-900 bg-opacity-70 p-2 md:p-3">
                                    <p className="text-xs md:text-sm font-medium">AI Transformation</p>
                                    <p className="text-xs text-emerald-200">Prompt: "{item.prompt}"</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}

                  {activeTab === 'generate' && (
                    <div>
                      <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-emerald-300">AI Generation</h3>
                      <p className="text-gray-300 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
                        Describe what you want to add or change, and our AI will generate it seamlessly into your image.
                      </p>
                      <div className="bg-gray-900 rounded-lg md:rounded-xl p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                              <h4 className="text-emerald-300 mb-1 md:mb-2 text-sm md:text-base">Prompt Example:</h4>
                              <p className="text-gray-200 italic text-xs md:text-sm">
                                "Add a futuristic cyberpunk city in the background with neon lights, and make the subject wear a high-tech visor"
                              </p>
                            </div>
                            <div className="relative h-48 md:h-64 bg-gray-800 rounded-lg overflow-hidden">
                              <img 
                                src={inputExample} 
                                alt="Input" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-1 md:p-2">
                                <p className="text-xs md:text-sm text-center text-gray-300">Original Photo</p>
                              </div>
                            </div>
                          </div>
                          <div className="relative h-48 md:h-auto bg-gradient-to-br from-gray-800 to-emerald-900 rounded-lg overflow-hidden flex items-center justify-center">
                            <div className="text-center p-4 md:p-6">
                              <HiSparkles className="text-3xl md:text-4xl text-emerald-400 mx-auto mb-3 md:mb-4" />
                              <h4 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-emerald-300">AI Generated Result</h4>
                              <p className="text-gray-300 text-xs md:text-sm">
                                The AI analyzes your prompt and generates new elements that blend perfectly with your original image.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-center mb-12 md:mb-16 px-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Powerful AI Editing Tools</h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                EndPix NextGen provides everything you need to transform your images with AI
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={loaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-5 md:p-6 border border-gray-700 hover:border-emerald-500 transition-all"
                >
                  <div className="text-emerald-400 mb-3 md:mb-4">{feature.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-20 px-4">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-xl md:rounded-2xl p-6 md:p-12 text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <FaMagic className="text-4xl md:text-5xl mx-auto text-emerald-300 mb-4 md:mb-6" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Ready to Transform Your Images?</h2>
              <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-6 md:mb-8">
                Join thousands of creators who are already using EndPix NextGen to bring their visions to life.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 md:px-8 md:py-4 bg-white text-emerald-900 rounded-full font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started - It's Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-emerald-900 transition-all"
                >
                  See Examples
                </motion.button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gray-900 bg-opacity-80 backdrop-blur-lg py-8 md:py-12"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-3 md:mb-4">
                <FaMagic className="text-xl text-emerald-400" />
                <span className="text-xl font-bold">EndPix NextGen</span>
              </div>
              <p className="text-gray-400 text-sm md:text-base">
                The next generation of AI-powered image editing for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-emerald-300">Product</h4>
              <ul className="space-y-1 md:space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Examples</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-emerald-300">Resources</h4>
              <ul className="space-y-1 md:space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-emerald-300">Company</h4>
              <ul className="space-y-1 md:space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-gray-500 text-sm md:text-base">
            <p>© {new Date().getFullYear()} EndPix NextGen. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Welcome;