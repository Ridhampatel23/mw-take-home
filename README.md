```markdown
# 🧩 MemberWorks — People & Programs Management

A full-stack assignment built with **Angular (Nx Monorepo)** and **.NET 9 Web API**.  
Manage people, assign them to programs, and explore modern, clean architecture.

---

## 🚀 Tech Stack

| Layer | Tech | Purpose |
|-------|------|----------|
| Frontend | Angular 18 (Nx Monorepo) | Component-driven UI + Material Design |
| Backend | ASP.NET Core 9 | REST API for People & Programs |
| ORM | Entity Framework Core | PostgreSQL integration |
| Database | PostgreSQL | Persistent storage |
| Tooling | Nx, Serilog, Swagger, FluentValidation | Developer experience & observability |

---

## 🧠 Project Overview

````
```
memberworks/
├── frontend/   → Nx workspace (Angular app + feature libs)
├── backend/    → .NET Web API (People + Programs)
└── README.md   → You are here!
```
````

### 🧩 Features

✅ CRUD for **People** and **Programs**  
✅ Assign/remove people to/from programs  
✅ Strong typing (DTOs, interfaces, models)  
✅ Swagger API docs + validation  
✅ Angular Material UI + responsive dialogs  
✅ Clean architecture, modular Nx design  

---

## ⚙️ Quick Start

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<yourusername>/memberworks.git
cd memberworks
````

### 2️⃣ Start the backend

```bash
cd backend
dotnet restore
dotnet ef database update   # creates local database if using EF migrations
dotnet run
```

Also add a docker-compose.yml in backend and paste this for easy PostgreSQL Image setup-
```
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: YOUR_USERNAME
      POSTGRES_PASSWORD: YOUR_PASSWORD
      POSTGRES_DB: DB_NAME
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]
volumes: { pgdata: {} }
```

And then run - 
```
docker compose up -d
```

The API will start on **[http://localhost:5203](http://localhost:5203)**

---

### 3️⃣ Start the frontend

```bash
cd ../frontend
npm install
npx nx serve mw-frontend
```

Frontend runs on **[http://localhost:4200](http://localhost:4200)**

---

### 4️⃣ Open the app

Visit → [http://localhost:4200](http://localhost:4200)

You can:

* View all people
* Create or edit people
* View and create programs
* Assign people to programs

---

## 🌐 API Overview

Base URL: `http://localhost:5203`

| Resource | Method | Endpoint                           | Description                    |
| -------- | ------ | ---------------------------------- | ------------------------------ |
| People   | GET    | `/people`                          | Get all people                 |
| People   | POST   | `/people`                          | Create person                  |
| People   | PUT    | `/people/{id}`                     | Update person                  |
| People   | DELETE | `/people/{id}`                     | Delete person                  |
| Programs | GET    | `/programs`                        | Get all programs               |
| Programs | POST   | `/programs`                        | Create program                 |
| Programs | PUT    | `/programs/{id}`                   | Update program                 |
| Programs | POST   | `/programs/{id}/assign`            | Assign people                  |
| Programs | DELETE | `/programs/{id}/remove/{personId}` | Remove a person from a program |

Swagger UI available at:
👉 [http://localhost:5203/swagger](http://localhost:5203/swagger)

---

## ⚙️ Configuration

### 🗃️ Backend

* Connection strings are read from `appsettings.json` or environment variables.
* You can create a `.env` file in `/backend` for local credentials:

  ```
  DATABASE_URL=Host=localhost;Port=5432;Database=memberworks;Username=postgres;Password=postgres
  ```
* The `DesignTimeDbContextFactory` automatically reads these settings.

### 🌍 Frontend

* API URL comes from `environment.ts` (no hardcoded URLs).
* To change:

  ```ts
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:5203'
  };
  ```

---

## 🧱 Project Structure (Frontend)

```
apps/mw-frontend/
 ├── people/          → People feature (list, dialog)
 ├── programs/        → Programs feature (list, details, dialog)
 ├── src/app/services → Data + store services
 └── src/app/models.ts
```

### Clean architecture pattern:

* `DataService` handles HTTP calls
* `StoreService` manages local state
* Components bind to stores directly (signal-based)

---

## 🧰 Developer Notes

* All REST endpoints are documented with simple XML comments.
* Angular services include JSDoc comments for IntelliSense.
* Proper `.gitignore` ensures secrets and build artifacts aren’t committed. (exception: Psql connection String as local anyways)
* Backend logging via **Serilog**.
* CORS enabled for local dev.

---

## 🧩 My Approach

The goal was to deliver a **maintainable, scalable, and readable** full-stack app with consistent structure between frontend and backend.

**Focus areas:**

1. 🧠 **Clarity first** – predictable REST routes and component names.
2. 🧩 **Consistency** – parallel CRUD logic in frontend & backend.
3. ⚙️ **Scalability** – Nx workspace and modular service layers.
4. 💡 **DX** – Swagger, validation, and inline docs for a smooth experience.


---

## 🧑‍💻 Author

**Ridham Patel**


---

## 🏁 License

This project is for demonstration and educational purposes.
