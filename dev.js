const args = process.argv.slice(2);
const portIndex = args.indexOf('-p');

if (portIndex !== -1) {
  const port = args[portIndex + 1] || '3001';
  const { spawn } = require('child_process');

  // Arranca el backend en 3000
  require('./server.js');

  // Arranca el frontend en el puerto indicado
  const child = spawn('npx', ['next', 'dev', '--port', port], {
    stdio: 'inherit',
    shell: true,
  });
  child.on('error', (err) => {
    console.error('Error al iniciar Next.js:', err);
    process.exit(1);
  });
} else {
  require('./server.js');
}
