"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { 
  FaBookOpen, 
  FaUserTie, 
  FaUniversity, 
  FaRegSmileBeam, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaMedal 
} from "react-icons/fa"

// Reusable Stats Card
const StatsCard = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-700">
    {icon}
    <span>{label}: {value}</span>
  </div>
)

// Empty state component
const EmptyState = () => (
  <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-200">
    <div className="h-20 w-20 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
      <FaRegSmileBeam className="text-purple-600 text-2xl" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">No enrolled courses yet</h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      Start your learning adventure today by browsing our course catalog.
    </p>
    <a
      href="/"
      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 inline-flex items-center shadow-md"
    >
      <FaBookOpen className="mr-2" /> Browse Courses
    </a>
  </div>
)

// Single Course Card
const CourseCard = ({ course }) => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-3 space-x-2">
            <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{course.code}</span>
            <span className="inline-block bg-gradient-to-r from-green-100 to-teal-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Enrolled</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">{course.title}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <FaUserTie className="mr-2 text-purple-500" />
            <span className="font-medium line-clamp-1">{course.instructor}</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-3 text-center min-w-[70px]">
          <div className="text-2xl font-bold text-purple-600">{course.credits}</div>
          <div className="text-xs text-gray-500 font-medium">Credits</div>
        </div>
      </div>

      {/* Schedule & Location */}
      {(course.schedule || course.location) && (
        <div className="mb-4 space-y-2">
          {course.schedule && (
            <div className="flex items-center text-sm text-gray-600">
              <FaCalendarAlt className="mr-3 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-1">{course.schedule}</span>
            </div>
          )}
          {course.location && (
            <div className="flex items-center text-sm text-gray-600">
              <FaMapMarkerAlt className="mr-3 text-gray-400 flex-shrink-0" />
              <span className="line-clamp-1">{course.location}</span>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {course.description && (
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{course.description}</p>
      )}

      {/* Enrollment Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 px-4 py-3 rounded-2xl flex items-center justify-center border border-purple-200">
        <FaUniversity className="mr-2 text-purple-500" />
        <span className="text-sm font-semibold">Successfully Enrolled</span>
      </div>
    </div>
  </div>
)

const EnrollmentList = () => {
  const { enrollmentAPI } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const data = await enrollmentAPI.getMyCourses()
        setCourses(data)
        setError("")
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [enrollmentAPI])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="h-14 w-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-md">
                <FaUniversity className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Enrolled Courses</h1>
                <p className="text-gray-600 text-lg">Track and manage your learning journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <StatsCard icon={<FaBookOpen className="text-pink-500" />} label="Courses Enrolled" value={courses.length} />
              <StatsCard icon={<FaMedal className="text-purple-500" />} label="Total Credits" value={courses.reduce((total, c) => total + (c.credits || 0), 0)} />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center animate-pulse">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Courses or Empty */}
        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrollmentList
