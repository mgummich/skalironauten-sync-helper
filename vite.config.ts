import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

function moodScalesPlugin(): Plugin {
  return {
    name: 'vite-plugin-mood-scales',
    configureServer(server) {
      server.middlewares.use('/mood-scales', (req, res, next) => {
        const reqUrl = req.url || '';
        const filePath = path.join(__dirname, 'mood-scales', decodeURIComponent(reqUrl.split('?')[0]));
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType =
            ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
            ext === '.webp' ? 'image/webp' :
            ext === '.mp4' ? 'video/mp4' : 'application/octet-stream';
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=3600');
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), moodScalesPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
