import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';
import path from 'path';
import {defineConfig} from 'vite';

function telemetryApiPlugin() {
  const pluginSessionId = `evo-session-${crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9)}`;

  return {
    name: 'telemetry-api-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/telemetry/live-scan', async (req: any, res: any) => {
        const { exec } = await import('child_process');
        const isWindows = process.platform === 'win32';
        const timestamp = new Date().toISOString();
        const sessionId = pluginSessionId;
        const requestId = crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

        if (!isWindows) {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error: 'AUTODETECTION_FAILED',
              platform: process.platform,
              hardware: null,
              timestamp,
              requestId,
            })
          );
          return;
        }

        exec(
          'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$c=Get-CimInstance Win32_Processor | Select-Object -First 1; $v=Get-CimInstance Win32_VideoController | Select-Object -First 1; $m=Get-CimInstance Win32_PhysicalMemory; $firstMem=$m | Select-Object -First 1; $cfgSpeed=if($firstMem.ConfiguredClockSpeed){$firstMem.ConfiguredClockSpeed}else{$firstMem.Speed}; [PSCustomObject]@{CPU=$c.Name; Cores=$c.NumberOfCores; Threads=$c.NumberOfLogicalProcessors; GPU=$v.Name; VRAM_GB=if($v.AdapterRAM){[math]::Round($v.AdapterRAM/1GB,1)}else{0}; RAM_GB=[math]::Round(($m | Measure-Object Capacity -Sum).Sum/1GB,1); RAM_Speed=$cfgSpeed; RAM_Spd_Speed=$firstMem.Speed; Provenance=\'SYSTEM_REPORTED\'} | ConvertTo-Json -Compress"',
          (error: any, stdout: string) => {
            res.setHeader('Content-Type', 'application/json');
            if (error || !stdout?.trim()) {
              res.statusCode = 503;
              res.end(
                JSON.stringify({
                  error: 'AUTODETECTION_FAILED',
                  platform: 'win32',
                  hardware: null,
                  timestamp,
                  requestId,
                })
              );
            } else {
              res.statusCode = 200;
              res.end(stdout.trim());
            }
          }
        );
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), telemetryApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '/components': path.resolve(__dirname, 'src/components'),
        'components': path.resolve(__dirname, 'src/components'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
