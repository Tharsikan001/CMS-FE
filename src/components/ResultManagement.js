import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEdit, FaPlus, FaUserGraduate, FaBook, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import AddEditResult from './AddEditResult';

// Stats Card Component
const StatsCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center border border-gray-100 hover:shadow-xl transition-shadow">
    <div className={`p-4 rounded-full mr-4 ${color} flex items-center justify-center text-white text-2xl`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-3xl p-12 border border-gray-100">
    <div className="text-pink-300 text-6xl mb-6">
      <FaBook />
    </div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Results Found</h2>
    <p className="text-gray-500 mb-6 text-center">This student doesn't have any academic results yet.</p>
    <button
      onClick={onAdd}
      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-2xl flex items-center hover:scale-105 transition-transform hover:shadow-lg"
    >
      <FaPlus className="mr-2" /> Add First Result
    </button>
  </div>
);

const ResultManagement = () => {
  const { studentAPI, resultAPI } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [results, setResults] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentsData = await studentAPI.getStudents();
        setStudents(studentsData);
        setError('');

        if (selectedStudent) {
          const resultsData = await resultAPI.getStudentResults(selectedStudent);
          setResults(resultsData.results || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedStudent]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await resultAPI.deleteResult(id);
        setResults(results.filter(r => r._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    if (selectedStudent) resultAPI.getStudentResults(selectedStudent).then(data => setResults(data.results || []));
  };

  const handleEditSuccess = () => {
    setEditingResult(null);
    if (selectedStudent) resultAPI.getStudentResults(selectedStudent).then(data => setResults(data.results || []));
  };

  const calculateGPA = () => {
    if (!results.length) return 0;
    const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0, I: 0 };
    const total = results.reduce((acc, r) => {
      if (r.grade !== 'I') {
        const credits = r.course?.credits || 0;
        acc.points += gradePoints[r.grade] * credits;
        acc.credits += credits;
      }
      return acc;
    }, { points: 0, credits: 0 });
    return total.credits ? (total.points / total.credits).toFixed(2) : 0;
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-3xl shadow-md">
            <FaBook className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Result Management</h1>
            <p className="text-gray-500 mt-1">Manage student grades and academic results</p>
          </div>
        </div>
        {selectedStudent && results.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-4 shadow-lg flex items-center space-x-3">
            <FaGraduationCap className="text-white text-2xl" />
            <span className="text-white font-semibold text-lg">GPA: {calculateGPA()}</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-l-4 border-pink-500 p-4 rounded-2xl shadow-md animate-pulse mb-6">
          <p className="text-sm text-pink-700 font-medium">{error}</p>
        </div>
      )}

      {/* Student Selection */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaUserGraduate className="mr-2 text-purple-500" /> Select Student
        </h2>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
        >
          <option value="">Select a student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} - {student.email}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && <AddEditResult studentId={selectedStudent} onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />}
      {editingResult && <AddEditResult result={editingResult} onSuccess={handleEditSuccess} onCancel={() => setEditingResult(null)} />}

      {/* Stats Cards */}
      {selectedStudent && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard icon={<FaBook />} label="Courses Completed" value={results.filter(r => r.grade !== 'I').length} color="bg-purple-500" />
          <StatsCard icon={<FaGraduationCap />} label="Current GPA" value={calculateGPA()} color="bg-pink-500" />
          <StatsCard icon={<FaCalendarAlt />} label="Total Results" value={results.length} color="bg-purple-400" />
        </div>
      )}

      {/* Empty State */}
      {selectedStudent && results.length === 0 && !showAddForm && !editingResult && <EmptyState onAdd={() => setShowAddForm(true)} />}

      {/* Results Table */}
      {selectedStudent && results.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Student Results</h2>
              <p className="mt-1 text-sm text-gray-500">List of all academic results</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-2xl flex items-center hover:scale-105 transition-transform hover:shadow-lg"
            >
              <FaPlus className="mr-2" /> Add Result
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  {['Course', 'Grade', 'Score', 'Semester', 'Year', 'Actions'].map((heading) => (
                    <th key={heading} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${heading === 'Actions' ? 'text-right' : ''}`}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-purple-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{result.course?.code}</div>
                        <div className="text-sm text-gray-500">{result.course?.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${result.grade === 'A' ? 'bg-green-100 text-green-800' :
                        result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        result.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                        result.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.score || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.academicYear}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-3">
                      <button onClick={() => setEditingResult(result)} className="text-purple-600 hover:text-pink-600 inline-flex items-center transition-colors">
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button onClick={() => handleDelete(result._id)} className="text-red-600 hover:text-red-800 inline-flex items-center transition-colors">
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
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

export default ResultManagement;
