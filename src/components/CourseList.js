"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import AddCourse from "./AddCourse"
import EditCourse from "./EditCourse"
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaUserMinus,
  FaSignInAlt,
  FaBook,
  FaChalkboardTeacher,
  FaUsers,
  FaGraduationCap,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa"

// Reusable Alert Component
const Alert = ({ type = "success", message }) => {
  const colors = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
  }
  const Icon = type === "success" ? FaUserPlus : FaTrash
  return (
    <div className={`${colors[type]} px-6 py-4 rounded-2xl mb-6 flex items-center animate-pulse shadow-sm`}>
      <Icon className="mr-3" />
      <span className="font-medium">{message}</span>
    </div>
  )
}

// Reusable Action Button
const ActionButton = ({ onClick, children, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-3xl font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
  >
    {children}
  </button>
)

// Course Card Component
const CourseCard = ({
  course,
  user,
  enrolling,
  isEnrolled,
  handleEdit,
  handleDelete,
  handleEnroll,
  handleUnenroll,
}) => {
  const getEnrollmentPercentage = () => {
    const enrolled = course.enrollmentCount || 0
    const capacity = course.capacity || 30
    return Math.min(100, Math.round((enrolled / capacity) * 100))
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] group">
      <div className="p-6 pb-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <span className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">{course.code}</span>
              {isEnrolled && (
                <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  Enrolled
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
              {course.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <FaChalkboardTeacher className="mr-2 text-pink-500" />
              <span className="font-medium">{course.instructor}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-3 text-center min-w-[70px]">
            <div className="text-2xl font-bold text-pink-600">{course.credits}</div>
            <div className="text-xs text-gray-500 font-medium">Credits</div>
          </div>
        </div>

        {/* Schedule & Location */}
        {(course.schedule || course.location) && (
          <div className="mb-4 space-y-2">
            {course.schedule && (
              <div className="flex items-center text-sm text-gray-600">
                <FaClock className="mr-3 text-gray-400 flex-shrink-0" />
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

        {course.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{course.description}</p>
        )}

        {/* Enrollment Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Enrollment</span>
            <span className="text-xs font-medium text-gray-700">{course.enrollmentCount || 0}/{course.capacity || 30}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getEnrollmentPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        {user && user.role === "admin" ? (
          <div className="flex space-x-3">
            <ActionButton
              onClick={() => handleEdit(course)}
              className="bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 hover:border-pink-300 flex-1"
            >
              <FaEdit className="mr-2" /> Edit
            </ActionButton>
            <ActionButton
              onClick={() => handleDelete(course._id)}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 flex-1"
            >
              <FaTrash className="mr-2" /> Delete
            </ActionButton>
          </div>
        ) : user ? (
          isEnrolled ? (
            <ActionButton
              onClick={() => handleUnenroll(course._id)}
              disabled={enrolling[course._id]}
              className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 w-full"
            >
              <FaUserMinus className="mr-2" /> {enrolling[course._id] ? "Processing..." : "Unenroll"}
            </ActionButton>
          ) : (
            <ActionButton
              onClick={() => handleEnroll(course._id)}
              disabled={enrolling[course._id] || course.enrollmentCount >= course.capacity}
              className={`w-full ${
                course.enrollmentCount >= course.capacity
                  ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-pink-600 text-white"
              }`}
            >
              <FaUserPlus className="mr-2" />
              {enrolling[course._id]
                ? "Processing..."
                : course.enrollmentCount >= course.capacity
                ? "Course Full"
                : "Enroll Now"}
            </ActionButton>
          )
        ) : (
          <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-xl flex items-center justify-center border border-purple-200">
            <FaSignInAlt className="mr-2" />
            <span className="text-sm font-medium">Login to enroll</span>
          </div>
        )}
      </div>
    </div>
  )
}

const CourseList = () => {
  const { user, courseAPI, enrollmentAPI } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [enrolling, setEnrolling] = useState({})

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const data = await courseAPI.getCourses()
      setCourses(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await courseAPI.deleteCourse(id)
        setCourses(courses.filter((c) => c._id !== id))
        setSuccess("Course deleted successfully")
        setTimeout(() => setSuccess(""), 3000)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleEdit = (course) => {
    setSelectedCourse(course)
    setShowEditModal(true)
  }

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }))
      await enrollmentAPI.enroll(courseId)
      await fetchCourses()
      setSuccess("Successfully enrolled in course")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  const handleUnenroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }))
      await enrollmentAPI.unenroll(courseId)
      await fetchCourses()
      setSuccess("Successfully unenrolled from course")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }))
    }
  }

  const isEnrolled = (course) => user && course.enrolledStudents?.includes(user._id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="h-14 w-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mr-4">
                <FaBook className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Course Catalog</h1>
                <p className="text-gray-600 text-lg">Explore and enroll in amazing courses</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <FaUsers className="mr-2" />
                {courses.length} Courses
              </span>
              {user && user.role === "student" && (
                <span className="flex items-center">
                  <FaGraduationCap className="mr-2" />
                  {courses.filter((course) => isEnrolled(course)).length} Enrolled
                </span>
              )}
            </div>
          </div>
          {user && user.role === "admin" && (
            <ActionButton onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <FaPlus className="mr-2" /> Add New Course
            </ActionButton>
          )}
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Empty State */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="h-20 w-20 bg-purple-100 flex items-center justify-center mx-auto mb-6 rounded-full">
              <FaBook className="text-purple-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No courses available</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {user?.role === "admin"
                ? "Add your first course to the catalog to get started."
                : "Check back later for new courses or contact your administrator."}
            </p>
            {user?.role === "admin" && (
              <ActionButton onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <FaPlus className="mr-2" /> Add Your First Course
              </ActionButton>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                user={user}
                enrolling={enrolling}
                isEnrolled={isEnrolled(course)}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleEnroll={handleEnroll}
                handleUnenroll={handleUnenroll}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        {showAddModal && <AddCourse onClose={() => setShowAddModal(false)} onCourseAdded={fetchCourses} />}
        {showEditModal && selectedCourse && (
          <EditCourse
            course={selectedCourse}
            onClose={() => {
              setShowEditModal(false)
              setSelectedCourse(null)
            }}
            onCourseUpdated={fetchCourses}
          />
        )}
      </div>
    </div>
  )
}

export default CourseList
