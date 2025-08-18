-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "websiteType" TEXT,
    "budget" TEXT,
    "goals" TEXT,
    "timeline" TEXT,
    "updates" BOOLEAN NOT NULL DEFAULT true
);
