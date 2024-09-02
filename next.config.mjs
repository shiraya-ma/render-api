/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uncomment the following line to build a static site.
  // output: "export",
  headers: async () => ([
    {
      source: '/ogp',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' }
      ]
    },
    {
      source: '/api/ogp',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' }
      ]
    }
  ]),
  reactStrictMode: true,
};

export default nextConfig;
