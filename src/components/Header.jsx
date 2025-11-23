import React, { useState } from 'react';
import { Search, Menu, X, PlusCircle, User, LogOut, LayoutDashboard, FileText, Phone, Home, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { isAdmin } from '../utils/admin';

export default function Header({ user, onLoginClick, onPostAdClick, onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchValue);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm pt-safe">
            {/* Top Bar - Brand & Actions */}
            <div className="bg-[#115ea3] text-white py-3">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Right: Logo & Menu */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-1 hover:bg-white/10 rounded-full transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                                <span className="text-2xl font-black text-[#115ea3] leading-none pt-1">د</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight hidden sm:block">دلالة</h1>
                        </Link>
                    </div>

                    {/* Center: Search Bar (Hidden on mobile, shown on desktop) */}
                    <div className="hidden lg:block flex-1 max-w-2xl mx-8">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                placeholder="ابحث عن سيارة، عقار، أو أي شيء..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-xl py-2.5 pl-4 pr-12 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 group-focus-within:text-[#115ea3] transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Left: Actions */}
                    <div className="flex items-center gap-3">
                        {isAdmin(user) && (
                            <Link
                                to="/admin"
                                className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-900/20 text-sm"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span>الإدارة</span>
                            </Link>
                        )}

                        <button
                            onClick={onPostAdClick}
                            className="hidden md:flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-900/20 transform hover:-translate-y-0.5"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>أضف إعلانك</span>
                        </button>

                        {user ? (
                            <Link to="/profile" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10">
                                {user.profile_picture_url ? (
                                    <img src={user.profile_picture_url} alt={user.first_name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="font-bold text-lg">{user.first_name?.[0] || <User className="w-5 h-5" />}</span>
                                )}
                            </Link>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="text-white font-medium hover:bg-white/10 px-4 py-2 rounded-xl transition-colors"
                            >
                                تسجيل الدخول
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="lg:hidden bg-white border-b border-gray-100 p-3">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="ابحث في دلالة..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full bg-gray-100 border-none text-gray-900 rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-[#115ea3] transition-all"
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-[#115ea3]">القائمة</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-[#115ea3]"
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-bold">الرئيسية</span>
                            </Link>

                            {user && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
                                        {user.profile_picture_url ? (
                                            <img src={user.profile_picture_url} alt={user.first_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{user.first_name} {user.last_name}</p>
                                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-xs text-[#115ea3] font-medium">عرض الملف الشخصي</Link>
                                    </div>
                                </div>
                            )}

                            {isAdmin(user) && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 text-red-600 bg-red-50 rounded-xl font-bold hover:bg-red-100 transition-colors"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span>لوحة الإدارة</span>
                                </Link>
                            )}

                            <button
                                onClick={() => {
                                    onPostAdClick();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                            >
                                <PlusCircle className="w-5 h-5 text-[#F59E0B]" />
                                <span>أضف إعلانك</span>
                            </button>

                            {user && (
                                <Link
                                    to="/my-ads"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                                >
                                    <FileText className="w-5 h-5 text-[#115ea3]" />
                                    <span>إعلاناتي</span>
                                </Link>
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
                        </div>

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="mt-4 flex items-center justify-center gap-2 w-full bg-gray-100 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>تسجيل الخروج</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onLoginClick();
                                    setIsMenuOpen(false);
                                }}
                                className="mt-4 w-full bg-[#115ea3] text-white py-3 rounded-xl font-bold hover:bg-[#0d4b82] transition-colors"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>تسجيل الدخول</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
