// src/components/ui/Button.jsx
export default function Button({ children, className, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none ${className}`}
      >
        {children}
      </button>
    );
  }
  