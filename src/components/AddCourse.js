"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  FaTimes,
  FaBookOpen,
  FaChalkboard,
  FaUserFriends,
  FaGraduationCap,
  FaAlignLeft,
  FaSave,
} from "react-icons/fa"

const AddCourse = ({ onClose, onCourseAdded }) => {
  const { courseAPI } = useAuth()
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    credits: 3,
    instructor: "",
    capacity: 30,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await courseAPI.createCourse(formData)
      onCourseAdded()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gray-900 text-gray-100 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-t-3xl">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4 shadow-md">
              <FaBookOpen className="text-xl text-yellow-200" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create New Course</h2>
              <p className="text-pink-100 text-sm mt-1">Add a new course to the curriculum</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 p-2 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-all duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/40 border-l-4 border-red-500 p-4 rounded-xl flex items-center text-red-300">
              <svg
                className="w-5 h-5 text-red-400 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <FaBookOpen className="mr-2 text-pink-400" />
                Course Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-gray-100"
                placeholder="e.g., CS101"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <FaGraduationCap className="mr-2 text-purple-400" />
                Credits
              </label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                min="1"
                max="6"
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center">
              <FaBookOpen className="mr-2 text-pink-400" />
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-gray-100"
              placeholder="e.g., Introduction to Computer Science"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center">
              <FaAlignLeft className="mr-2 text-blue-400" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-gray-100 resize-none"
              placeholder="Describe what students will learn in this course..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <FaChalkboard className="mr-2 text-purple-400" />
                Instructor
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-gray-100"
                placeholder="Instructor name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <FaUserFriends className="mr-2 text-blue-400" />
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-gray-100"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCourse
