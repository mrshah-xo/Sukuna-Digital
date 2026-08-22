import fetch from 'node-fetch';

async function run() {
    console.log("=== Verification Script ===");
    console.log("Starting Next.js Dev Server...");
    
    // Check if server is up
    try {
        const res = await fetch('http://localhost:3000/login');
        console.log(`Server is running. /login -> ${res.status}`);
        
        const routes = ['/', '/login', '/verify-otp', '/verify-success', '/dashboard', '/admin', '/memory', '/transport', '/live-teacher'];
        for (const route of routes) {
            const r = await fetch(`http://localhost:3000${route}`);
            console.log(`Route ${route} -> HTTP ${r.status}`);
        }
    } catch {
        console.log("Server not reachable on port 3000.");
    }
}
run();
