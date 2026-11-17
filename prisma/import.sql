BEGIN;

\copy stations (profile_id, source_file, instrument, latitude, longitude, year, month, day, time_utc_hours, valid_levels, min_depth_m, max_depth_m, sound_speed_min_m_s, sound_speed_max_m_s) FROM '/home/nick/Desktop/ICS484/data/hawaii_stations.csv' WITH (FORMAT csv, HEADER true)

\copy measurements (profile_id, depth_m, pressure_dbar_est, temperature_c, salinity_psu, sound_speed_m_s, depth_qc, temperature_qc, salinity_qc, temperature_profile_qc, salinity_profile_qc) FROM PROGRAM 'tail -q -n +2 /home/nick/Desktop/ICS484/data/hawaii_profiles_part1.csv /home/nick/Desktop/ICS484/data/hawaii_profiles_part2.csv /home/nick/Desktop/ICS484/data/hawaii_profiles_part3.csv | cut -d, -f1,10-19' WITH (FORMAT csv)

\copy heatmap_cells (period, depth_m, grid_latitude, grid_longitude, grid_lat_min, grid_lon_min, n_profiles, temperature_c_mean, salinity_psu_mean, sound_speed_m_s_mean, instruments, sufficient_samples) FROM '/home/nick/Desktop/ICS484/data/hawaii_heatmap.csv' WITH (FORMAT csv, HEADER true)

\copy filter_report (source, stage, count) FROM '/home/nick/Desktop/ICS484/data/hawaii_filter_report.csv' WITH (FORMAT csv, HEADER true)

COMMIT;
