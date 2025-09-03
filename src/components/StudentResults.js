import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaGraduationCap, FaAward, FaBook, FaCalendarAlt } from 'react-icons/fa';

const StudentResults = () => {
  const { resultAPI } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyResults();
  }, []);

  const loadMyResults = async () => {
    try {
      setLoading(true);
      const data = await resultAPI.getMyResults();
      setResults(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = () => {
    if (results.length === 0) return 0;
    
    const gradePoints = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0, 'I': 0.0 };
    let totalPoints = 0, totalCredits = 0;

    results.forEach(result => {
      if (result.grade !== 'I') {
        const credits = result.course?.credits || 0;
        totalPoints += gradePoints[result.grade] * credits;
        totalCredits += credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-pink-500 border-t-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4 shadow-lg">
            <FaChartLine className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Academic Transcript</h1>
            <p className="text-gray-600 mt-1">Your course grades and academic performance</p>
          </div>
        </div>
        {results.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg hover:shadow-pink-400 transition-shadow">
            <div className="flex items-center">
              <FaAward className="text-white text-2xl mr-2" />
              <span className="text-white font-semibold">GPA: {calculateGPA()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl shadow-sm">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Result Stats */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-pink-200 transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl mr-4">
                <FaBook className="text-xl text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Courses Completed</p>
                <h3 className="text-2xl font-bold text-gray-800">{results.filter(r => r.grade !== 'I').length}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-pink-200 transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-200 to-green-300 rounded-2xl mr-4">
                <FaGraduationCap className="text-xl text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Credits</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {results.reduce((total, result) => result.grade !== 'I' ? total + (result.course?.credits || 0) : total, 0)}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-pink-200 transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl mr-4">
                <FaCalendarAlt className="text-xl text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Results</p>
                <h3 className="text-2xl font-bold text-gray-800">{results.length}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Table */}
      {results.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
            <FaGraduationCap className="text-3xl text-gray-400" />
          </div>
          <h3 className="mt-5 text-xl font-medium text-gray-900">No results available</h3>
          <p className="mt-2 text-gray-500">You don't have any results yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Course Results</h2>
            <p className="mt-1 text-sm text-gray-500">List of all your academic results</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map(result => (
                  <tr key={result._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.course?.code}</div>
                      <div className="text-sm text-gray-500">{result.course?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${result.grade === 'A' ? 'bg-green-100 text-green-800' : 
                          result.grade === 'B' ? 'bg-blue-100 text-blue-800' : 
                          result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 
                          result.grade === 'D' ? 'bg-orange-100 text-orange-800' : 
                          result.grade === 'F' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.course?.credits || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.academicYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
