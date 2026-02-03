import { Link } from "react-router-dom";
import { MoveLeft, HelpCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans text-website-black">
      <div className="max-w-md w-full text-center">
        {/* Decorative Element */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 animate-pulse opacity-50"></div>
            <div className="relative bg-white p-6 rounded-full shadow-lg border border-gray-100">
              <HelpCircle size={64} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* 404 Heading */}
        <div className="relative mb-2">
            <h1 className="text-9xl font-bold text-heading-blue tracking-tighter opacity-10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-heading-blue">Error 404</span>
            </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-website-black mb-4">
          Oops! Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-heading-blue hover:bg-[#123062] text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <MoveLeft size={20} />
          Back to Homepage
        </Link>

        {/* Footer Support Info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <a href="#" className="text-heading-blue font-medium hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;