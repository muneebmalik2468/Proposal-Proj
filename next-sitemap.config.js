/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://clientpitcher.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/api/*',
    '/admin/',
    '/dashboard/*',
    '/login',
    '/signup',
    '/forgot-password',
    '/upgrade',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login', '/signup', '/forgot-password', '/upgrade'],
      },
    ],
  },
}
