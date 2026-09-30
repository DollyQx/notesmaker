import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/my-notes/']
      }
    ],
    sitemap: 'https://notesstudy.online/sitemap.xml'
  };
}
