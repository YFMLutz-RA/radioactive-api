-- CreateTable
CREATE TABLE "public"."StationProfile" (
    "tenantId" TEXT NOT NULL,
    "streamUrl" TEXT,
    "timezone" TEXT,
    "locale" TEXT,

    CONSTRAINT "StationProfile_pkey" PRIMARY KEY ("tenantId")
);

-- CreateTable
CREATE TABLE "public"."FeatureFlag" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_tenantId_key_key" ON "public"."FeatureFlag"("tenantId", "key");

-- AddForeignKey
ALTER TABLE "public"."StationProfile" ADD CONSTRAINT "StationProfile_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FeatureFlag" ADD CONSTRAINT "FeatureFlag_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
