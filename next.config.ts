import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
      const userApiTarget = process.env.USERS_API_TARGET ?? "http://localhost:3000/api/users";
      return [
          {
              source: "/api/users", //Ruta que el frontend usará para comunicarse con el backend
              destination: userApiTarget, //Destino real del backend, se obtiene de las variables de entorno o se usa un valor por defecto
          },
          {
            source: "/api/users/:path*", //Ruta para manejar subrutas como /api/users/1, /api/users/2, etc.
            destination: `${userApiTarget}/:path*`, //Redirige a la misma ruta en el backend
          }
      ];  
  },
};

export default nextConfig;
