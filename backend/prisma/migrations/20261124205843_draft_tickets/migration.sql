-- AlterEnum
ALTER TYPE "ticket_status" ADD VALUE 'DRAFT';

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
