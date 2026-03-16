import { INestApplication } from '@nestjs/common';

export function corsConfig(app: INestApplication) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:57644',
    'http://localhost:4200',
    'https://housori.salimcode.site',
    'https://housori.onrender.com',
  ];
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, (origin as any) || true);
      } else {
        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  });
}
