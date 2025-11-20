/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0F4C81',
                gold: '#F59E0B',
            },
            fontFamily: {
                sans: ['system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
