import React, { useEffect, useState } from 'react';
import ListingCard from '../components/ListingCard';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import { supabase } from '../supabase';

export default function HomePage({ onContactClick, searchTerm }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchAds();
    }, [selectedCategory, searchTerm]);

    const fetchAds = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('ads')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (selectedCategory) {
                query = query.eq('category', selectedCategory);
            }

            if (searchTerm) {
                query = query.ilike('title', `%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setAds(data || []);
        } catch (error) {
            console.error('Error fetching ads:', error.message, error.details, error.hint);
        } finally {
            setLoading(false);
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

            {loading ? (
                <div className="text-center py-10 text-gray-500">جاري التحميل...</div>
            ) : (
                <div className="flex flex-col">
                    {ads.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">لا توجد إعلانات حتى الآن</div>
                    ) : (
                        ads.map(item => (
                            <ListingCard
                                key={item.id}
                                item={{
                                    ...item,
                                    location: item.city, // Map city to location for ListingCard
                                    image: item.image_url // Map image_url to image for ListingCard
                                }}
                                onContactClick={onContactClick}
                            />
                        ))
                    )}
                </div>
            )}
        </main>
    );
}
