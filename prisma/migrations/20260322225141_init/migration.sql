-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "sheetRowIndex" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "pickupDate" TEXT NOT NULL,
    "pickupPersonName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "depositorName" TEXT NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "depositDate" TEXT NOT NULL,
    "depositTime" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncState" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_sheetRowIndex_key" ON "Order"("sheetRowIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Order_token_key" ON "Order"("token");
