import React, { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import { supabase } from '../supabase';

const PAGE_SIZE = 8;

export default function HomePage({ onContactClick, searchTerm }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const sentinelRef = useRef(null);

    // Reset and fetch when filters change
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        setAds([]);
        fetchAds(0, true);
    }, [selectedCategory, searchTerm]);

    // Fetch more when page changes
    useEffect(() => {
        if (page > 0) {
            fetchAds(page, false);
        }
    }, [page]);

    // Intersection Observer for Sentinel
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                setPage((prev) => prev + 1);
            }
        }, { threshold: 0.5 });

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, [hasMore, loading, loadingMore]);

    const fetchAds = async (pageIndex, isNewSearch = false) => {
        if (isNewSearch) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            let query = supabase
                .from('ads')
                .select('*, images')
                .order('created_at', { ascending: false })
                .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

            if (selectedCategory) {
                query = query.eq('category', selectedCategory);
            }

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;

            const newAds = data || [];

            if (isNewSearch) {
                setAds(newAds);
            } else {
                setAds(prev => [...prev, ...newAds]);
            }

            // If we got fewer items than requested, we've reached the end
            if (newAds.length < PAGE_SIZE) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching ads:', error.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-6">
            {/* Hero & Categories */}
            <Hero />
            <Categories
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Listings Feed */}
            <h2 className="text-xl font-bold mb-4 text-gray-800 px-2">أحدث الإعلانات</h2>

            <div className="flex flex-col min-h-[200px]">
                {loading && ads.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 text-[#115ea3] animate-spin" />
                    </div>
                ) : ads.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">لا توجد إعلانات حتى الآن</div>
                ) : (
                    <>
                        {ads.map((item) => (
                            <ListingCard
                                key={item.id}
                                item={{
                                    ...item,
                                    location: item.city
                                }}
                                onContactClick={onContactClick}
                            />
                        ))}

                        {/* Sentinel Div for Infinite Scroll */}
                        <div id="load-more-trigger" ref={sentinelRef} className="h-10 w-full flex justify-center items-center mt-4">
                            {loadingMore && <Loader2 className="w-6 h-6 text-[#115ea3] animate-spin" />}
                            {!hasMore && ads.length > 0 && (
                                <span className="text-gray-400 text-sm">نهاية النتائج</span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
