/**
 * Gera PDF do relatorio React usando Puppeteer
 * Uso: node scripts/gerar-pdf.mjs
 *
 * Requer que o dev server esteja rodando (npm run dev)
 * ou passe a URL como argumento: node scripts/gerar-pdf.mjs http://localhost:5174
 */

import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, "..", "relatorio-ga4.pdf");

const BASE_URL = process.argv[2] || "http://localhost:5174";
const URL = `${BASE_URL}/relatorio.html`;

async function main() {
  console.log(`  Abrindo ${URL} ...\n`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 15000 });

  await page.pdf({
    path: OUTPUT,
    format: "A4",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
  });

  await browser.close();
  console.log(`  PDF gerado: ${OUTPUT}\n`);
}

main().catch((err) => {
  console.error("  Erro:", err.message);
  process.exit(1);
});
