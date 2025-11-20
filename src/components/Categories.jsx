import React, { useState } from 'react';
import {
    Car, Home, Smartphone, Sofa, Cat, Briefcase, Wrench, Shirt,
    ChevronDown, ChevronUp, LayoutGrid
} from 'lucide-react';

const CATEGORIES = [
    { id: 'vehicles', label: 'سيارات', icon: Car },
    { id: 'real-estate', label: 'عقارات', icon: Home },
    { id: 'electronics', label: 'إلكترونيات', icon: Smartphone },
    { id: 'furniture', label: 'أثاث', icon: Sofa },
    { id: 'animals', label: 'حيوانات', icon: Cat },
    { id: 'jobs', label: 'وظائف', icon: Briefcase },
    { id: 'services', label: 'خدمات', icon: Wrench },
    { id: 'fashion', label: 'أزياء', icon: Shirt },
];

export default function Categories({ selectedCategory, onSelectCategory }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mb-4 border-b border-gray-100 pb-4">
            <div className="flex justify-between items-center mb-3 px-2">
                <h2 className="text-lg font-bold text-gray-800">الأقسام</h2>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[#115ea3] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                    {isExpanded ? (
                        <>
                            <span>أقل</span>
                            <ChevronUp className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            <span>المزيد</span>
                            <ChevronDown className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>

            <div className={`
                ${isExpanded
                    ? 'grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 px-2'
                    : 'flex overflow-x-auto no-scrollbar gap-2 pb-2 px-2'
                }
            `}>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(selectedCategory === cat.id ? '' : cat.id)}
                        className={`flex flex-col items-center justify-center gap-1 min-w-[70px] h-[70px] bg-white border rounded-md transition-all ${selectedCategory === cat.id
                                ? 'border-[#115ea3] shadow-sm'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <cat.icon className={`w-6 h-6 ${selectedCategory === cat.id ? 'text-[#115ea3]' : 'text-gray-600'
                            }`} />
                        <span className={`text-xs ${selectedCategory === cat.id ? 'text-[#115ea3] font-bold' : 'text-gray-600'
                            }`}>
                            {cat.label}
                        </span>
                    </button>
                ))}

                {!isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex flex-col items-center justify-center gap-1 min-w-[70px] h-[70px] bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
                    >
                        <LayoutGrid className="w-6 h-6 text-gray-600" />
                        <span className="text-xs text-gray-600">المزيد</span>
                    </button>
                )}
            </div>
        </div>
    );
}
