// Порт, на котором будет запущено приложение
export const PORT = 5000;

// Настройки CORS
export const CORS_ORIGIN = "*";
export const CORS_METHODS = "GET,PUT,POST,DELETE";

// Конфиг базы данных Postgres
export const POSTGRES_HOST = "localhost";
export const POSTGRES_USER = 'postgres';
export const POSTGRES_DB = "test-task";
export const POSTGRES_PASSWORD = "root";
export const POSTGRES_PORT = 5432;

// Настройки токена доступа
export const JWT_SECRET_KEY = 'SECRET';
export const JWT_EXPIRES_IN = "30m"