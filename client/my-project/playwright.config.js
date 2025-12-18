import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60 * 1000,
  retries: 0,

  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 720 }
  },

  webServer: [
    {
      // 🔹 Backend (Express)
      command: 'npx cross-env NODE_ENV=test npm run dev',
      cwd: '../../server',              // ✅ IMPORTANT (instead of cd &&)
      port: 5000,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000
    },
    {
      // 🔹 Frontend (Vite)
      command: 'npm run dev',
      cwd: '.',                          // client/my-project
      port: 5173,
      reuseExistingServer: false,
      timeout: 120 * 1000
    }
  ]
});
