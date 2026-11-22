-- CreateTable
CREATE TABLE "business_systems" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_actions" (
    "id" UUID NOT NULL,
    "system_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_categories" (
    "id" UUID NOT NULL,
    "parent_id" UUID,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_system_authorizations" (
    "id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "system_id" UUID NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actor_system_authorizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_systems_code_key" ON "business_systems"("code");

-- CreateIndex
CREATE UNIQUE INDEX "business_actions_code_key" ON "business_actions"("code");

-- CreateIndex
CREATE INDEX "business_actions_system_id_idx" ON "business_actions"("system_id");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_categories_code_key" ON "ticket_categories"("code");

-- CreateIndex
CREATE INDEX "ticket_categories_parent_id_idx" ON "ticket_categories"("parent_id");

-- CreateIndex
CREATE INDEX "actor_system_authorizations_actor_id_idx" ON "actor_system_authorizations"("actor_id");

-- CreateIndex
CREATE INDEX "actor_system_authorizations_system_id_idx" ON "actor_system_authorizations"("system_id");

-- AddForeignKey
ALTER TABLE "business_actions" ADD CONSTRAINT "business_actions_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "business_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_categories" ADD CONSTRAINT "ticket_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "ticket_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_system_authorizations" ADD CONSTRAINT "actor_system_authorizations_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_system_authorizations" ADD CONSTRAINT "actor_system_authorizations_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "business_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
