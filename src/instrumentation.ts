export async function register() {
  // Only run on Node.js server runtime (not edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('dns')
    // Force Google DNS to bypass institutional/college WiFi DNS blocking
    dns.default.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])
    console.log('✅ DNS servers set to Google DNS (8.8.8.8)')
  }
}
