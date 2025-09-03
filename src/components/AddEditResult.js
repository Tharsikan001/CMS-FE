import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTimes, FaSave } from 'react-icons/fa';

const AddEditResultPastel = ({ studentId, result, onSuccess, onCancel }) => {
  const { resultAPI, courseAPI } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    studentId: studentId || '',
    courseId: result?.course?._id || '',
    grade: result?.grade || '',
    score: result?.score || '',
    semester: result?.semester || '',
    academicYear: result?.academicYear || '',
    remarks: result?.remarks || ''
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await courseAPI.getCourses();
        setCourses(data);
      } catch {
        setError('Failed to load courses');
      }
    })();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (result) await resultAPI.updateResult(result._id, formData);
      else await resultAPI.addResult(formData);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl shadow-2xl w-full max-w-md border border-purple-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-3xl flex items-center space-x-2">
          <FaSave className="text-white text-xl" />
          <h2 className="text-lg font-bold">{result ? 'Edit Result' : 'Add New Result'}</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-200 text-red-800 px-4 py-2 rounded">{error}</div>}

          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            disabled={!!result}
            required
            className="w-full px-4 py-3 border border-purple-300 rounded-full focus:ring-2 focus:ring-pink-400 bg-white"
          >
            <option value="">Select Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.code} - {c.title}</option>)}
          </select>

          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-purple-300 rounded-full focus:ring-2 focus:ring-pink-400 bg-white"
          >
            <option value="">Select Grade</option>
            {['A','B','C','D','F','I'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            min="0" max="100"
            placeholder="Score (Optional)"
            className="w-full px-4 py-3 border border-purple-300 rounded-full focus:ring-2 focus:ring-pink-400 bg-white"
          />

          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester"
            required
            className="w-full px-4 py-3 border border-purple-300 rounded-full focus:ring-2 focus:ring-pink-400 bg-white"
          />

          <input
            type="text"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            placeholder="Academic Year"
            required
            className="w-full px-4 py-3 border border-purple-300 rounded-full focus:ring-2 focus:ring-pink-400 bg-white"
          />

          <textarea
            name="remarks"
            rows="3"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Remarks (Optional)"
            className="w-full px-4 py-3 border border-purple-300 rounded-full focus:ring-2 focus:ring-pink-400 bg-white"
          />

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-purple-300 rounded-full text-purple-700 hover:bg-purple-100 flex items-center">
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center disabled:opacity-50">
              <FaSave className="mr-2" /> {loading ? 'Saving...' : (result ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditResultPastel;
