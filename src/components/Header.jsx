import { Link, useNavigate } from 'react-router-dom';
import { Menu, PlusCircle, LogIn, Search, X, Home, User, FileText, Phone, LogOut } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../supabase';

export default function Header({ user, onLoginClick, onPostAdClick, onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 shadow-md">
            {/* ROW 1: Brand Bar (Blue) - Menu, Logo, Login */}
            <div className="bg-[#115ea3] text-white">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Right: Menu Icon + Logo */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <Menu className="w-6 h-6 text-white" />
                        </button>
                        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
                            <span className="text-6xl font-black text-white tracking-tighter leading-none" style={{ fontFamily: "'Tajawal', sans-serif" }}>دلالة</span>
                        </Link>
                    </div>

                    {/* Left: Login Link or User Avatar */}
                    {user ? (
                        <Link to="/profile" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
                                {user.profile_picture_url ? (
                                    <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F59E0B] to-[#d97706] text-white font-bold text-xs">
                                        {user.first_name ? user.first_name.substring(0, 2).toUpperCase() : <User className="w-5 h-5" />}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-bold hidden md:block">
                                {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'المستخدم'}
                            </span>
                        </Link>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors font-medium text-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>دخول</span>
                        </button>
                    )}
                </div>
            </div>

            {/* ROW 2: Action Bar (White) - Compact & Dense */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto py-2 px-3 flex items-center gap-2">
                    {/* Right: Add Ad Button */}
                    <button
                        onClick={onPostAdClick}
                        className="bg-[#F59E0B] hover:bg-[#d98c0a] text-white px-4 h-10 rounded-md flex items-center gap-2 font-bold transition-colors shadow-sm whitespace-nowrap"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>أضف إعلان</span>
                    </button>

                    {/* Left: Search Bar (Takes remaining width) */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="ابحث في دلالة..."
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md pr-10 pl-4 text-gray-700 text-sm focus:ring-2 focus:ring-[#115ea3] focus:border-transparent outline-none placeholder-gray-400 transition-all"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Sidebar Drawer */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>

                    {/* Sidebar */}
                    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
                        <div className="p-6">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>

                            {/* Logo */}
                            <div className="mb-8 mt-2">
                                <span className="text-5xl font-black text-[#115ea3] tracking-tighter leading-none" style={{ fontFamily: "'Tajawal', sans-serif" }}>دلالة</span>
                            </div>

                            {/* Menu Links */}
                            <nav className="space-y-2">
                                <Link
                                    to="/"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#115ea3]"
                                >
                                    <Home className="w-5 h-5" />
                                    <span className="font-bold">الرئيسية</span>
                                </Link>

                                {user ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#115ea3]"
                                        >
                                            <User className="w-5 h-5" />
                                            <span className="font-bold">حسابي</span>
                                        </Link>
                                        <Link
                                            to="/my-ads"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#115ea3]"
                                        >
                                            <FileText className="w-5 h-5" />
                                            <span className="font-bold">إعلاناتي</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span className="font-bold">تسجيل الخروج</span>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            onLoginClick();
                                        }}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#115ea3]"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        <span className="font-bold">تسجيل الدخول</span>
                                    </button>
                                )}

                                <div className="border-t border-gray-100 my-2"></div>

                                <Link
                                    to="/terms"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#115ea3]"
                                >
                                    <FileText className="w-5 h-5" />
                                    <span className="font-bold">اتفاقية الاستخدام</span>
                                </Link>

                                <Link
                                    to="/contact"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#115ea3]"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span className="font-bold">اتصل بنا</span>
                                </Link>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
