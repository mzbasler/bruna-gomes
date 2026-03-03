/**
 * Busca dados do GA4 e salva em JSON para uso no React
 * Uso: node scripts/fetch-ga4-data.mjs
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const OUTPUT_PATH = path.join(__dirname, "..", "src", "relatorio-data.json");
const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "521888166";
const START_DATE = process.env.GA4_START_DATE || "30daysAgo";
const END_DATE = process.env.GA4_END_DATE || "today";

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error("\n  Arquivo de credenciais nao encontrado: " + CREDENTIALS_PATH + "\n");
  process.exit(1);
}

const client = new BetaAnalyticsDataClient({ keyFilename: CREDENTIALS_PATH });
const prop = `properties/${PROPERTY_ID}`;

async function query(metrics, dimensions, orderBy, limit) {
  const req = {
    property: prop,
    dateRanges: [{ startDate: START_DATE, endDate: END_DATE }],
    metrics: metrics.map((m) => ({ name: m })),
  };
  if (dimensions) req.dimensions = dimensions.map((d) => ({ name: d }));
  if (orderBy) req.orderBys = [orderBy];
  if (limit) req.limit = limit;
  const [res] = await client.runReport(req);
  return res.rows || [];
}

async function main() {
  console.log("  Buscando dados do Google Analytics...\n");

  const [overviewRows, dailyRows, pageRows, channelRows, deviceRows, cityRows, browserRows, osRows, countryRows, dayOfWeekRows, sourceRows] =
    await Promise.all([
      query(["activeUsers", "newUsers", "sessions", "screenPageViews", "averageSessionDuration", "bounceRate", "engagedSessions", "eventCount", "userEngagementDuration"]),
      query(["activeUsers", "sessions"], ["date"], { dimension: { dimensionName: "date" } }),
      query(["screenPageViews", "activeUsers", "averageSessionDuration"], ["pageTitle", "pagePath"], { metric: { metricName: "screenPageViews" }, desc: true }, 10),
      query(["sessions", "activeUsers", "engagedSessions"], ["sessionDefaultChannelGroup"], { metric: { metricName: "sessions" }, desc: true }, 8),
      query(["sessions", "activeUsers"], ["deviceCategory"], { metric: { metricName: "sessions" }, desc: true }),
      query(["activeUsers", "sessions"], ["city", "country"], { metric: { metricName: "activeUsers" }, desc: true }, 10),
      query(["sessions"], ["browser"], { metric: { metricName: "sessions" }, desc: true }, 5),
      query(["sessions"], ["operatingSystem"], { metric: { metricName: "sessions" }, desc: true }, 5),
      query(["sessions", "activeUsers"], ["country"], { metric: { metricName: "sessions" }, desc: true }, 5),
      query(["activeUsers", "sessions"], ["dayOfWeek"], { dimension: { dimensionName: "dayOfWeek" } }),
      query(["sessions", "activeUsers"], ["sessionSource"], { metric: { metricName: "sessions" }, desc: true }, 8),
    ]);

  const o = overviewRows[0];
  if (!o) { console.error("  Nenhum dado encontrado."); process.exit(1); }
  const v = (i) => Number(o.metricValues[i].value);

  const data = {
    generatedAt: new Date().toISOString(),
    overview: { users: v(0), newUsers: v(1), sessions: v(2), pageViews: v(3), avgDuration: v(4), bounceRate: v(5), engaged: v(6), events: v(7), engageDuration: v(8) },
    daily: dailyRows.map((r) => ({ date: r.dimensionValues[0].value, users: +r.metricValues[0].value, sessions: +r.metricValues[1].value })),
    pages: pageRows.map((r) => ({ title: r.dimensionValues[0].value, path: r.dimensionValues[1].value, views: +r.metricValues[0].value, users: +r.metricValues[1].value, avgTime: +r.metricValues[2].value })),
    channels: channelRows.map((r) => ({ name: r.dimensionValues[0].value, sessions: +r.metricValues[0].value, users: +r.metricValues[1].value, engaged: +r.metricValues[2].value })),
    devices: deviceRows.map((r) => ({ name: r.dimensionValues[0].value, sessions: +r.metricValues[0].value, users: +r.metricValues[1].value })),
    cities: cityRows.map((r) => ({ name: r.dimensionValues[0].value, country: r.dimensionValues[1].value, users: +r.metricValues[0].value, sessions: +r.metricValues[1].value })),
    browsers: browserRows.map((r) => ({ name: r.dimensionValues[0].value, sessions: +r.metricValues[0].value })),
    os: osRows.map((r) => ({ name: r.dimensionValues[0].value, sessions: +r.metricValues[0].value })),
    countries: countryRows.map((r) => ({ name: r.dimensionValues[0].value, sessions: +r.metricValues[0].value, users: +r.metricValues[1].value })),
    dayOfWeek: dayOfWeekRows.map((r) => ({ day: +r.dimensionValues[0].value, users: +r.metricValues[0].value, sessions: +r.metricValues[1].value })),
    sources: sourceRows.map((r) => ({ name: r.dimensionValues[0].value, sessions: +r.metricValues[0].value, users: +r.metricValues[1].value })),
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
  console.log(`  Dados salvos em: ${OUTPUT_PATH}\n`);
}

main().catch((err) => { console.error("  Erro:", err.message); process.exit(1); });
