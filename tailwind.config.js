/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        'gradient-to-r-gray': 'linear-gradient(to right, #D1D5DB, #6B7280)', // bg-gray-300'den bg-gray-500'e
        'gradient-gray-200-to-300': 'linear-gradient(to right, #E5E7EB, #D1D5DB)',
        'gradient-gray-200-to-400': 'linear-gradient(to right, #E5E7EB, #9CA3AF)',
        'gradient-gray-200-to-500': 'linear-gradient(to right, #E5E7EB, #6B7280)',
        'gradient-gray-300-to-400': 'linear-gradient(to right, #D1D5DB, #9CA3AF)',
        'gradient-gray-300-to-500': 'linear-gradient(to right, #D1D5DB, #6B7280)',
        'gradient-gray-300-to-600': 'linear-gradient(to right, #D1D5DB, #4B5563)',
        'gradient-gray-400-to-500': 'linear-gradient(to right, #9CA3AF, #6B7280)',
        'gradient-gray-300-to-700': 'linear-gradient(to right, #D1D5DB, #374151)', // bg-gray-300'den bg-gray-700'e
        'gradient-gray-300-to-800': 'linear-gradient(to right, #D1D5DB, #1F2937)', // bg-gray-300'den bg-gray-800'e
        'gradient-gray-400-to-600': 'linear-gradient(to right, #9CA3AF, #4B5563)', // bg-gray-400'den bg-gray-600'e
        'gradient-gray-400-to-700': 'linear-gradient(to right, #9CA3AF, #374151)', // bg-gray-400'den bg-gray-700'e
        'gradient-gray-400-to-800': 'linear-gradient(to right, #9CA3AF, #1F2937)', // bg-gray-400'den bg-gray-800'e
        'gradient-gray-500-to-600': 'linear-gradient(to right, #6B7280, #4B5563)', // bg-gray-500'den bg-gray-600'e
        'gradient-gray-500-to-700': 'linear-gradient(to right, #6B7280, #374151)', // bg-gray-500'den bg-gray-700'e
        'gradient-gray-500-to-800': 'linear-gradient(to right, #6B7280, #1F2937)',
        'gradient-gray-600-to-700': 'linear-gradient(to right, #4B5563, #374151)', // bg-gray-600'den bg-gray-700'e
        'gradient-gray-600-to-800': 'linear-gradient(to right, #4B5563, #1F2937)', // bg-gray-600'den bg-gray-800'e
        'gradient-gray-600-to-900': 'linear-gradient(to right, #4B5563, #111827)', // bg-gray-600'den bg-gray-900'e
        // Dikey gradientler
        'gradient-to-b-gray': 'linear-gradient(to bottom, #D1D5DB, #6B7280)', // bg-gray-300'den bg-gray-500'e
        'gradient-gray-200-to-300-b': 'linear-gradient(to bottom, #E5E7EB, #D1D5DB)',
        'gradient-gray-200-to-400-b': 'linear-gradient(to bottom, #E5E7EB, #9CA3AF)',
        'gradient-gray-200-to-500-b': 'linear-gradient(to bottom, #E5E7EB, #6B7280)',
        'gradient-gray-300-to-400-b': 'linear-gradient(to bottom, #D1D5DB, #9CA3AF)',
        'gradient-gray-300-to-500-b': 'linear-gradient(to bottom, #D1D5DB, #6B7280)',
        'gradient-gray-300-to-600-b': 'linear-gradient(to bottom, #D1D5DB, #4B5563)',
        'gradient-gray-400-to-500-b': 'linear-gradient(to bottom, #9CA3AF, #6B7280)',
        'gradient-gray-300-to-700-b': 'linear-gradient(to bottom, #D1D5DB, #374151)',
        'gradient-gray-300-to-800-b': 'linear-gradient(to bottom, #D1D5DB, #1F2937)',
        'gradient-gray-400-to-600-b': 'linear-gradient(to bottom, #9CA3AF, #4B5563)',
        'gradient-gray-400-to-700-b': 'linear-gradient(to bottom, #9CA3AF, #374151)',
        'gradient-gray-400-to-800-b': 'linear-gradient(to bottom, #9CA3AF, #1F2937)',
        'gradient-gray-500-to-600-b': 'linear-gradient(to bottom, #6B7280, #4B5563)',
        'gradient-gray-500-to-700-b': 'linear-gradient(to bottom, #6B7280, #374151)',
        'gradient-gray-500-to-800-b': 'linear-gradient(to bottom, #6B7280, #1F2937)',
        'gradient-gray-600-to-700-b': 'linear-gradient(to bottom, #4B5563, #374151)',
        'gradient-gray-600-to-800-b': 'linear-gradient(to bottom, #4B5563, #1F2937)',
        'gradient-gray-600-to-900-b': 'linear-gradient(to bottom, #4B5563, #111827)',
      },
      boxShadow: {
        //'colorful-black': '0 4px 6px -1px rgba(0, 0, 0, 0.7), 0 2px 4px -2px rgba(0, 0, 0, 0.3)', // Black shadow
        'colorful-b': '0 8px 10px -1px rgba(0, 0, 0, 0.8), 0 4px 5px -2px rgba(0, 0, 0, 0.4)', // Thicker downward shadow
        'colorful-r': '4px 4px 10px -1px rgba(0, 0, 0, 0.8), 2px 2px 5px -2px rgba(0, 0, 0, 0.4)', // Thicker right shadow
        'red-500': '0 4px 6px -1px rgba(239, 68, 68, 0.5), 0 2px 4px -1px rgba(239, 68, 68, 0.5)',
        'green-100': '0 4px 6px -1px rgba(209, 250, 229, 0.5), 0 2px 4px -1px rgba(209, 250, 229, 0.5)',
        'green-200': '0 4px 6px -1px rgba(167, 243, 208, 0.5), 0 2px 4px -1px rgba(167, 243, 208, 0.5)',
        'green-300': '0 4px 6px -1px rgba(110, 231, 183, 0.5), 0 2px 4px -1px rgba(110, 231, 183, 0.5)',
        'green-400': '0 4px 6px -1px rgba(52, 211, 153, 0.5), 0 2px 4px -1px rgba(52, 211, 153, 0.5)',
        'green-500': '0 4px 6px -1px rgba(16, 185, 129, 0.5), 0 2px 4px -1px rgba(16, 185, 129, 0.5)',

      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


