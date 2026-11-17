
'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
});

export type SoundSpeedPoint = {
  depthM: number;
  soundSpeedMS: number;
};

type SoundSpeedProfileProps = {
  measurements: SoundSpeedPoint[];
};

function SoundSpeedProfile({
  measurements,
}: SoundSpeedProfileProps) {
  const points = measurements
    .filter(
      (point) =>
        Number.isFinite(point.depthM) &&
        Number.isFinite(point.soundSpeedMS)
    )
    .sort((a, b) => a.depthM - b.depthM);

  return (
    <div className="h-[353px] w-full rounded-lg border border-white/20 bg-slate-950/90">
      <h2 className="p-3 text-center text-sm font-semibold text-white">
        Sound Speed Profile
      </h2>

      {points.length === 0 ? (
        <p className="p-4 text-center text-sm text-gray-300">
          No station profile loaded.
        </p>
      ) : (
        <Plot
          data={[
            {
              x: points.map((point) => point.soundSpeedMS),
              y: points.map((point) => point.depthM),
              type: 'scatter',
              mode: 'lines',
              line: {
                color: '#22d3ee',
                width: 3,
              },
              hovertemplate:
                'Sound speed: %{x:.2f} m/s' +
                '<br>Depth: %{y:.1f} m' +
                '<extra></extra>',
            },
          ]}
          layout={{
            autosize: true,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#e2e8f0' },
            margin: { l: 65, r: 15, t: 65, b: 20 },
            showlegend: false,
            xaxis: {
              title: { text: 'Sound Speed (m/s)' },
              side: 'top',
              gridcolor: '#334155',
            },
            yaxis: {
              title: { text: 'Depth (m)' },
              autorange: 'reversed',
              gridcolor: '#334155',
            },
          }}
          config={{
            responsive: true,
            displayModeBar: false,
          }}
          style={{ width: '100%', height: '298px' }}

        />
      )}
    </div>
  );
}

export default memo(SoundSpeedProfile);