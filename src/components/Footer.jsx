import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-6 mt-auto w-full">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4" dir="rtl">
                {/* Logo */}
                <div className="text-xl font-bold">
                    دلالة
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-wrap justify-center gap-4 text-sm">
                    <a href="#" className="hover:text-gray-300 transition-colors">شروط الاستخدام</a>
                    <span className="hidden md:inline text-gray-500">|</span>
                    <a href="#" className="hover:text-gray-300 transition-colors">سياسة الخصوصية</a>
                    <span className="hidden md:inline text-gray-500">|</span>
                    <a href="#" className="hover:text-gray-300 transition-colors">اتصل بنا</a>
                </nav>

                {/* Copyright */}
                <div className="text-sm text-gray-400">
                    &copy; {currentYear} Delala. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
