import { useState, useRef, useEffect } from "react";
import {
  FaUpload,
  FaImage,
  FaMagic,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaInstagram,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../Config/Axios";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedOption, setSelectedOption] = useState("enhance");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showFollowPopup, setShowFollowPopup] = useState(false);
  const [EnchancedImage, setEnchancedImage] = useState("");
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  const options = [
    { id: "enhance", label: "Enhance", icon: <FaMagic /> },
    { id: "style", label: "Style Transfer", icon: <FaImage /> },
    { id: "generate", label: "Generate Elements", icon: <FaImage /> },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    const followTimer = setTimeout(() => {
      setShowFollowPopup(true);
    }, 4500); // Shows after welcome animation

    return () => {
      clearTimeout(timer);
      clearTimeout(followTimer);
    };
  }, []);

  const handleCloseFollowPopup = () => {
    setShowFollowPopup(false);
    // Store in localStorage so it doesn't show again
    localStorage.setItem("followShown", "true");
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowWelcome(false);
  //   }, 4000);
  //   return () => clearTimeout(timer);
  // }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Please select an image file");
      return;
    }

    setSelectedFile(file);
    setError("");
    setGeneratedImage(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // ✅ Upload to backend
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosInstance.post("image/get-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        setEnchancedImage(res.data.image); // Example Test Only ✅
      }
    } catch (error) {
      setError("Upload failed");
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError("Please upload an image first");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedImage(null);

    // Simulate AI generation (replace with actual API call)
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImage(EnchancedImage);
    }, 3000);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setPrompt("");
    setGeneratedImage(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const UserName = localStorage.getItem("name");

  const Navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/users/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        localStorage.clear();
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        if (res.data.status === "success") {
          localStorage.removeItem("token");
        }
        Navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    if (generatedImage && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [generatedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-950 text-gray-100 p-4 md:p-8">
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-90"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-6xl mb-4 text-emerald-400"
              >
                ✨
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 mb-4"
              >
                Hello {UserName}!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-xl text-gray-300"
              >
                Ready to transform your images with{" "}
                <span className="text-emerald-400">Harsh's</span> AI magic?
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 1.5 }}
                className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mt-6 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Follow on Instagram Popup */}
      <AnimatePresence>
        {showFollowPopup && !localStorage.getItem("followShown") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-gray-800/30 backdrop-blur flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-800 border-2 border-emerald-500 rounded-xl p-6 shadow-2xl max-w-md w-full"
            >
              {/* Close (X) button */}
              <button
                onClick={handleCloseFollowPopup}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <FaTimes className="text-xl" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4 pt-2">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-emerald-400 text-4xl"
                >
                  <FaInstagram />
                </motion.div>

                <div>
                  <h3 className="font-bold text-2xl text-emerald-300 mb-2">
                    Follow me on Instagram
                  </h3>
                  <p className="text-gray-300">
                    For more amazing AI tools and updates!
                  </p>
                </div>

                <div className="flex space-x-4 mt-4">
                  <a
                    href="https://www.instagram.com/201harshs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseFollowPopup}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Follow Now
                  </a>
                  <button
                    onClick={handleCloseFollowPopup}
                    className="px-6 py-2 bg-gray-700 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>

              <motion.div
                className="absolute -z-10 inset-0 bg-emerald-500 rounded-xl blur-lg opacity-20"
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
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
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm md:text-base"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showWelcome ? 1.5 : 0 }}
          className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-emerald-300">
            Upload Your Image
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Upload Area */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`flex-1 border-2 border-dashed ${
                error && !selectedFile ? "border-red-500" : "border-gray-600"
              } rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors`}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <FaUpload className="text-4xl text-emerald-400 mb-4" />
              </motion.div>
              <p className="text-center text-gray-300 mb-2">
                {selectedFile
                  ? "Your Image: " + selectedFile.name.slice(0, 30)
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 10MB</p>
            </motion.div>

            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center">
              {previewUrl ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden"
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain bg-gray-900"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 p-2 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                  }}
                  className="w-full h-64 md:h-80 bg-gray-900 rounded-xl flex items-center justify-center"
                >
                  <FaImage className="text-4xl text-gray-600" />
                </motion.div>
              )}
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}
        </motion.section>

        {/* Options Section */}
        {selectedFile && !error && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-emerald-300">
              Transformation Options
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOption(option.id)}
                  className={`flex items-center space-x-3 p-4 rounded-lg border ${
                    selectedOption === option.id
                      ? "border-emerald-400 bg-emerald-900 bg-opacity-30"
                      : "border-gray-600 hover:border-emerald-300"
                  }`}
                >
                  <span className="text-emerald-400">{option.icon}</span>
                  <span>{option.label}</span>
                </motion.button>
              ))}
            </div>

            {(selectedOption === "style" || selectedOption === "generate") && (
              <div className="mb-6">
                {selectedOption === "style" ? (
                  <>
                    <label className="block text-gray-300 mb-2">
                      Select Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "hyperrealistic", label: "Hyper-Realistic" },
                        { id: "anime", label: "Anime" },
                        { id: "cyberpunk", label: "Neon Cyberpunk" },
                        { id: "oilpaint", label: "Oil Painting" },
                      ].map((style) => (
                        <motion.button
                          key={style.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPrompt(style.label)}
                          className={`p-3 rounded-lg border ${
                            prompt === style.label
                              ? "border-emerald-400 bg-emerald-900 bg-opacity-30"
                              : "border-gray-600 hover:border-emerald-300"
                          }`}
                        >
                          {style.label}
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block text-gray-300 mb-2">
                      AI Prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder='Describe what to add (e.g., "futuristic city in background")'
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      rows={3}
                    />
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg font-medium shadow-lg hover:shadow-emerald-500/30 flex items-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaMagic />
                    <span>Generate</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.section>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {(isGenerating || generatedImage) && (
            <motion.section
              ref={resultsRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 overflow-hidden"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-4 text-emerald-300">
                {isGenerating ? "Generating..." : "Your AI Transformation"}
              </h2>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity },
                    }}
                  >
                    <FaSpinner className="text-5xl text-emerald-400 mb-4" />
                  </motion.div>
                  <p className="text-gray-300">
                    Our AI is working its magic...
                  </p>
                  <motion.div
                    className="w-full bg-gray-700 rounded-full h-2.5 mt-6"
                    initial={{ width: 0 }}
                    animate={{ width: ["0%", "30%", "70%", "90%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-2.5 rounded-full"></div>
                  </motion.div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-300">
                      Original
                    </h3>
                    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-gray-900">
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-emerald-300">
                      Transformed
                    </h3>
                    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-gray-900">
                      <img
                        src={generatedImage}
                        alt="AI Generated"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-300 text-sm">
                            AI Generated
                          </span>
                          <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
