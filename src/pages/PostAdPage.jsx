import React from 'react';
import PostAdForm from '../components/PostAdForm';

export default function PostAdPage() {
    return (
        <main className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">أضف إعلان جديد</h2>
            <PostAdForm />
        </main>
    );
}
