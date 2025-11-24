import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">عذراً، حدث خطأ ما</h1>
                        <p className="text-gray-500 mb-8">
                            واجه التطبيق مشكلة غير متوقعة. يرجى محاولة إعادة تحميل الصفحة.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-[#115ea3] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                        >
                            إعادة تحميل الصفحة
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
