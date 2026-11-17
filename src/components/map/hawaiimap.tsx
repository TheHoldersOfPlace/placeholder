"use client";

import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { Data, Layout } from "plotly.js-dist-min";

const FEATURES = {
  temperature: {
    label: "Temperature",
    units: "°C",
    heatmapColumn: "temperature_c_mean",
  },
  salinity: {
    label: "Salinity",
    units: "PSU",
    heatmapColumn: "salinity_psu_mean",
  },
  depth: {
    label: "Depth",
    units: "m",
    heatmapColumn: "depth_m",
  },
} as const;

const REQUIRED_COLUMNS = [
  "grid_latitude",
  "grid_longitude",
  "temperature_c_mean",
  "salinity_psu_mean",
  "depth_m",
  "n_profiles",
] as const;

type FeatureKey = keyof typeof FEATURES;
type HeatmapRow = Record<string, string>;

interface Cell {
  key: string;
  latitude: number;
  longitude: number;
  weightedValue: number;
  totalWeight: number;
  profileCount: number;
  minimumDepth: number;
  maximumDepth: number;
}

function asFiniteNumber(value: string | undefined): number | null {
  if (value == null || value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function colorScaleForFeature(featureKey: FeatureKey) {
  if (featureKey === "depth") return "Blues";
  if (featureKey === "salinity") return "Greens";
  return "Turbo";
}

export default function HawaiiMap() {
  const [rows, setRows] = useState<HeatmapRow[]>([]);
  const [featureKey, setFeatureKey] = useState<FeatureKey>("temperature");
  const [status, setStatus] = useState(
    "Choose a hawaii_heatmap.csv file to display the gridded map.",
  );
  const mapRef = useRef<HTMLDivElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<HeatmapRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(result) {
        if (result.errors.length > 0) {
          setRows([]);
          setStatus(`Could not read the CSV: ${result.errors[0].message}`);
          return;
        }

        const headers = result.meta.fields ?? [];
        const missingColumns = REQUIRED_COLUMNS.filter(
          (column) => !headers.includes(column),
        );
        if (missingColumns.length > 0) {
          setRows([]);
          setStatus(`CSV is missing required columns: ${missingColumns.join(", ")}`);
          return;
        }

        setRows(result.data);
        setStatus(`${result.data.length.toLocaleString()} rows loaded.`);
      },
      error(error) {
        setRows([]);
        setStatus(`Could not read the CSV: ${error.message}`);
      },
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function renderMap() {
      const Plotly = await import("plotly.js-dist-min");
      const map = mapRef.current;
      if (cancelled || !map) return;

      if (rows.length === 0) {
        Plotly.purge(map);
        return;
      }

      const feature = FEATURES[featureKey];
      const validRows = rows.filter(
        (row) =>
          asFiniteNumber(row.grid_latitude) != null &&
          asFiniteNumber(row.grid_longitude) != null &&
          asFiniteNumber(row[feature.heatmapColumn]) != null,
      );

      if (validRows.length === 0) {
        Plotly.purge(map);
        setStatus("No rows have valid coordinates and values for this feature.");
        return;
      }

      const cells = new Map<string, Cell>();
      for (const row of validRows) {
        const latitude = asFiniteNumber(row.grid_latitude)!;
        const longitude = asFiniteNumber(row.grid_longitude)!;
        const key = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
        if (!cells.has(key)) {
          cells.set(key, {
            key,
            latitude,
            longitude,
            weightedValue: 0,
            totalWeight: 0,
            profileCount: 0,
            minimumDepth: Infinity,
            maximumDepth: -Infinity,
          });
        }

        const cell = cells.get(key)!;
        const weight = Math.max(1, asFiniteNumber(row.n_profiles) ?? 1);
        cell.weightedValue +=
          asFiniteNumber(row[feature.heatmapColumn])! * weight;
        cell.totalWeight += weight;
        cell.profileCount += weight;

        const depth = asFiniteNumber(row.depth_m);
        if (depth != null) {
          cell.minimumDepth = Math.min(cell.minimumDepth, depth);
          cell.maximumDepth = Math.max(cell.maximumDepth, depth);
        }
      }

      const visibleCells = [...cells.values()];
      const values = visibleCells.map(
        (cell) => cell.weightedValue / cell.totalWeight,
      );

      const trace: Data = {
        type: "scattergeo",
        mode: "markers",
        lon: visibleCells.map((cell) => cell.longitude),
        lat: visibleCells.map((cell) => cell.latitude),
        customdata: visibleCells.map((cell) => cell.key),
        marker: {
          size: visibleCells.map((cell) =>
            Math.max(5, Math.min(13, 4 + Math.sqrt(cell.profileCount))),
          ),
          color: values,
          colorscale: colorScaleForFeature(featureKey),
          opacity: 0.8,
          colorbar: { title: { text: `${feature.label} (${feature.units})` } },
          line: { color: "white", width: 0.3 },
        },
        text: visibleCells.map((cell, index) => {
          const depthRange =
            Number.isFinite(cell.minimumDepth) &&
            Number.isFinite(cell.maximumDepth)
              ? `${cell.minimumDepth}-${cell.maximumDepth} m`
              : "unavailable";
          return (
            `Grid: ${cell.latitude}, ${cell.longitude}<br>` +
            `${feature.label}: ${values[index].toFixed(3)} ${feature.units}<br>` +
            `Depth range: ${depthRange}<br>` +
            `Profiles represented: ${cell.profileCount.toLocaleString()}`
          );
        }),
        hovertemplate: "%{text}<extra></extra>",
      };

      const layout: Partial<Layout> = {
        title: { text: `Hawaii Gridded ${feature.label}` },
        geo: {
          projection: { type: "equirectangular" },
          fitbounds: "locations",
          showland: true,
          landcolor: "#e8e8e8",
          showocean: true,
          oceancolor: "#d8eff8",
          showcountries: true,
        },
        margin: { t: 50, r: 20, b: 20, l: 20 },
      };

      await Plotly.react(map, [trace], layout, {
        responsive: true,
        displaylogo: false,
      });
    }

    void renderMap().catch((error: unknown) => {
      if (!cancelled) {
        const message =
          error instanceof Error ? error.message : "Unknown rendering error";
        setStatus(`Could not render the map: ${message}`);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [featureKey, rows]);

  useEffect(
    () => () => {
      const map = mapRef.current;
      if (map) {
        void import("plotly.js-dist-min").then((Plotly) => Plotly.purge(map));
      }
    },
    [],
  );

  return (
    <section className="min-h-screen w-full space-y-4 bg-white p-4 text-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Heatmap CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="max-w-full rounded-md border border-zinc-300 bg-white p-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Map feature
          <select
            value={featureKey}
            onChange={(event) => setFeatureKey(event.target.value as FeatureKey)}
            className="rounded-md border border-zinc-300 bg-white p-2 text-sm"
          >
            {Object.entries(FEATURES).map(([key, feature]) => (
              <option key={key} value={key}>
                {feature.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p role="status" className="text-sm text-zinc-600">
        {status}
      </p>
      <div
        ref={mapRef}
        aria-label="Interactive map of gridded Hawaii ocean data"
        className="min-h-[28rem] w-full rounded-md border border-zinc-200"
      />
    </section>
  );
}
