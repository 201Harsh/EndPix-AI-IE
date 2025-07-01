import { useState } from 'react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Add your login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-emerald-950 text-gray-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700"
      >
        <div className="flex items-center mb-8">
          <Link to="/" className="text-emerald-400 hover:text-emerald-300 mr-4">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            Welcome Back
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-emerald-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg font-bold shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            Login
          </motion.button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline font-medium">
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;