import React, { useState, useRef, useEffect } from "react";
import {
  FaUpload,
  FaImage,
  FaTimes,
  FaCheck,
  FaInstagram,
  FaSignOutAlt,
  FaCloudUploadAlt,
  FaSpinner,
  FaMagic,
  FaDownload,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../Config/Axios";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showFollowPopup, setShowFollowPopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [EnhancedImage, setEnhancedImage] = useState("");
  const [formData, setFormData] = useState({
    style: "original",
    prompt: "",
    upscaling: "2x",
  });
  const fileInputRef = useRef(null);

  const UserName = localStorage.getItem("name") || "User";

  const Navigate = useNavigate();

  const styleOptions = [
    { value: "original", label: "Original" },
    { value: "hyperrealistic", label: "Hyperrealistic" },
    { value: "anime", label: "Anime" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "oil_painting", label: "Oil Painting" },
    { value: "watercolor", label: "Watercolor" },
    { value: "pixel_art", label: "Pixel Art" },
  ];

  const upscalingOptions = [
    { value: "1x", label: "1x (Original)" },
    { value: "2x", label: "2x" },
    { value: "4x", label: "4x" },
    { value: "8x", label: "8x (Ultra HD)" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    const followTimer = setTimeout(() => {
      setShowFollowPopup(true);
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(followTimer);
    };
  }, []);

  const handleCloseFollowPopup = () => {
    setShowFollowPopup(false);
    localStorage.setItem("followShown", "true");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setError("");
    setShowResults(false); // Hide results when new file is selected

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axiosInstance.post("image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });

        console.log("Upload response:", response.data);
        setShowStyleModal(true);
        setEnhancedImage(response.data.image);
      }
    } catch (error) {
      setError("Failed to upload image");
      toast.error("Failed to upload image", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setShowResults(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("users/logout");

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
        Navigate("/");
      }
    } catch (error) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStyleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.style) {
      toast.error("Please select a style", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    if (!formData.prompt) {
      toast.error("Please enter a transformation prompt", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    setShowStyleModal(false);
    setIsProcessing(true);

    try {
      // Simulate API processing delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // In a real app, you would make an API call here
      // const response = await axiosInstance.post("image/transform", {
      //   imageUrl: previewUrl,
      //   ...formData
      // });
      // setProcessedImage(response.data.processedImageUrl);

      // For demo purposes, we'll just use the original image
      setProcessedImage(EnhancedImage);
      setShowResults(true);

      toast.success("Image processed successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      toast.error("Failed to process image", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      console.error("Processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `enhanced-by-endpixAI-${selectedFile.name}-LoveBy💞-Harsh.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

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
                Ready to upload your images?
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

      {/* Instagram Follow Popup */}
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
              <button
                onClick={handleCloseFollowPopup}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4 pt-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-emerald-400 text-4xl"
                >
                  <FaInstagram />
                </motion.div>

                <div>
                  <h3 className="font-bold text-2xl text-emerald-300 mb-2">
                    Follow me on Instagram
                  </h3>
                  <p className="text-gray-300">
                    For more amazing tools and updates!
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
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style Transfer Modal */}
      <AnimatePresence>
        {showStyleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-auto border-2 border-emerald-500/50 shadow-xl"
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 opacity-30"></div>
              </div>

              <button
                onClick={() => setShowStyleModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <FaTimes className="text-xl" />
              </button>

              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-full bg-emerald-900/50 text-emerald-400 mr-3">
                    <FaMagic className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-teal-300">
                    Style Transformation
                  </h2>
                </div>

                <form onSubmit={handleStyleSubmit} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-gray-300 font-medium">
                        Select Style <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-emerald-400">Required</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {styleOptions.map((option) => (
                        <div key={option.value} className="relative">
                          <input
                            type="radio"
                            name="style"
                            id={`style-${option.value}`}
                            value={option.value}
                            checked={formData.style === option.value}
                            onChange={handleInputChange}
                            className="absolute opacity-0 h-0 w-0"
                            required
                          />
                          <label
                            htmlFor={`style-${option.value}`}
                            className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                              formData.style === option.value
                                ? "border-emerald-400 bg-emerald-900/30 shadow-lg shadow-emerald-500/10"
                                : "border-gray-700 hover:border-emerald-300 bg-gray-700/50"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`mr-2 w-4 h-4 rounded-full border flex items-center justify-center ${
                                  formData.style === option.value
                                    ? "border-emerald-400 bg-emerald-400"
                                    : "border-gray-500"
                                }`}
                              >
                                {formData.style === option.value && (
                                  <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                                )}
                              </div>
                              <span className="text-sm">{option.label}</span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-gray-300 font-medium">
                        Transformation Prompt{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-emerald-400">Required</span>
                    </div>
                    <div className="relative">
                      <textarea
                        name="prompt"
                        value={formData.prompt}
                        onChange={handleInputChange}
                        placeholder="Describe exactly how you want to transform your image (e.g., 'make the background futuristic with neon lights')"
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500 resize-none"
                        rows={3}
                        required
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                        {formData.prompt.length}/200
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-gray-300 font-medium">
                        Image Quality <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-emerald-400">Required</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {upscalingOptions.map((option) => (
                        <div key={option.value} className="relative">
                          <input
                            type="radio"
                            name="upscaling"
                            id={`upscale-${option.value}`}
                            value={option.value}
                            checked={formData.upscaling === option.value}
                            onChange={handleInputChange}
                            className="absolute opacity-0 h-0 w-0"
                            required
                          />
                          <label
                            htmlFor={`upscale-${option.value}`}
                            className={`block p-3 rounded-lg border cursor-pointer transition-all text-center ${
                              formData.upscaling === option.value
                                ? "border-emerald-400 bg-emerald-900/30 shadow-lg shadow-emerald-500/10"
                                : "border-gray-700 hover:border-emerald-300 bg-gray-700/50"
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-medium">
                                {option.label}
                              </span>
                              {option.value !== "1x" && (
                                <span className="text-xs text-emerald-400 mt-1">
                                  {option.value.replace("x", "")}× resolution
                                </span>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!formData.style || !formData.prompt}
                      className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg ${
                        !formData.style || !formData.prompt
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 transition-opacity"
                      }`}
                    >
                      <FaMagic />
                      <span>Apply Transformations</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaUpload className="text-2xl md:text-3xl text-emerald-400" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
              EndPix NextGen
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm md:text-base flex items-center gap-2 transition-colors"
          >
            <FaSignOutAlt />
            Sign Out
          </motion.button>
        </header>

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
            <motion.div
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
              <div className="text-4xl text-emerald-400 mb-4">
                {selectedFile ? <FaCheck /> : <FaUpload />}
              </div>
              <p className="text-center text-gray-300 mb-2">
                {selectedFile
                  ? selectedFile.name.length > 30
                    ? selectedFile.name.substring(0, 30) + "..."
                    : selectedFile.name
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 10MB</p>
            </motion.div>

            <div className="flex-1 flex items-center justify-center min-h-[200px]">
              {previewUrl ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-900"
                >
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-gray-900 bg-opacity-80 p-2 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </motion.div>
              ) : (
                <div className="w-full h-64 bg-gray-900 rounded-xl flex flex-col items-center justify-center">
                  <FaImage className="text-4xl text-gray-600 mb-2" />
                  <p className="text-gray-500">
                    Image preview will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex justify-center"
            >
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  isUploading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500"
                } transition-colors`}
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt />
                    Edit Photo with AI
                  </>
                )}
              </button>
            </motion.div>
          )}

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-red-400 text-sm flex items-center"
              >
                <FaTimes className="mr-2" /> {error}
              </motion.p>
            )}
          </AnimatePresence>

          {selectedFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-emerald-400 text-sm flex items-center"
            >
            <FaCheck className="mr-2" /> Image selected (
  {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
            </motion.div>
          )}
        </motion.section>

        {/* Results Section */}
        <AnimatePresence>
          {(showResults || isProcessing) && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-700 overflow-hidden"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-6 text-emerald-300">
                Transformation Results
              </h2>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="text-4xl text-emerald-400 mb-4"
                  >
                    <FaSpinner />
                  </motion.div>
                  <p className="text-gray-300 mb-2">Processing your image...</p>
                  <p className="text-sm text-gray-400">
                    Applying {formData.style} style and {formData.upscaling}{" "}
                    upscaling
                  </p>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mt-6 rounded-full"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-900 rounded-xl p-4">
                      <h3 className="text-lg font-medium text-gray-300 mb-3">
                        Original Image
                      </h3>
                      <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                        <img
                          src={previewUrl}
                          alt="Original"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        <p>
                          Style:{" "}
                          <span className="text-emerald-400">
                            {styleOptions.find(
                              (s) => s.value === formData.style
                            )?.label || "Original"}
                          </span>
                        </p>
                        <p>
                          Prompt:{" "}
                          <span className="text-gray-300">
                            {formData.prompt}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-4">
                      <h3 className="text-lg font-medium text-gray-300 mb-3">
                        Enhanced Image
                      </h3>
                      <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                        {processedImage ? (
                          <img
                            src={processedImage}
                            alt="Processed"
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="text-gray-500 flex flex-col items-center">
                            <FaImage className="text-4xl mb-2" />
                            <p>Processing complete</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        <p>
                          Upscaling:{" "}
                          <span className="text-emerald-400">
                            {formData.upscaling}
                          </span>
                        </p>
                        <p>
                          Status:{" "}
                          <span className="text-emerald-400">Completed</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaDownload />
                      Download Result
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowResults(false);
                        setShowStyleModal(true);
                      }}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaMagic />
                      Try Different Style
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaTimes />
                      Start Over
                    </motion.button>
                  </div>
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
