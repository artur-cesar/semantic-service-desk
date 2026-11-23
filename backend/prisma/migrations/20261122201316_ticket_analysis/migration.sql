-- CreateEnum
CREATE TYPE "ticket_analysis_status" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "ticket_analysis_trigger" AS ENUM ('MANUAL', 'TICKET_CREATED', 'TICKET_UPDATED', 'ONTOLOGY_UPDATED');

-- CreateEnum
CREATE TYPE "capability_requirement_source" AS ENUM ('ONTOLOGY', 'POLICY', 'HUMAN');

-- CreateTable
CREATE TABLE "ticket_analyses" (
    "id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "status" "ticket_analysis_status" NOT NULL DEFAULT 'PENDING',
    "trigger" "ticket_analysis_trigger" NOT NULL DEFAULT 'MANUAL',
    "ontology_version" TEXT NOT NULL,
    "input_hash" TEXT NOT NULL,
    "input_snapshot" JSONB NOT NULL,
    "suggested_category_id" UUID,
    "classification_confidence" DOUBLE PRECISION,
    "classification_explanation" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_capability_requirements" (
    "id" UUID NOT NULL,
    "analysis_id" UUID NOT NULL,
    "capability_id" UUID NOT NULL,
    "source" "capability_requirement_source" NOT NULL,
    "explanation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_capability_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_evaluations" (
    "id" UUID NOT NULL,
    "analysis_id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "eligible" BOOLEAN NOT NULL,
    "rank" INTEGER,
    "suitability_score" DOUBLE PRECISION,
    "reasons" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actor_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_analyses_status_idx" ON "ticket_analyses"("status");

-- CreateIndex
CREATE INDEX "ticket_analyses_suggested_category_id_idx" ON "ticket_analyses"("suggested_category_id");

-- CreateIndex
CREATE INDEX "ticket_analyses_ticket_id_idx" ON "ticket_analyses"("ticket_id");

-- CreateIndex
CREATE INDEX "analysis_capability_requirements_capability_id_idx" ON "analysis_capability_requirements"("capability_id");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_capability_requirements_analysis_id_capability_id__key" ON "analysis_capability_requirements"("analysis_id", "capability_id", "source");

-- CreateIndex
CREATE INDEX "actor_evaluations_actor_id_idx" ON "actor_evaluations"("actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "actor_evaluations_analysis_id_actor_id_key" ON "actor_evaluations"("analysis_id", "actor_id");

-- AddForeignKey
ALTER TABLE "ticket_analyses" ADD CONSTRAINT "ticket_analyses_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_analyses" ADD CONSTRAINT "ticket_analyses_suggested_category_id_fkey" FOREIGN KEY ("suggested_category_id") REFERENCES "ticket_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_capability_requirements" ADD CONSTRAINT "analysis_capability_requirements_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "ticket_analyses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_capability_requirements" ADD CONSTRAINT "analysis_capability_requirements_capability_id_fkey" FOREIGN KEY ("capability_id") REFERENCES "capabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_evaluations" ADD CONSTRAINT "actor_evaluations_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "ticket_analyses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_evaluations" ADD CONSTRAINT "actor_evaluations_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
