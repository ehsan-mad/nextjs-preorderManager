-- CreateTable
CREATE TABLE "Preorder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "productCount" INTEGER NOT NULL DEFAULT 0,
    "preorderMode" TEXT DEFAULT 'standard',
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
