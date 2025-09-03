import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaUserGraduate, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';

const StudentDetails = () => {
  const { studentAPI } = useAuth();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudentDetails();
  }, [id]);

  const loadStudentDetails = async () => {
    try {
      setLoading(true);
      const [studentData, enrollmentData] = await Promise.all([
        studentAPI.getStudent(id),
        studentAPI.getStudentEnrollments(id)
      ]);
      setStudent(studentData);
      setEnrollments(enrollmentData.enrollments || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-pink-500 border-t-purple-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-4">
          Student not found
        </div>
        <Link
          to="/admin/students"
          className="inline-flex items-center text-purple-600 hover:text-pink-500 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        to="/admin/students"
        className="inline-flex items-center text-purple-600 hover:text-pink-500 font-semibold mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Students
      </Link>

      {/* Student Info Card */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:scale-[1.02]">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <FaGraduationCap className="mr-2" /> Student Details
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          <div>
            <label className="block text-sm opacity-80">Name</label>
            <p className="mt-1 text-lg font-semibold">{student.name}</p>
          </div>
          <div>
            <label className="block text-sm opacity-80">Email</label>
            <p className="mt-1">{student.email}</p>
          </div>
          <div>
            <label className="block text-sm opacity-80">Joined Date</label>
            <p className="mt-1">{new Date(student.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm opacity-80">Student ID</label>
            <p className="mt-1">{student._id}</p>
          </div>
        </div>
      </div>

      {/* Enrollments Card Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
          <FaBook className="mr-2 text-purple-600" /> Course Enrollments
        </h2>

        {enrollments.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl shadow-lg">
            <FaUserGraduate className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">This student is not enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-all transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium text-sm">
                    {course.code}
                  </span>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-medium text-sm">
                    {course.credits} Credits
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{course.title}</h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <FaChalkboardTeacher className="mr-2 text-purple-500" />
                  <span>{course.instructor?.name || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
