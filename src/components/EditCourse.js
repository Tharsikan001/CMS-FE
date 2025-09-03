"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { FaTimes, FaBook, FaChalkboardTeacher, FaUsers, FaGraduationCap, FaAlignLeft, FaSave, FaCalendar, FaMapMarkerAlt } from "react-icons/fa"

const EditCourse = ({ course, onClose, onCourseUpdated }) => {
  const { courseAPI } = useAuth()
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    credits: 3,
    instructor: "",
    capacity: 30,
    schedule: "",
    location: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code || "",
        title: course.title || "",
        description: course.description || "",
        credits: course.credits || 3,
        instructor: course.instructor || "",
        capacity: course.capacity || 30,
        schedule: course.schedule || "",
        location: course.location || ""
      })
    }
  }, [course])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await courseAPI.updateCourse(course._id, formData)
      onCourseUpdated()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <FaBook className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Edit Course</h2>
              <p className="text-pink-100 text-sm">Update course information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center animate-pulse">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Course Code & Credits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              icon={<FaBook className="text-purple-500" />}
              label="Course Code *"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
            <InputField
              icon={<FaGraduationCap className="text-purple-500" />}
              label="Credits"
              name="credits"
              type="number"
              min="1"
              max="6"
              value={formData.credits}
              onChange={handleChange}
            />
          </div>

          {/* Title */}
          <InputField
            icon={<FaBook className="text-purple-500" />}
            label="Course Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* Description */}
          <TextAreaField
            icon={<FaAlignLeft className="text-purple-500" />}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* Instructor & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              icon={<FaChalkboardTeacher className="text-purple-500" />}
              label="Instructor *"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
            />
            <InputField
              icon={<FaUsers className="text-purple-500" />}
              label="Capacity"
              name="capacity"
              type="number"
              min="1"
              max="100"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>

          {/* Schedule & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              icon={<FaCalendar className="text-purple-500" />}
              label="Schedule"
              name="schedule"
              placeholder="e.g., Mon/Wed/Fri 10:00-11:30"
              value={formData.schedule}
              onChange={handleChange}
            />
            <InputField
              icon={<FaMapMarkerAlt className="text-purple-500" />}
              label="Location"
              name="location"
              placeholder="e.g., Room 301, Science Building"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:from-purple-700 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white rounded-full"></span>
                  <span>Updating...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <FaSave />
                  <span>Update Course</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reusable Input Field
const InputField = ({ icon, label, ...props }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
      {icon} <span>{label}</span>
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
    />
  </div>
)

// Reusable TextArea Field
const TextAreaField = ({ icon, label, ...props }) => (
  <div className="group">
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
      {icon} <span>{label}</span>
    </label>
    <textarea
      {...props}
      rows={3}
      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
    />
  </div>
)

export default EditCourse
