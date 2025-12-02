const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        // Убеждаемся, что заголовки правильно передаются
        console.log('Proxying request to:', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Исправляем дублированные CORS заголовки
        const headers = proxyRes.headers;
        
        // Обработка access-control-allow-credentials
        if (headers['access-control-allow-credentials']) {
          let value = headers['access-control-allow-credentials'];
          
          // Если это массив, берем первое значение
          if (Array.isArray(value)) {
            value = value[0];
          }
          
          // Если это строка с дубликатами (например, "true, true"), оставляем только первое
          if (typeof value === 'string' && value.includes(',')) {
            value = value.split(',')[0].trim();
          }
          
          // Устанавливаем правильное значение
          headers['access-control-allow-credentials'] = value;
        }
        
        // Аналогично обрабатываем другие CORS заголовки, которые могут быть дублированы
        const corsHeaders = [
          'access-control-allow-origin',
          'access-control-allow-methods',
          'access-control-allow-headers',
          'access-control-expose-headers'
        ];
        
        corsHeaders.forEach(headerName => {
          if (headers[headerName]) {
            let value = headers[headerName];
            
            // Если это массив, берем первое значение
            if (Array.isArray(value)) {
              value = value[0];
              headers[headerName] = value;
            }
            
            // Если это строка с дубликатами, оставляем только первое
            if (typeof value === 'string' && value.includes(',')) {
              const parts = value.split(',').map(p => p.trim());
              // Для некоторых заголовков можно оставить все уникальные значения
              // Но для credentials и origin лучше оставить только первое
              if (headerName === 'access-control-allow-credentials' || 
                  headerName === 'access-control-allow-origin') {
                headers[headerName] = parts[0];
              } else {
                // Для методов и заголовков можно объединить уникальные значения
                headers[headerName] = [...new Set(parts)].join(', ');
              }
            }
          }
        });
      }
    })
  );
};


