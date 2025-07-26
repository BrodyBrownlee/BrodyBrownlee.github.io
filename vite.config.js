export default {
    build: {
        outDir: 'dist',
        assetsDir: 'assets'
    },
    optimizeDeps: {
        include: ['three']
    },
    server: {
        port: 3000
    }
}
