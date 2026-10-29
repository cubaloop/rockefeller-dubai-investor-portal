const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3088;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    project: 'Christian A. Rockefeller Business Tower - Investor Portal',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config', (req, res) => {
  res.status(200).json({
    project: 'Christian A. Rockefeller Business Tower',
    developer: 'LMD (Continental Investments) & Christian A. Rockefeller',
    corridor: 'Sheikh Zayed Road · Downtown / Business Bay / DIFC',
    handover: 'Q2 2031',
    dldProjectNo: '4171',
    dubaiGradeAOccupancy: '99%',
    eoiDiscount: '5% - 7% Founding Discount (First 100 EOIs)'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Rockefeller Investor Portal running on port ${PORT}`);

  // 24/7 Mandatory Wake-Lock Pulse (every 5 minutes)
  const selfUrl = process.env.RENDER_EXTERNAL_URL
    ? `${process.env.RENDER_EXTERNAL_URL}/healthz`
    : `http://127.0.0.1:${PORT}/healthz`;

  setInterval(() => {
    const client = selfUrl.startsWith('https') ? https : http;
    client.get(selfUrl, (res) => {
      res.resume();
    }).on('error', () => {});
  }, 5 * 60 * 1000);
});
