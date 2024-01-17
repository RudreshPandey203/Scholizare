// components/RegisterCourseForm.js

import React from 'react';

const RegisterCourseForm = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 m-[5vh] bg-blue-500 rounded-md h-[90vh]">
      <h2 className="text-2xl text-white font-semibold mb-6">Register for a Course</h2>

      <form>
        <div className="mb-4">
          <label htmlFor="courseName" className="block text-white text-sm font-medium mb-2">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-300"
            placeholder="Enter the course name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="studentConstraints" className="block text-white text-sm font-medium mb-2">
            Student Constraints
          </label>
          <input
            type="text"
            id="studentConstraints"
            name="studentConstraints"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-300"
            placeholder="Enter student constraints"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-white text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-300"
            placeholder="Enter the location"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fees" className="block text-white text-sm font-medium mb-2">
            Fees
          </label>
          <input
            type="text"
            id="fees"
            name="fees"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-300"
            placeholder="Enter the fees"
          />
        </div>

        <button
          type="submit"
          className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 focus:outline-none"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterCourseForm;
