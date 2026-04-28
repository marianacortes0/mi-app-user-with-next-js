const http = require('http');

// --- store en memoria ---
const users = [
  { id: 1, name: 'María López',  email: 'maria@sena.edu.co',  age: 25 },
  { id: 2, name: 'Carlos Pérez', email: 'carlos@sena.edu.co', age: 30 },
  { id: 3, name: 'Ana Gómez',    email: 'ana@sena.edu.co',    age: 22 },
];
let nextId = users.length + 1;

// --- helpers ---
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

// --- servidor ---
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const { method, url } = req;

  // GET /  o  GET /api
  if ((method === 'GET') && (url === '/' || url === '/api')) {
    return json(res, 200, { message: 'bienvenido a la api' });
  }

  // GET /api/users
  if (method === 'GET' && url === '/api/users') {
    return json(res, 200, { success: true, data: [...users].sort((a, b) => a.id - b.id), message: 'OK' });
  }

  // POST /api/users
  if (method === 'POST' && url === '/api/users') {
    const body = await readBody(req);
    if (!body.name?.trim() || !body.email?.trim() || !body.age) {
      return json(res, 400, { success: false, data: null, message: 'Todos los campos son requeridos.' });
    }
    const newUser = { id: nextId++, name: body.name.trim(), email: body.email.trim(), age: body.age };
    users.push(newUser);
    return json(res, 201, { success: true, data: newUser, message: 'Usuario creado.' });
  }

  // rutas con id: /api/users/:id
  const match = url.match(/^\/api\/users\/(\d+)$/);
  if (match) {
    const id = Number(match[1]);
    const index = users.findIndex((u) => u.id === id);

    if (method === 'GET') {
      if (index === -1) return json(res, 404, { success: false, data: null, message: 'Usuario no encontrado.' });
      return json(res, 200, { success: true, data: users[index], message: 'OK' });
    }

    if (method === 'PUT') {
      if (index === -1) return json(res, 404, { success: false, data: null, message: 'Usuario no encontrado.' });
      const body = await readBody(req);
      users[index] = { ...users[index], ...body };
      return json(res, 200, { success: true, data: users[index], message: 'Usuario actualizado.' });
    }

    if (method === 'DELETE') {
      if (index === -1) return json(res, 404, { success: false, data: null, message: 'Usuario no encontrado.' });
      users.splice(index, 1);
      return json(res, 200, { success: true, data: null, message: 'Usuario eliminado.' });
    }
  }

  json(res, 404, { message: 'Ruta no encontrada.' });
});

server.listen(3000, () => {
  console.log('Backend corriendo en http://localhost:3000');
});
