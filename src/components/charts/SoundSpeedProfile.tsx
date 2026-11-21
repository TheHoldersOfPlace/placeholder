'use client';

// This tells Next.js that this component runs in the browser.
// We need this because Plotly creates interactive graphs.

import dynamic from 'next/dynamic';
import { memo } from 'react';

// This imports Plotly dynamically and prevents it from rendering on the server.
// Plotly needs the browser to work properly.
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
});

// This defines the structure of one measurement.
// Each measurement contains a depth in meters and a sound speed in meters per second.
export type SoundSpeedPoint = {
  depthM: number;
  soundSpeedMS: number;
};

// This tells the component to expect an array of sound speed measurements.
// Eventually, these measurements will come from our Prisma Postgres database.
type SoundSpeedProfileProps = {
  measurements: SoundSpeedPoint[];
};

// This is the main Sound Speed Profile component.
// It receives the measurements and uses them to create the graph.
function SoundSpeedProfile({
  measurements,
}: SoundSpeedProfileProps) {

  // First, we filter out any measurements that have invalid numerical values.
  // Then we sort the remaining measurements by depth, from shallowest to deepest.
  // This ensures the line connects the measurements in the correct order.
  const points = measurements
    .filter(
      (point) =>
        Number.isFinite(point.depthM) &&
        Number.isFinite(point.soundSpeedMS)
    )
    .sort((a, b) => a.depthM - b.depthM);

  return (
    // This creates the dark container surrounding our graph.
    // I adjusted its height, width, border, and background to fit the simulation page.
    <div className="h-[303px] w-full rounded-lg border border-white/20 bg-slate-950/90">

      {/* This displays the title at the top of the graph. */}
      <h2 className="p-3 text-center text-sm font-semibold text-white">
        Sound Speed Profile
      </h2>

      {/* If there are no valid measurements, we display a message instead of an empty graph. */}
      {/* Once we connect our database, this will be replaced by an actual profile. */}
      {points.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-300">
          No station profile loaded.
        </p>
      ) : (

        // This is the Plotly graph that displays the sound speed profile.
        <Plot
          data={[
            {
              // The X-axis represents sound speed in meters per second.
              x: points.map((point) => point.soundSpeedMS),

              // The Y-axis represents ocean depth in meters.
              y: points.map((point) => point.depthM),

              // We use a scatter plot with lines to connect the measurements.
              type: 'scatter',
              mode: 'lines',

              // These settings make the profile line cyan and 3 pixels thick.
              line: {
                color: '#22d3ee',
                width: 3,
              },

              // This controls the information displayed when hovering over the graph.
              // It shows the exact sound speed and depth of a measurement.
              hovertemplate:
                'Sound speed: %{x:.2f} m/s' +
                '<br>Depth: %{y:.1f} m' +
                '<extra></extra>',
            },
          ]}

          // These are the appearance and layout settings for the graph.
          layout={{
            // This allows Plotly to adjust the graph to its container.
            autosize: true,

            // These make the graph background transparent.
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',

            // This makes the graph's text light-colored so it is visible.
            font: { color: '#e2e8f0' },

            // These control the spacing around the graph.
            margin: { l: 65, r: 15, t: 65, b: 20 },

            // We don't need a legend because there is only one line.
            showlegend: false,

            // This configures the X-axis with a title and grid lines.
            xaxis: {
              title: { text: 'Sound Speed (m/s)' },
              side: 'top',
              gridcolor: '#334155',
            },

            // This configures the Y-axis to represent ocean depth.
            // Reversing the axis puts the surface at the top
            // and deeper measurements toward the bottom.
            yaxis: {
              title: { text: 'Depth (m)' },
              autorange: 'reversed',
              gridcolor: '#334155',
            },
          }}

          // These settings make the graph responsive and hide Plotly's toolbar.
          config={{
            responsive: true,
            displayModeBar: false,
          }}

          // I adjusted the graph's dimensions to fit inside the SSP container.
          style={{ width: '100%', height: '248px' }}

        />
      )}
    </div>
  );
}

// memo helps prevent unnecessary re-rendering when the component's props haven't changed.
export default memo(SoundSpeedProfile);