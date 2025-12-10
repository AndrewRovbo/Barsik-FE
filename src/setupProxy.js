const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://localhost:8080',
			changeOrigin: true,
			ws: true,
			pathRewrite: {
				'^/api': '/api'
			},
			onProxyRes: (proxyRes, req, res) => {
				if (proxyRes.headers['access-control-allow-credentials']) {
					const value = proxyRes.headers['access-control-allow-credentials'];
					if (typeof value === 'string' && value.includes(',')) {
						proxyRes.headers['access-control-allow-credentials'] = 'true';
					}
				}
			}
		})
	);
};
