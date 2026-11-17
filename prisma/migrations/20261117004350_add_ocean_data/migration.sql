/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Location";

-- CreateTable
CREATE TABLE "stations" (
    "profile_id" INTEGER NOT NULL,
    "source_file" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "time_utc_hours" DOUBLE PRECISION NOT NULL,
    "valid_levels" INTEGER NOT NULL,
    "min_depth_m" DOUBLE PRECISION NOT NULL,
    "max_depth_m" DOUBLE PRECISION NOT NULL,
    "sound_speed_min_m_s" DOUBLE PRECISION NOT NULL,
    "sound_speed_max_m_s" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "stations_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "measurements" (
    "profile_id" INTEGER NOT NULL,
    "depth_m" DOUBLE PRECISION NOT NULL,
    "pressure_dbar_est" DOUBLE PRECISION NOT NULL,
    "temperature_c" DOUBLE PRECISION NOT NULL,
    "salinity_psu" DOUBLE PRECISION NOT NULL,
    "sound_speed_m_s" DOUBLE PRECISION NOT NULL,
    "depth_qc" SMALLINT NOT NULL,
    "temperature_qc" SMALLINT NOT NULL,
    "salinity_qc" SMALLINT NOT NULL,
    "temperature_profile_qc" SMALLINT NOT NULL,
    "salinity_profile_qc" SMALLINT NOT NULL,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("profile_id","depth_m")
);

-- CreateTable
CREATE TABLE "heatmap_cells" (
    "period" TEXT NOT NULL,
    "depth_m" DOUBLE PRECISION NOT NULL,
    "grid_latitude" DOUBLE PRECISION NOT NULL,
    "grid_longitude" DOUBLE PRECISION NOT NULL,
    "grid_lat_min" DOUBLE PRECISION NOT NULL,
    "grid_lon_min" DOUBLE PRECISION NOT NULL,
    "n_profiles" INTEGER NOT NULL,
    "temperature_c_mean" DOUBLE PRECISION NOT NULL,
    "salinity_psu_mean" DOUBLE PRECISION NOT NULL,
    "sound_speed_m_s_mean" DOUBLE PRECISION NOT NULL,
    "instruments" TEXT NOT NULL,
    "sufficient_samples" BOOLEAN NOT NULL,

    CONSTRAINT "heatmap_cells_pkey" PRIMARY KEY ("period","depth_m","grid_latitude","grid_longitude")
);

-- CreateTable
CREATE TABLE "filter_report" (
    "source" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "filter_report_pkey" PRIMARY KEY ("source","stage")
);

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "stations"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;
