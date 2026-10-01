import app from './app.js';
import { config } from './config/index.ts';

const server = app.listen(config.port, () => {
  console.log(`API escuchando en http://localhost:${config.port} [${config.env}]`);
});

function shutdown(signal) {
  console.log(`${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  console.error(err);
  shutdown('unhandledRejection');
});