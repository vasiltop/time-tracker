CREATE TABLE IF NOT EXISTS "project"  (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "task"  (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "project_id" INTEGER NOT NULL,
    FOREIGN KEY ("project_id") REFERENCES "project" ("id")
    
);

CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "admin" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "time_entry" (
    "id" SERIAL PRIMARY KEY,
    "task_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "duration" INTEGER NOT NULL,
    "comment" VARCHAR(255) NOT NULL,
    "admin_message" VARCHAR(255) NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY ("task_id") REFERENCES "task" ("id"),
    FOREIGN KEY ("user_id") REFERENCES "user" ("id")
);

