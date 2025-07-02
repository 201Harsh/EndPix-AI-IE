import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import axiosInstance from "../Config/Axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Allowed email domains
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "protonmail.com",
    "aol.com",
    "mail.com",
    "zoho.com",
    "yandex.com"
  ];

  // Comprehensive list of temporary email domains and patterns to block
  const blockedEmailPatterns = [
    // Exact domains
    "tempmail.com", "mailinator.com", "10minutemail.com",
    "guerrillamail.com", "yopmail.com", "trashmail.com",
    "fakeinbox.com", "throwawaymail.com", "temp-mail.org",
    "maildrop.cc", "getnada.com", "dispostable.com",
    "mailnesia.com", "mytemp.email", "sharklasers.com",
    "mail.tm", "tempail.com", "emailondeck.com",
    "tempinbox.com", "mailmoat.com", "temp-mail.io",
    "mailbox.in.ua", "inboxbear.com", "tmpmail.org",
    "temp-mail.net", "throwawayemail.com", "mailcatch.com",
    "tempemail.net", "mailmetrash.com", "trashmailer.com",
    "mailnull.com", "ofacer.com", "tempmail.pro",
    
    // Common patterns for disposable emails
    /^[a-z0-9]+@(temp|trash|fake|throwaway|disposable)/i,
    /^[a-z0-9]+@(mailinator|yopmail|guerrillamail)/i,
    /^[a-z0-9]+@[a-z0-9]+\.(xyz|top|club|site|online)/i,
    /^[a-z0-9]+@[a-z0-9]+\.(tk|ml|ga|cf|gq)/i,
    /^[a-z0-9]+@[a-z0-9]+\.(test|example|demo)/i
  ];

  const validateEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
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
      return false;
    }

    // Extract domain
    const domain = email.split("@")[1].toLowerCase();

    // Check if domain is in allowed list
    const isAllowed = allowedDomains.includes(domain);
    if (!isAllowed) {
      toast.error("Only emails from Gmail, Yahoo, Outlook and other popular providers are allowed", {
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
      return false;
    }

    // Check against blocked email patterns
    const fullEmail = email.toLowerCase();
    const isBlocked = blockedEmailPatterns.some(pattern => {
      if (typeof pattern === 'string') {
        return domain === pattern || domain.endsWith(`.${pattern}`);
      } else if (pattern instanceof RegExp) {
        return pattern.test(fullEmail);
      }
      return false;
    });

    if (isBlocked) {
      toast.error("Disposable email addresses are not allowed", {
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
      return false;
    }

    return true;
  };

  const handleEmailBlur = () => {
    if (formData.email) {
      validateEmail(formData.email);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!formData.name || formData.name.length < 3) {
      toast.error("Please enter a valid name (min 3 characters)", {
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
      return;
    }

    if (!validateEmail(formData.email)) {
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
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
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/users/register", formData);

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("email", formData.email);
        localStorage.setItem("name", formData.name);
        toast.success("Registration successful! Please verify your email.", {
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
        navigate("/otp-verify");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(errorMessage, {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-950 text-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-lg"
      >
        <div className="flex items-center mb-8">
          <Link to="/" className="text-emerald-400 hover:text-emerald-300 mr-4">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                minLength={3}
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 8 characters)"
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-300">
                I agree to the{" "}
                <a className="text-emerald-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a  className="text-emerald-400 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg font-bold shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center ${
              isLoading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Registering...
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;