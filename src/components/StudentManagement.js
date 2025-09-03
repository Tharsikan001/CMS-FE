import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUserGraduate, FaUsers, FaCalendarAlt, FaIdCard } from 'react-icons/fa';

const StudentManagement = () => {
  const { studentAPI } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getStudents();
      setStudents(data);
      setError('');
    } catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await studentAPI.deleteStudent(id);
      setStudents(students.filter(s => s._id !== id));
    } catch (err) { setError(err.message); }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-purple-500 border-t-pink-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4 shadow-lg">
            <FaUsers className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-500 mt-1">Manage all registered students</p>
          </div>
        </div>
        {students.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg hover:shadow-pink-200 transition-shadow">
            <div className="flex items-center">
              <FaUserGraduate className="text-white text-2xl mr-2" />
              <span className="text-white font-semibold">{students.length} Students</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Card icon={<FaUsers />} title="Total Students" value={students.length} bgFrom="from-purple-200" bgTo="to-pink-200" />
          <Card icon={<FaCalendarAlt />} title="New This Month" value={students.filter(s => new Date(s.createdAt).getMonth() === new Date().getMonth()).length} bgFrom="from-green-200" bgTo="to-green-300" />
          <Card icon={<FaIdCard />} title="Active Accounts" value={students.length} bgFrom="from-purple-200" bgTo="to-pink-200" />
        </div>
      )}

      {/* Students Table */}
      {students.length === 0 ? (
        <EmptyState icon={<FaUserGraduate />} title="No students found" description="No registered students yet." />
      ) : (
        <Table data={students} onDelete={handleDelete} />
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

/* Reusable Components */
const Card = ({ icon, title, value, bgFrom, bgTo }) => (
  <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-pink-200 transition-shadow">
    <div className="flex items-center">
      <div className={`p-3 bg-gradient-to-r ${bgFrom} ${bgTo} rounded-2xl mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  </div>
);

const EmptyState = ({ icon, title, description }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">{icon}</div>
    <h3 className="mt-5 text-xl font-medium text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-500">{description}</p>
  </div>
);

const Table = ({ data, onDelete }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
    <div className="px-6 py-5 border-b border-gray-100">
      <h2 className="text-lg font-medium text-gray-900">All Students</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(student => (
            <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{student.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(student.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onDelete(student._id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default StudentManagement;
