## Тестовое здание

[Тестовое](https://github.com/kisilya/test-tasks/tree/main/nodeJS) задание на вакансию nodejs backend

## Для того чтобы установить и проверить:  
Скачать себе репозиторий:  
```bash
git clone https://github.com/scream1ng-snake/test-task
```
Затем:  
```bash
npm install
```

## Перед тем как запустить  

В проекте я использовал Postgres.  
Создайте базу данных "test_task" через командную строку, либо через pg_admin.  
```bash
CREATE DATABASE test-task
```  
Затем сконфгурируйте файл ```consts.ts``` в src/consts/consts.ts  
```js
// Порт, на котором будет запущено приложение
export const PORT = 5000;

// Настройки CORS
export const CORS_ORIGIN = "*";
export const CORS_METHODS = "GET,PUT,POST,DELETE";

// Конфиг базы данных Postgres
export const POSTGRES_HOST = "localhost"; // Ваш хост базы данных
export const POSTGRES_USER = 'postgres'; // Ваш пользователь postgres
export const POSTGRES_DB = "test-task"; // Ваша база данных 
export const POSTGRES_PASSWORD = "root"; // Ваш пороль
export const POSTGRES_PORT = 5432;

// Настройки токена доступа
export const JWT_SECRET_KEY = 'SECRET';
export const JWT_EXPIRES_IN = "30m"
```

## Теперь можно запустить 

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

