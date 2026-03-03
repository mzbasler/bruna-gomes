/**
 * Relatorio de Trafego GA4 — PDF Completo
 * Uso: node scripts/relatorio-ga4.mjs
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const OUTPUT_PATH = path.join(__dirname, "..", "relatorio-ga4.pdf");
const PROPERTY_ID = process.env.GA4_PROPERTY_ID || "521888166";
const START_DATE = process.env.GA4_START_DATE || "30daysAgo";
const END_DATE = process.env.GA4_END_DATE || "today";

const C = {
  dark: "#1B2A4A", accent: "#3B82F6", accentDark: "#2563EB",
  text: "#1E293B", muted: "#64748B", light: "#F1F5F9", white: "#FFFFFF",
  green: "#10B981", orange: "#F59E0B", purple: "#8B5CF6",
  line: "#E2E8F0", cardBg: "#F8FAFC",
};

const PW = 595.28;
const PH = 841.89;
const M = 44;
const CW = PW - M * 2;

if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error("\n  Arquivo de credenciais nao encontrado: " + CREDENTIALS_PATH + "\n");
  process.exit(1);
}

const client = new BetaAnalyticsDataClient({ keyFilename: CREDENTIALS_PATH });
const prop = `properties/${PROPERTY_ID}`;

// ============================================================
//  BUSCA DE DADOS
// ============================================================

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

async function fetchAll() {
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
  if (!o) return null;
  const v = (i) => Number(o.metricValues[i].value);

  return {
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
}

// ============================================================
//  HELPERS
// ============================================================

const fmt = (n) => n.toLocaleString("pt-BR");
const pct = (n) => (n * 100).toFixed(1).replace(".", ",") + "%";
const dur = (s) => { const m = Math.floor(s / 60); const sec = Math.round(s % 60); return m > 0 ? `${m}min ${sec}s` : `${sec}s`; };
const fmtDate = (d) => `${d.slice(6, 8)}/${d.slice(4, 6)}`;
const today = () => new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const dayNames = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];

// Mede altura de texto wrappado sem renderizar
function measureText(doc, str, font, size, width) {
  doc.font(font).fontSize(size);
  return doc.heightOfString(str, { width });
}

// ============================================================
//  COMPONENTES PDF (tudo com posicao absoluta, sem mover doc.y)
// ============================================================

function txt(doc, str, x, y, font, size, color) {
  doc.font(font).fontSize(size).fillColor(color);
  doc.text(str, x, y, { lineBreak: false });
  doc.y = 0; // reset para impedir auto-paginacao
}

function txtBox(doc, str, x, y, w, font, size, color) {
  doc.font(font).fontSize(size).fillColor(color);
  doc.text(str, x, y, { width: w });
  const endY = doc.y;
  doc.y = 0; // reset para impedir auto-paginacao
  return endY;
}

function line(doc, x1, y1, x2, y2, color, width) {
  doc.moveTo(x1, y1).lineTo(x2, y2).lineWidth(width || 0.5).strokeColor(color || C.line).stroke();
}

function footer(doc, num, total) {
  doc.moveTo(M, PH - 42).lineTo(PW - M, PH - 42).lineWidth(0.3).strokeColor(C.line).stroke();
  doc.font("Helvetica").fontSize(7).fillColor(C.muted);
  doc.text(`Pagina ${num} de ${total}  |  Gerado via Google Analytics Data API`, M, PH - 33, { lineBreak: false });
  doc.y = 0;
}

function sectionTitle(doc, y, title) {
  line(doc, M, y, PW - M, y);
  txt(doc, title, M, y + 8, "Helvetica-Bold", 13, C.dark);
  return y + 26;
}

function caption(doc, y, text) {
  const h = measureText(doc, text, "Helvetica-Oblique", 8, CW);
  doc.font("Helvetica-Oblique").fontSize(8).fillColor(C.muted);
  doc.text(text, M, y, { width: CW });
  doc.y = 0; // reset para impedir auto-paginacao
  return y + h + 4;
}

function table(doc, y, headers, rows, colPos) {
  doc.rect(M, y, CW, 18).fill(C.dark);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(C.white);
  headers.forEach((h, i) => { doc.text(h, M + colPos[i], y + 5, { lineBreak: false }); doc.y = 0; });
  y += 18;
  rows.forEach((row, ri) => {
    if (ri % 2 === 0) doc.rect(M, y, CW, 17).fill(C.light);
    doc.font("Helvetica").fontSize(8).fillColor(C.text);
    row.forEach((cell, ci) => { doc.text(String(cell), M + colPos[ci], y + 4, { lineBreak: false }); doc.y = 0; });
    y += 17;
  });
  return y + 4;
}

function hBars(doc, y, items, labelKey, valueKey, color) {
  const maxVal = Math.max(...items.map((d) => d[valueKey]), 1);
  const barMax = CW - 155;
  items.forEach((item) => {
    const bw = Math.max((item[valueKey] / maxVal) * barMax, 3);
    txt(doc, String(item[labelKey]).slice(0, 26), M, y + 2, "Helvetica", 8.5, C.text);
    doc.roundedRect(M + 110, y, bw, 14, 3).fill(color || C.accent);
    txt(doc, String(item[valueKey]), M + 115 + bw + 4, y + 2, "Helvetica-Bold", 8, C.muted);
    y += 20;
  });
  return y + 2;
}

// ============================================================
//  PAGINA 1 — CAPA + RESUMO EXECUTIVO
// ============================================================

function page1(doc, data, totalPages) {
  const ov = data.overview;

  // Header
  doc.rect(0, 0, PW, 130).fill(C.dark);
  txt(doc, "Relatorio de Trafego", M, 36, "Helvetica-Bold", 30, C.white);
  doc.roundedRect(M, 80, CW, 28, 6).fill("#243860");
  txt(doc, `Periodo: ultimos 30 dias  |  Gerado em ${today()}`, M + 14, 89, "Helvetica", 9.5, "#94A3B8");

  // Cards principais 3 colunas
  let y = 148;
  const gap = 12;
  const cw3 = (CW - gap * 2) / 3;
  const cards = [
    { label: "Visitantes", val: fmt(ov.users), desc: "Pessoas unicas que acessaram", color: C.accent },
    { label: "Novos visitantes", val: fmt(ov.newUsers), desc: "Primeira vez no site", color: C.green },
    { label: "Paginas vistas", val: fmt(ov.pageViews), desc: "Total de paginas abertas", color: C.orange },
  ];
  cards.forEach((c, i) => {
    const x = M + i * (cw3 + gap);
    doc.roundedRect(x, y, cw3, 60, 6).fill(C.cardBg);
    doc.rect(x, y + 6, 3, 48).fill(c.color);
    txt(doc, c.val, x + 14, y + 8, "Helvetica-Bold", 22, C.dark);
    txt(doc, c.label, x + 14, y + 34, "Helvetica-Bold", 8.5, C.text);
    txt(doc, c.desc, x + 14, y + 46, "Helvetica", 7, C.muted);
  });

  // Cards secundarios 4 colunas
  y += 72;
  const cw4 = (CW - gap * 3) / 4;
  const cards2 = [
    { label: "Sessoes", val: fmt(ov.sessions), desc: "Total de visitas" },
    { label: "Tempo medio", val: dur(ov.avgDuration), desc: "Permanencia no site" },
    { label: "Taxa de rejeicao", val: pct(ov.bounceRate), desc: "Saiu sem interagir" },
    { label: "Engajadas", val: fmt(ov.engaged), desc: "Sessoes com interacao" },
  ];
  cards2.forEach((c, i) => {
    const x = M + i * (cw4 + gap);
    doc.roundedRect(x, y, cw4, 48, 5).lineWidth(0.7).strokeColor(C.line).stroke();
    txt(doc, c.val, x + 10, y + 6, "Helvetica-Bold", 15, C.dark);
    txt(doc, c.label, x + 10, y + 24, "Helvetica-Bold", 7.5, C.text);
    txt(doc, c.desc, x + 10, y + 36, "Helvetica", 6.5, C.muted);
  });

  y += 58;
  y = caption(doc, y, "\"Visitantes\" sao pessoas unicas; \"Sessoes\" e o total de visitas (uma pessoa pode visitar mais de uma vez). \"Taxa de rejeicao\" = quantas saem sem interagir — quanto menor, melhor.");

  // Resumo executivo
  y = sectionTitle(doc, y + 2, "Resumo do periodo");

  const topChannel = data.channels[0]?.name || "—";
  const topDevice = data.devices[0]?.name || "—";
  const returnRate = ov.users > 0 ? ((ov.users - ov.newUsers) / ov.users * 100).toFixed(0) : 0;
  const engageRate = ov.sessions > 0 ? ((ov.engaged / ov.sessions) * 100).toFixed(0) : 0;
  const avgPages = ov.sessions > 0 ? (ov.pageViews / ov.sessions).toFixed(1) : "0";
  const bestDay = data.daily.reduce((a, b) => b.users > a.users ? b : a, data.daily[0] || { date: "00000000", users: 0 });

  const bullets = [
    `Seu site recebeu ${fmt(ov.users)} visitantes, sendo ${fmt(ov.newUsers)} novos (${pct(ov.newUsers / Math.max(ov.users, 1))} do total). ${Number(returnRate) > 5 ? `${returnRate}% ja retornaram — isso indica interesse no conteudo.` : "A grande maioria esta conhecendo o site pela primeira vez, esperado no primeiro mes."}`,
    `Principal fonte de trafego: "${topChannel}". ${topChannel === "Organic Search" ? "Estao te encontrando pelo Google — o site esta indexado e aparecendo nas buscas." : topChannel === "Direct" ? "Digitam seu link direto — provavelmente do cartao, bio ou WhatsApp." : topChannel === "Organic Social" ? "Vem das redes sociais organicamente. Continue postando!" : ""}`,
    `Cada visitante ve em media ${avgPages} paginas e fica ${dur(ov.avgDuration)}. ${Number(engageRate) >= 50 ? `${engageRate}% das sessoes tiveram interacao — excelente para um site novo!` : `${engageRate}% interagiram. Normal no inicio, tende a crescer.`}`,
    `Melhor dia: ${fmtDate(bestDay.date)} (${bestDay.users} visitantes). Maioria acessa por ${topDevice}${topDevice === "mobile" ? " — bom que o site funcione bem no celular." : " — teste o site no celular tambem."}.`,
  ];

  bullets.forEach((b) => {
    doc.rect(M + 2, y + 3, 4, 4).fill(C.accent);
    const h = measureText(doc, b, "Helvetica", 8.5, CW - 16);
    txtBox(doc, b, M + 14, y, CW - 14, "Helvetica", 8.5, C.text);
    y += h + 5;
  });

  y = caption(doc, y + 2, "Resumo gerado automaticamente com base nos dados reais do Google Analytics.");

  // Paginas mais visitadas (Top 5)
  y = sectionTitle(doc, y + 6, "Paginas mais visitadas");
  y = caption(doc, y, "Quais paginas recebem mais visualizacoes. \"Views\" = total de vezes que foi aberta.");

  const topPages = data.pages.slice(0, 5);
  y = table(doc, y,
    ["Pagina", "Views", "Visitantes", "Tempo medio"],
    topPages.map((p) => [(p.title || p.path).slice(0, 38), fmt(p.views), fmt(p.users), dur(p.avgTime)]),
    [8, CW * 0.52, CW * 0.67, CW * 0.82],
  );
  y = caption(doc, y, "Tempo medio alto = conteudo que prende. Se a pagina inicial tem views mas tempo baixo, o visitante pode nao estar encontrando o que procura.");

  footer(doc, 1, totalPages);
}

// ============================================================
//  PAGINA 2 — TRAFEGO DIARIO + DIAS DA SEMANA + SEMANAL
// ============================================================

function page2(doc, data, totalPages) {
  let y = M;

  y = sectionTitle(doc, y, "Visitantes por dia");
  y = caption(doc, y, "Cada barra = quantas pessoas visitaram naquele dia. Picos podem indicar posts, compartilhamentos ou divulgacoes.");

  const daily = data.daily;
  if (daily.length > 0) {
    const cX = M + 28, cW = CW - 36, cH = 110, cTop = y + 2;
    const maxVal = Math.max(...daily.map((d) => d.users), 1);

    for (let i = 0; i <= 4; i++) {
      const yy = cTop + (cH / 4) * i;
      line(doc, cX, yy, cX + cW, yy, C.line, 0.3);
      txt(doc, String(Math.round((maxVal / 4) * (4 - i))), M - 4, yy - 4, "Helvetica", 7, C.muted, { width: 28, align: "right" });
    }

    const bGap = 1, bW = Math.max((cW / daily.length) - bGap, 2);
    daily.forEach((d, i) => {
      const h = Math.max((d.users / maxVal) * cH, 1);
      doc.rect(cX + i * (bW + bGap), cTop + cH - h, bW, h).fill(C.accent);
    });

    const xIdx = [...new Set([0, Math.floor(daily.length / 4), Math.floor(daily.length / 2), Math.floor(daily.length * 3 / 4), daily.length - 1])];
    xIdx.filter((i) => daily[i]).forEach((idx) => {
      txt(doc, fmtDate(daily[idx].date), cX + idx * (bW + bGap) - 8, cTop + cH + 4, "Helvetica", 7, C.muted);
    });
    y = cTop + cH + 20;
  }

  // Dias da semana
  y = sectionTitle(doc, y, "Melhores dias da semana");
  y = caption(doc, y, "Em quais dias seu site recebe mais visitas. Programe posts e divulgacoes nos dias de maior audiencia.");

  const dow = data.dayOfWeek.sort((a, b) => a.day - b.day);
  if (dow.length > 0) {
    const maxDow = Math.max(...dow.map((d) => d.users), 1);
    const bestDow = dow.reduce((a, b) => b.users > a.users ? b : a, dow[0]);
    dow.forEach((d) => {
      const name = dayNames[d.day] || `Dia ${d.day}`;
      const bw = Math.max((d.users / maxDow) * (CW - 165), 3);
      txt(doc, name, M, y + 1, "Helvetica", 8.5, C.text);
      doc.roundedRect(M + 68, y, bw, 14, 3).fill(d.day === bestDow.day ? C.green : C.accent);
      txt(doc, `${d.users} visitantes`, M + 73 + bw + 4, y + 2, "Helvetica-Bold", 7.5, C.muted);
      y += 19;
    });
    y = caption(doc, y + 2, `Melhor dia: ${dayNames[bestDow.day]} (${bestDow.users} visitantes). Considere divulgar mais nesse dia.`);
  }

  // Resumo semanal
  y = sectionTitle(doc, y + 4, "Resumo semanal");
  y = caption(doc, y, "Evolucao do trafego semana a semana. Crescimento constante e sinal positivo.");

  const weeks = [];
  for (let i = 0; i < daily.length; i += 7) {
    const chunk = daily.slice(i, i + 7);
    weeks.push([
      `${fmtDate(chunk[0].date)} a ${fmtDate(chunk[chunk.length - 1].date)}`,
      fmt(chunk.reduce((s, d) => s + d.users, 0)),
      fmt(chunk.reduce((s, d) => s + d.sessions, 0)),
    ]);
  }
  y = table(doc, y, ["Semana", "Visitantes", "Sessoes"], weeks, [8, CW * 0.55, CW * 0.78]);

  footer(doc, 2, totalPages);
}

// ============================================================
//  PAGINA 3 — FONTES DE TRAFEGO
// ============================================================

function page3(doc, data, totalPages) {
  let y = M;

  y = sectionTitle(doc, y, "Fontes de trafego (Canais)");
  y = caption(doc, y, "De onde vem seus visitantes. Cada \"canal\" representa um tipo de origem.");

  const totalCh = data.channels.reduce((s, c) => s + c.sessions, 0) || 1;
  y = table(doc, y,
    ["Canal", "Sessoes", "% do total", "Engajadas"],
    data.channels.map((c) => [c.name, fmt(c.sessions), ((c.sessions / totalCh) * 100).toFixed(1) + "%", fmt(c.engaged)]),
    [8, CW * 0.45, CW * 0.62, CW * 0.8],
  );

  // Legenda dos canais
  y += 2;
  txt(doc, "O que significa cada canal:", M, y, "Helvetica-Bold", 9, C.dark);
  y += 15;

  const explains = [
    ["Organic Search", "Pesquisaram no Google e acharam seu site nos resultados."],
    ["Direct", "Digitaram seu link no navegador ou clicaram em favorito."],
    ["Organic Social", "Vieram das redes sociais (Instagram, Facebook) sem anuncio."],
    ["Paid Search", "Clicaram em anuncio pago (Google Ads)."],
    ["Referral", "Clicaram em link do seu site que estava em outro site."],
    ["Unassigned", "O Analytics nao conseguiu classificar a origem."],
  ];
  explains.forEach(([term, desc]) => {
    if (data.channels.some((c) => c.name === term) || term === "Referral") {
      doc.rect(M + 2, y + 2, 4, 4).fill(C.accent);
      txt(doc, term, M + 12, y, "Helvetica-Bold", 7.5, C.dark);
      txt(doc, desc, M + 100, y, "Helvetica", 7.5, C.muted);
      y += 14;
    }
  });

  // Origens especificas
  y = sectionTitle(doc, y + 8, "Origens especificas");
  y = caption(doc, y, "De onde exatamente vieram: qual rede, qual buscador, qual site. O que funciona para trazer visitas.");

  y = hBars(doc, y, data.sources, "name", "sessions", C.accentDark);
  y = caption(doc, y, "Se uma rede ou site aparece com bastante trafego, vale a pena continuar investindo nele. \"ig\" = Instagram, \"(direct)\" = link direto.");

  footer(doc, 3, totalPages);
}

// ============================================================
//  PAGINA 4 — PERFIL DO PUBLICO
// ============================================================

function page4(doc, data, totalPages) {
  let y = M;

  y = sectionTitle(doc, y, "Perfil do seu publico");
  y = caption(doc, y, "Quem sao seus visitantes: aparelho, navegador, sistema e localizacao.");

  // Dispositivos
  txt(doc, "Dispositivos", M, y, "Helvetica-Bold", 10, C.dark);
  y += 16;

  const totalDev = data.devices.reduce((s, d) => s + d.sessions, 0) || 1;
  const devCol = [C.accent, C.green, C.orange, C.purple];
  let bx = M;
  data.devices.forEach((d, i) => {
    const w = (d.sessions / totalDev) * CW;
    doc.rect(bx, y, w, 18).fill(devCol[i % devCol.length]);
    if (w > 40) txt(doc, ((d.sessions / totalDev) * 100).toFixed(0) + "%", bx + 5, y + 4, "Helvetica-Bold", 8, C.white);
    bx += w;
  });
  y += 24;
  let lx = M;
  data.devices.forEach((d, i) => {
    doc.rect(lx, y, 8, 8).fill(devCol[i % devCol.length]);
    txt(doc, `${d.name} (${fmt(d.sessions)} sessoes)`, lx + 12, y - 1, "Helvetica", 8, C.text);
    lx += CW / data.devices.length;
  });
  y += 14;
  y = caption(doc, y, "Desktop = computador, Mobile = celular, Tablet = tablet. Se maioria e mobile, o site precisa ser rapido no celular.");
  y += 4;

  // Navegadores + SO lado a lado
  const halfW = (CW - 12) / 2;

  txt(doc, "Navegadores", M, y, "Helvetica-Bold", 10, C.dark);
  txt(doc, "Sistemas operacionais", M + halfW + 12, y, "Helvetica-Bold", 10, C.dark);
  y += 16;

  const maxBrowser = Math.max(...data.browsers.map((b) => b.sessions), 1);
  const maxOs = Math.max(...data.os.map((o) => o.sessions), 1);
  const rows = Math.max(data.browsers.length, data.os.length);

  for (let i = 0; i < rows; i++) {
    // Browser
    if (data.browsers[i]) {
      const b = data.browsers[i];
      const bw = Math.max((b.sessions / maxBrowser) * (halfW - 100), 2);
      txt(doc, b.name.slice(0, 16), M, y + 1, "Helvetica", 8, C.text);
      doc.roundedRect(M + 70, y, bw, 12, 2).fill(C.purple);
      txt(doc, fmt(b.sessions), M + 74 + bw + 3, y + 1, "Helvetica-Bold", 7.5, C.muted);
    }
    // OS
    if (data.os[i]) {
      const o = data.os[i];
      const ox = M + halfW + 12;
      const bw = Math.max((o.sessions / maxOs) * (halfW - 100), 2);
      txt(doc, o.name.slice(0, 16), ox, y + 1, "Helvetica", 8, C.text);
      doc.roundedRect(ox + 70, y, bw, 12, 2).fill(C.green);
      txt(doc, fmt(o.sessions), ox + 74 + bw + 3, y + 1, "Helvetica-Bold", 7.5, C.muted);
    }
    y += 18;
  }
  y = caption(doc, y, "Navegador = programa usado (Chrome, Safari). Sistema = Windows, Android, iOS. Priorize testes no que concentra mais trafego.");
  y += 6;

  // Localizacao
  y = sectionTitle(doc, y, "De onde acessam");
  y = caption(doc, y, "Cidades e paises dos visitantes. Mostra seu alcance geografico.");

  // Paises e Cidades lado a lado
  txt(doc, "Paises", M, y, "Helvetica-Bold", 9, C.dark);
  txt(doc, "Cidades", M + halfW + 12, y, "Helvetica-Bold", 9, C.dark);
  y += 14;

  // Header paises
  doc.rect(M, y, halfW, 16).fill(C.dark);
  txt(doc, "Pais", M + 6, y + 4, "Helvetica-Bold", 7.5, C.white);
  txt(doc, "Sessoes", M + halfW - 50, y + 4, "Helvetica-Bold", 7.5, C.white);

  // Header cidades
  doc.rect(M + halfW + 12, y, halfW, 16).fill(C.dark);
  txt(doc, "Cidade", M + halfW + 18, y + 4, "Helvetica-Bold", 7.5, C.white);
  txt(doc, "Visitantes", M + CW - 44, y + 4, "Helvetica-Bold", 7.5, C.white);
  y += 16;

  const cities = data.cities.filter((c) => c.name !== "(not set)").slice(0, 7);
  const maxRows = Math.max(data.countries.length, cities.length);
  for (let i = 0; i < maxRows; i++) {
    if (i % 2 === 0) {
      doc.rect(M, y, halfW, 16).fill(C.light);
      doc.rect(M + halfW + 12, y, halfW, 16).fill(C.light);
    }
    if (data.countries[i]) {
      txt(doc, data.countries[i].name, M + 6, y + 4, "Helvetica", 8, C.text);
      txt(doc, fmt(data.countries[i].sessions), M + halfW - 50, y + 4, "Helvetica", 8, C.text);
    }
    if (cities[i]) {
      txt(doc, cities[i].name, M + halfW + 18, y + 4, "Helvetica", 8, C.text);
      txt(doc, fmt(cities[i].users), M + CW - 35, y + 4, "Helvetica", 8, C.text);
    }
    y += 16;
  }
  y = caption(doc, y + 4, "Util para entender sua area de alcance. Se a maioria e local, foque divulgacao na regiao.");

  footer(doc, 4, totalPages);
}

// ============================================================
//  PAGINA 5 — GLOSSARIO COMPLETO
// ============================================================

function page5(doc, data, totalPages) {
  let y = M;

  // Glossario
  y = sectionTitle(doc, y, "Glossario completo");
  y = caption(doc, y, "Explicacao de todos os termos deste relatorio.");
  y += 2;

  const glossary = [
    ["Visitantes", "Pessoas unicas que entraram no site. 5 visitas da mesma pessoa = 1 visitante."],
    ["Novos Visitantes", "Primeira vez no site neste periodo."],
    ["Sessoes", "Total de visitas. Manha + noite = 2 sessoes."],
    ["Pageviews", "Paginas abertas no total. 1 pessoa abrindo 3 paginas = 3 pageviews."],
    ["Duracao Media", "Tempo medio que ficam navegando antes de sair."],
    ["Taxa de Rejeicao", "% que entrou e saiu sem clicar em nada. Quanto MENOR, melhor."],
    ["Sessoes Engajadas", "Sessoes com interacao real: clicou, rolou, ficou +10s ou viu +1 pagina."],
    ["Organic Search", "Pesquisaram no Google e acharam o site."],
    ["Direct", "Digitaram o link ou clicaram em favorito."],
    ["Organic Social", "Vieram das redes sociais sem anuncio pago."],
    ["Paid Search", "Clicaram em anuncio pago (Google Ads)."],
    ["Referral", "Vieram de link em outro site."],
    ["Desktop/Mobile/Tablet", "Computador / celular / tablet."],
    ["Navegador", "Programa usado: Chrome, Safari, Firefox, Edge."],
    ["Sistema Operacional", "Sistema do aparelho: Windows, Android, iOS, macOS."],
  ];

  glossary.forEach(([term, desc]) => {
    txt(doc, term, M, y, "Helvetica-Bold", 8, C.dark);
    txt(doc, desc, M + 105, y, "Helvetica", 7.5, C.muted);
    y += 14;
  });

  footer(doc, 5, totalPages);
}

// ============================================================
//  MAIN
// ============================================================

async function main() {
  console.log("  Buscando dados do Google Analytics...\n");
  const data = await fetchAll();
  if (!data) { console.error("  Nenhum dado encontrado."); process.exit(1); }
  console.log("  Dados recebidos. Gerando PDF...\n");

  // margin: 0 para impedir PDFKit de criar paginas automaticamente
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    autoFirstPage: true,
  });
  const stream = fs.createWriteStream(OUTPUT_PATH);
  doc.pipe(stream);

  const total = 5;
  page1(doc, data, total);
  doc.addPage({ size: "A4", margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  page2(doc, data, total);
  doc.addPage({ size: "A4", margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  page3(doc, data, total);
  doc.addPage({ size: "A4", margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  page4(doc, data, total);
  doc.addPage({ size: "A4", margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  page5(doc, data, total);

  doc.end();
  await new Promise((resolve) => stream.on("finish", resolve));
  console.log(`  Relatorio gerado: ${OUTPUT_PATH}\n`);
}

main().catch((err) => { console.error("  Erro:", err.message); process.exit(1); });
