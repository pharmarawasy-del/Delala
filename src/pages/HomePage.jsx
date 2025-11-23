import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import { supabase } from '../supabase';

const PAGE_SIZE = 10;

export default function HomePage({ onContactClick, searchTerm }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    const lastAdElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    // Reset and fetch when filters change
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        setAds([]);
        fetchAds(0, true);
    }, [selectedCategory, searchTerm]);

    // Fetch more when page changes (but not on initial reset which is handled above)
    useEffect(() => {
        if (page > 0) {
            fetchAds(page, false);
        }
    }, [page]);

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
                        {ads.map((item, index) => {
                            if (ads.length === index + 1) {
                                return (
                                    <div ref={lastAdElementRef} key={item.id}>
                                        <ListingCard
                                            item={{
                                                ...item,
                                                location: item.city
                                            }}
                                            onContactClick={onContactClick}
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <ListingCard
                                        key={item.id}
                                        item={{
                                            ...item,
                                            location: item.city
                                        }}
                                        onContactClick={onContactClick}
                                    />
                                );
                            }
                        })}

                        {loadingMore && (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="w-6 h-6 text-[#115ea3] animate-spin" />
                            </div>
                        )}

                        {!hasMore && ads.length > 0 && (
                            <div className="text-center py-6 text-gray-400 text-sm">
                                لا توجد إعلانات أخرى
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
