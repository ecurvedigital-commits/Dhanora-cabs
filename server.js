/**
 * Universal Production Entry Point for Dhanora Cabs (Next.js)
 * Compatible with Hostinger Node.js, cPanel, Docker, and PM2.
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PORT = process.env.PORT || '3000';
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';
const webDir = path.join(__dirname, 'apps', 'web');

console.log(`[Dhanora Cabs] Starting server on port ${PORT} (host: ${HOSTNAME})...`);

// 1. Check if standalone server.js was generated during build
const standaloneDir = path.join(webDir, '.next', 'standalone');
const standaloneApp = path.join(standaloneDir, 'apps', 'web', 'server.js');
const standaloneRoot = path.join(standaloneDir, 'server.js');

let standaloneScript = null;
let standaloneCwd = webDir;

if (fs.existsSync(standaloneApp)) {
  standaloneScript = standaloneApp;
  standaloneCwd = path.dirname(standaloneApp);
} else if (fs.existsSync(standaloneRoot)) {
  standaloneScript = standaloneRoot;
  standaloneCwd = standaloneDir;
}

if (standaloneScript) {
  console.log(`[Dhanora Cabs] Launching Next.js standalone build from: ${standaloneScript}`);
  process.env.PORT = String(PORT);
  process.env.HOSTNAME = HOSTNAME;
  process.chdir(standaloneCwd);
  require(standaloneScript);
} else {
  // 2. Resolve Next CLI binary directly from apps/web workspace dependencies
  let nextBin = null;
  const candidatePaths = [
    webDir,
    path.join(__dirname, 'node_modules'),
    __dirname,
  ];

  for (const candidate of candidatePaths) {
    try {
      nextBin = require.resolve('next/dist/bin/next', { paths: [candidate] });
      if (nextBin) break;
    } catch (e) {
      // Continue checking
    }
  }

  if (!nextBin) {
    console.error('[Dhanora Cabs] CRITICAL: Could not find Next.js CLI binary in apps/web or workspace.');
    process.exit(1);
  }

  console.log(`[Dhanora Cabs] Launching Next.js production via ${nextBin} in ${webDir}...`);

  const child = spawn(
    process.execPath,
    [nextBin, 'start', '--port', String(PORT), '--hostname', HOSTNAME],
    {
      cwd: webDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: String(PORT),
        HOSTNAME: HOSTNAME,
        NODE_ENV: 'production',
      },
    }
  );

  child.on('error', (err) => {
    console.error('[Dhanora Cabs] Failed to spawn Next.js process:', err);
    process.exit(1);
  });

  child.on('exit', (code, signal) => {
    console.log(`[Dhanora Cabs] Process exited with code ${code} signal ${signal}`);
    process.exit(code || 0);
  });

  // Forward termination signals cleanly to child process
  ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((sig) => {
    process.on(sig, () => {
      if (!child.killed) {
        child.kill(sig);
      }
    });
  });
}
