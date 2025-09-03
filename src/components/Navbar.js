"use client"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import {
  FaUniversity,
  FaBook,
  FaUserGraduate,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaUser,
  FaUsers,
  FaChartBar,
  FaChartLine
} from "react-icons/fa"
import { useState } from "react"

const Navbar = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
    setIsMenuOpen(false)
  }

  const menuItems = [
    { name: "Courses", to: "/", icon: FaBook, roles: ["student", "admin", "guest"] },
    { name: "My Courses", to: "/my-courses", icon: FaUserGraduate, roles: ["student"] },
    { name: "Students", to: "/admin/students", icon: FaUsers, roles: ["admin"] },
    { name: "Results", to: "/admin/results", icon: FaChartBar, roles: ["admin"] },
    { name: "My Results", to: "/my-results", icon: FaChartLine, roles: ["student"] },
  ]

  const renderLinks = (isMobile = false) =>
    menuItems
      .filter(item => user ? item.roles.includes(user.role) : item.roles.includes("guest"))
      .map(item => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            to={item.to}
            className={`${
              isMobile
                ? "text-white hover:bg-white hover:bg-opacity-20 block px-4 py-3 rounded-2xl text-base font-medium flex items-center transition-all duration-200"
                : "text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200"
            }`}
            onClick={() => isMobile && setIsMenuOpen(false)}
          >
            <Icon className="mr-2 text-lg" />
            {item.name}
          </Link>
        )
      })

  if (loading) {
    return (
      <nav className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center animate-pulse space-x-3">
              <div className="h-8 w-8 bg-white bg-opacity-20 rounded-lg"></div>
              <div className="h-6 w-48 bg-white bg-opacity-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-pink-600 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="h-10 w-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
              <FaUniversity className="text-white text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white hidden sm:block">LMS</span>
              <span className="text-xl font-bold text-white sm:hidden">EP</span>
              <span className="text-xs text-purple-200 hidden sm:block">
                Learning Management System
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {renderLinks()}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 bg-white bg-opacity-10 rounded-2xl px-4 py-2 hover:bg-opacity-20 transition">
                  <div className="h-8 w-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{user.name}</span>
                    <span className="text-xs text-purple-200 capitalize font-medium">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white bg-opacity-10 hover:bg-opacity-25 text-white px-4 py-2 rounded-2xl text-sm font-medium flex items-center transition-all duration-200 border border-white border-opacity-20"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-2xl text-sm font-medium flex items-center transition-all duration-200"
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-pink-600 hover:bg-gray-100 px-6 py-2 rounded-2xl text-sm font-medium flex items-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaUserPlus className="mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden bg-purple-700 bg-opacity-95 border-t border-purple-500 shadow-lg px-4 pt-4 pb-6 space-y-3">{renderLinks(true)}
        {user ? (
          <>
            <div className="px-4 py-4 bg-white bg-opacity-10 rounded-2xl border-t border-purple-500 mt-4 flex items-center space-x-3">
              <div className="h-10 w-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FaUser className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white">{user.name}</span>
                <span className="text-sm text-purple-200 capitalize font-medium">{user.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left text-white hover:bg-white hover:bg-opacity-20 block px-4 py-3 rounded-2xl text-base font-medium flex items-center transition-all duration-200 mt-2"
            >
              <FaSignOutAlt className="mr-3 text-lg" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white hover:bg-white hover:bg-opacity-20 block px-4 py-3 rounded-2xl text-base font-medium flex items-center transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaSignInAlt className="mr-3 text-lg" />
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-pink-600 hover:bg-gray-100 block px-4 py-3 rounded-2xl text-base font-medium flex items-center transition-all duration-200 shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUserPlus className="mr-3 text-lg" />
              Register
            </Link>
          </>
        )}
      </div>}
    </nav>
  )
}

export default Navbar
