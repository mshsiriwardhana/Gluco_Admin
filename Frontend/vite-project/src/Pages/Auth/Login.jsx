import React, { useState } from "react";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../../../../Backend/Auth/auth";
import { useAuth } from "../../Context/authContext/context";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (userLoggedIn) {
    return <Navigate to="/AdminDashboard" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage(""); // Clear previous errors
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage(""); // Clear previous errors
      try {
        await doSignInWithGoogle();
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800 to-teal-500">
        {/* Pulsing Light Animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-teal-400 rounded-full opacity-20 animate-pulse-slow"></div>
          <div className="absolute w-64 h-64 bg-teal-300 rounded-full opacity-10 animate-ping-slow"></div>
        </div>
        {/* Dot Pattern Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        <div className="backdrop-blur-sm bg-slate-900/40 rounded-lg shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 relative">
              <img
                src="/src/assets/new-medical-support.gif"
                alt="Admin Logo"
                className="h-20 w-20 mr-2"
              />
              <div className="absolute inset-0 animate-pulse-glow opacity-50"></div>
            </div>
          </div>

          {/* Branding */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-teal-100 tracking-wider uppercase">
              GlucoAid-Admin
            </h2>
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm text-center mb-4">
              {errorMessage}
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 pl-10 pr-3 bg-slate-800/50 border border-slate-600/30 rounded text-teal-100 placeholder-teal-300/50 focus:outline-none focus:ring-1 focus:ring-teal-400"
                placeholder="Enter User Name"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 pl-10 pr-3 bg-slate-800/50 border border-slate-600/30 rounded text-teal-100 placeholder-teal-300/50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Enter Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className={`w-full px-4 py-2 text-white font-medium rounded ${
                isSigningIn
                  ? "bg-slate-800/50 cursor-not-allowed"
                  : "bg-teal-500/80 hover:bg-teal-400/80 transition duration-300"
              }`}
            >
              {isSigningIn ? "SIGNING IN..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
