"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import {
  FaEnvelope,
  FaLock,
  FaUserCircle,
  FaBookReader,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password)
      return setError("Please fill in all fields")

    try {
      setError("")
      setLoading(true)
      await login(formData)
      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
            <FaBookReader className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to access your learning dashboard</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="px-8 py-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/30 border border-red-600 p-4 rounded-2xl shadow-sm flex items-center">
                  <span className="text-sm font-medium text-red-400">{error}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-12 pr-4 py-4 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-white placeholder-gray-500 bg-gray-800"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="block w-full pl-12 pr-12 py-4 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-white placeholder-gray-500 bg-gray-800"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                      ) : (
                        <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-purple-400 hover:text-pink-400 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials Card */}
        <div className="mt-6 bg-gray-900 rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 px-6 py-4 border-b border-gray-700">
            <h3 className="font-semibold text-purple-200 flex items-center text-sm">
              <FaUserCircle className="mr-2" />
              Admin Credentials
            </h3>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-gray-700">
              <div className="flex items-center">
                <FaUserCircle className="mr-3 text-purple-400" />
                <div>
                  <p className="font-medium text-gray-100 text-sm">Admin Account</p>
                  <p className="text-gray-400 text-xs">lmsadmin@gmail.com</p>
                </div>
              </div>
              <span className="text-purple-300 font-mono text-sm bg-gray-700 px-2 py-1 rounded">
                admin123
              </span>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                <strong className="text-purple-300">Student:</strong> Register a new account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
