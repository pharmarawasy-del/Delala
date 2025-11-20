import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const LOCATIONS = [
    "الكل",
    "أم درمان", "الخرطوم", "بورتسودان", "عطبرة", "شندي",
    "دنقلا", "مدني", "القضارف", "كسلا", "الأبيض",
    "الفاشر", "نيالا"
];

export default function Hero() {
    const [selectedLocation, setSelectedLocation] = useState("الكل");

    const handleLocationClick = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("User location:", position.coords);
                alert("تم تحديد موقعك: أم درمان");
                setSelectedLocation("أم درمان");
            },
            (error) => {
                alert("يرجى اختيار المدينة يدوياً");
            }
        );
    };

    return (
        <div className="mb-4 pt-4 px-2">
            {/* Location Filter Only (Search moved to Header) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {/* Near Me Button */}
                <button
                    onClick={handleLocationClick}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-[#009688] hover:text-white transition-colors whitespace-nowrap flex-shrink-0 text-sm font-medium"
                >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>قريب مني</span>
                </button>

                {/* Cities List */}
                {LOCATIONS.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc)}
                        className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap flex-shrink-0 text-sm font-medium ${selectedLocation === loc
                            ? 'bg-[#009688] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {loc}
                    </button>
                ))}
            </div>
        </div>
    );
}
