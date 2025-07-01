import { useState, useRef, useEffect } from 'react';
import { FaLock, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto focus next input if a digit was entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // If last digit was entered, verify
    if (index === 3 && value) {
      handleVerify();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{4}$/.test(pasteData)) {
      const pasteOtp = pasteData.split('');
      setOtp(pasteOtp);
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerify = () => {
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const isValid = otp.join('') === '1234'; // Demo valid OTP
      if (isValid) {
        setIsVerified(true);
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
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
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 mr-4">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
            OTP Verification
          </h2>
        </div>

        {isVerified ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verification Successful!</h3>
            <p className="text-gray-300 mb-6">Your account has been verified.</p>
            <Link 
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg font-medium inline-block"
            >
              Continue to Dashboard
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-900 bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-2xl text-emerald-400" />
              </div>
              <p className="text-gray-300 mb-2">Enter the 4-digit code sent to your email</p>
              <p className="text-sm text-emerald-400">example@email.com</p>
            </div>

            <div className="flex justify-center space-x-3 mb-6">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-16 h-16 text-2xl text-center bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={isLoading}
                  whileFocus={{ scale: 1.05 }}
                />
              ))}
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-red-400 mb-4"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerify}
              disabled={otp.some(digit => !digit) || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg font-bold shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </motion.button>

            <div className="mt-6 text-center text-sm text-gray-400">
              Didn't receive code?{' '}
              <button className="text-emerald-400 hover:underline font-medium">
                Resend
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default OtpVerification;