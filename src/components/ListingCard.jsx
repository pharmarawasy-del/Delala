import React from 'react';
import { MapPin, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ListingCard({ item, onContactClick }) {
    return (
        <div className="bg-white border-b border-gray-200 py-3 px-2 hover:bg-gray-50 transition-colors">
            <Link to={`/ad/${item.id}`} className="flex gap-3">
                {/* Image - Right Side (RTL) */}
                <div className="w-28 h-28 flex-shrink-0">
                    <img
                        src={item.images && item.images.length > 0 ? item.images[0] : "https://placehold.co/600x400?text=No+Image"}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                </div>

                {/* Content - Left Side */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-[#009688] mb-1 line-clamp-2 leading-snug">
                                {item.title}
                            </h3>
                            <span className="text-[#F59E0B] font-bold text-lg whitespace-nowrap mr-2">
                                {item.price.toLocaleString()}
                            </span>
                        </div>

                        {/* Meta Info Row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-2">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{item.location}</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>المستخدم</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>قبل ساعة</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
