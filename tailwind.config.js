export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                jumpHigh: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' }, // 👈 increase this
                },
            },
            animation: {
                jump: 'jumpHigh 0.6s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};
