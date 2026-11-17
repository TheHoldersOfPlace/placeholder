import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 
        depth_m,
        grid_latitude,
        grid_longitude,
        n_profiles,
        temperature_c_mean,
        salinity_psu_mean
      FROM heatmap_cells`
    );

    const rows = result.rows.map((row) => ({
      depth_m: row.depth_m,
      grid_latitude: row.grid_latitude,
      grid_longitude: row.grid_longitude,
      n_profiles: row.n_profiles,
      temperature_c_mean: row.temperature_c_mean,
      salinity_psu_mean: row.salinity_psu_mean,
    }));

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch data",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
