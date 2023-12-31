module.exports = {
    mode: 'jit',
    content: [
        './index.html',
        './src/**/*.{svelte,js,ts}'
    ],
    variants: {
        extend: {}
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ['light']
    }
};