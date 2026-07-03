export async function register() {
  // Only run on Node.js server runtime (not edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('dns')

    // ── Add Google DNS to resolve MongoDB Atlas SRV records ────
    // Some institutional/college networks and mobile hotspots block
    // SRV record lookups. Prepending Google DNS ensures the MongoDB
    // driver can resolve mongodb+srv:// connection strings.
    //
    // We prepend Google/Cloudflare DNS while keeping the system
    // resolvers as fallback for all other lookups.
    try {
      const existingServers = dns.default.getServers()
      const googleDns = ['8.8.8.8', '8.8.4.4', '1.1.1.1']
      // Deduplicate: add Google DNS first, then existing system DNS
      const combined = [
        ...googleDns,
        ...existingServers.filter((s: string) => !googleDns.includes(s)),
      ]
      dns.default.setServers(combined)
      console.log(`✅ DNS servers configured: ${combined.slice(0, 3).join(', ')} + ${combined.length - 3} system resolvers`)
    } catch (err) {
      console.warn('⚠️  Could not configure DNS servers:', (err as Error).message)
    }
  }
}
