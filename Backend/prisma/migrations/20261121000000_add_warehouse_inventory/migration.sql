CREATE TYPE "warehouse_transaction_type" AS ENUM ('inbound', 'outbound');

CREATE TABLE "warehouse_transactions" (
    "id" SERIAL NOT NULL,
    "product_type" VARCHAR(100) NOT NULL,
    "transaction_type" "warehouse_transaction_type" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouse_transactions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "warehouse_transactions_product_type_created_at_idx"
ON "warehouse_transactions"("product_type", "created_at");
