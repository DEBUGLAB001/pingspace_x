const express = require('express');
const path = require('path');
const contactRoutes = require('./src/routes/contactRoutes');
const conversationRoutes = require('./src/routes/conversationRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const errorHandler = require('./src/middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(express.json());

  // API router
  const apiRouter = express.Router();
  apiRouter.use('/contacts', contactRoutes);
  apiRouter.use('/conversations', conversationRoutes);
  apiRouter.use('/search', searchRoutes);
  apiRouter.use('/health', healthRoutes);

  // Reset store endpoint for resetting challenge attempt state
  apiRouter.post('/reset', (req, res) => {
    const storeRepository = require('./src/repositories/storeRepository');
    const messageService = require('./src/services/messageService');
    storeRepository.reset();
    messageService.clearCache();
    res.json({ success: true, message: 'Store reset to initial seed data' });
  });

  // Mount API router for standard /api and DEBUG//LAB preview prefix
  app.use('/api', apiRouter);
  app.use('/runtime/:runtimeId/preview/api', apiRouter);

  // Serve static assets for standard root and DEBUG//LAB preview prefix
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));
  app.use('/runtime/:runtimeId/preview', express.static(publicDir));

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

const app = createApp();

if (require.main === module) {
  const HOST = '0.0.0.0';
  const PORT = parseInt(process.env.PORT, 10) || 3000;

  // Always reset to initial seed data on startup so each attempt starts completely clean
  const storeRepository = require('./src/repositories/storeRepository');
  const messageService = require('./src/services/messageService');
  storeRepository.reset();
  messageService.clearCache();

  app.listen(PORT, HOST, () => {
    console.log(`PingSpace Lite server listening on http://${HOST}:${PORT}`);
  });
}

module.exports = { createApp, app };
