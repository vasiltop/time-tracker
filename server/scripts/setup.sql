CREATE TABLE IF NOT EXISTS "projects"  (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "tasks"  (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "project_id" INTEGER NOT NULL,
    FOREIGN KEY ("project_id") REFERENCES "projects" ("id")
    
);

CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "role" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "time_entry" (
    "id" SERIAL PRIMARY KEY,
    "task_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "entry_date" DATE NOT NULL,
    "duration" INTERVAL NOT NULL,
    "comment" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("task_id") REFERENCES "tasks" ("id"),
    FOREIGN KEY ("user_id") REFERENCES "user" ("id")
);

