import data from "./relatorio-data.json";
import "./Relatorio.css";

const dayNames = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];

const fmt = (n: number) => n.toLocaleString("pt-BR");
const pct = (n: number) => (n * 100).toFixed(1).replace(".", ",") + "%";
const dur = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m > 0 ? `${m}min ${sec}s` : `${sec}s`;
};
const fmtDate = (d: string) => `${d.slice(6, 8)}/${d.slice(4, 6)}`;

const channelExplain: Record<string, string> = {
  "Organic Search": "Pesquisaram no Google e acharam seu site nos resultados.",
  Direct: "Digitaram seu link no navegador ou clicaram em favorito.",
  "Organic Social": "Vieram das redes sociais (Instagram, Facebook) sem anuncio.",
  "Paid Search": "Clicaram em anuncio pago (Google Ads).",
  Referral: "Clicaram em link do seu site que estava em outro site.",
  Unassigned: "O Analytics nao conseguiu classificar a origem.",
};

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
  ["Desktop/Mobile/Tablet", "Computador / celular / tablet."],
  ["Navegador", "Programa usado: Chrome, Safari, Firefox, Edge."],
  ["Sistema Operacional", "Sistema do aparelho: Windows, Android, iOS, macOS."],
];

export default function Relatorio() {
  const ov = data.overview;
  const daily = data.daily;
  const totalCh = data.channels.reduce((s, c) => s + c.sessions, 0) || 1;
  const totalDev = data.devices.reduce((s, d) => s + d.sessions, 0) || 1;
  const dow = [...data.dayOfWeek].sort((a, b) => a.day - b.day);
  const maxDaily = Math.max(...daily.map((d) => d.users), 1);
  const maxDow = Math.max(...dow.map((d) => d.users), 1);
  const bestDow = dow.reduce((a, b) => (b.users > a.users ? b : a), dow[0]);
  const maxSource = Math.max(...data.sources.map((s) => s.sessions), 1);
  const maxBrowser = Math.max(...data.browsers.map((b) => b.sessions), 1);
  const maxOs = Math.max(...data.os.map((o) => o.sessions), 1);
  const cities = data.cities.filter((c) => c.name !== "(not set)");

  const topChannel = data.channels[0]?.name || "—";
  const topDevice = data.devices[0]?.name || "—";
  const returnRate = ov.users > 0 ? ((ov.users - ov.newUsers) / ov.users * 100).toFixed(0) : "0";
  const engageRate = ov.sessions > 0 ? ((ov.engaged / ov.sessions) * 100).toFixed(0) : "0";
  const avgPages = ov.sessions > 0 ? (ov.pageViews / ov.sessions).toFixed(1) : "0";
  const bestDay = daily.reduce((a, b) => (b.users > a.users ? b : a), daily[0]);

  const weeks: { label: string; users: number; sessions: number }[] = [];
  for (let i = 0; i < daily.length; i += 7) {
    const chunk = daily.slice(i, i + 7);
    weeks.push({
      label: `${fmtDate(chunk[0].date)} a ${fmtDate(chunk[chunk.length - 1].date)}`,
      users: chunk.reduce((s, d) => s + d.users, 0),
      sessions: chunk.reduce((s, d) => s + d.sessions, 0),
    });
  }

  const genDate = new Date(data.generatedAt).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const devColors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

  return (
    <div className="rel">
      {/* HEADER */}
      <header className="rel-header">
        <h1>Relatorio de Trafego</h1>
        <div className="rel-period">Periodo: ultimos 30 dias &nbsp;|&nbsp; Gerado em {genDate}</div>
      </header>

      {/* CARDS PRINCIPAIS */}
      <section className="rel-cards">
        <div className="rel-card rel-card--blue">
          <span className="rel-card__value">{fmt(ov.users)}</span>
          <span className="rel-card__label">Visitantes</span>
          <span className="rel-card__desc">Pessoas unicas que acessaram</span>
        </div>
        <div className="rel-card rel-card--green">
          <span className="rel-card__value">{fmt(ov.newUsers)}</span>
          <span className="rel-card__label">Novos visitantes</span>
          <span className="rel-card__desc">Primeira vez no site</span>
        </div>
        <div className="rel-card rel-card--orange">
          <span className="rel-card__value">{fmt(ov.pageViews)}</span>
          <span className="rel-card__label">Paginas vistas</span>
          <span className="rel-card__desc">Total de paginas abertas</span>
        </div>
      </section>

      <section className="rel-cards rel-cards--secondary">
        <div className="rel-card-s">
          <span className="rel-card-s__value">{fmt(ov.sessions)}</span>
          <span className="rel-card-s__label">Sessoes</span>
          <span className="rel-card-s__desc">Total de visitas</span>
        </div>
        <div className="rel-card-s">
          <span className="rel-card-s__value">{dur(ov.avgDuration)}</span>
          <span className="rel-card-s__label">Tempo medio</span>
          <span className="rel-card-s__desc">Permanencia no site</span>
        </div>
        <div className="rel-card-s">
          <span className="rel-card-s__value">{pct(ov.bounceRate)}</span>
          <span className="rel-card-s__label">Taxa de rejeicao</span>
          <span className="rel-card-s__desc">Saiu sem interagir</span>
        </div>
        <div className="rel-card-s">
          <span className="rel-card-s__value">{fmt(ov.engaged)}</span>
          <span className="rel-card-s__label">Engajadas</span>
          <span className="rel-card-s__desc">Sessoes com interacao</span>
        </div>
      </section>

      <p className="rel-caption">"Visitantes" sao pessoas unicas; "Sessoes" e o total de visitas (uma pessoa pode visitar mais de uma vez). "Taxa de rejeicao" = quantas saem sem interagir — quanto menor, melhor.</p>

      {/* RESUMO */}
      <section className="rel-section">
        <h2>Resumo do periodo</h2>
        <ul className="rel-bullets">
          <li>Seu site recebeu <strong>{fmt(ov.users)}</strong> visitantes, sendo <strong>{fmt(ov.newUsers)}</strong> novos ({pct(ov.newUsers / Math.max(ov.users, 1))} do total). {Number(returnRate) > 5 ? `${returnRate}% ja retornaram — isso indica interesse no conteudo.` : "A grande maioria esta conhecendo o site pela primeira vez."}</li>
          <li>Principal fonte de trafego: <strong>"{topChannel}"</strong>. {topChannel === "Organic Search" ? "Estao te encontrando pelo Google — o site esta indexado e aparecendo nas buscas." : topChannel === "Direct" ? "Digitam seu link direto — provavelmente do cartao, bio ou WhatsApp." : topChannel === "Organic Social" ? "Vem das redes sociais organicamente. Continue postando!" : ""}</li>
          <li>Cada visitante ve em media <strong>{avgPages}</strong> paginas e fica <strong>{dur(ov.avgDuration)}</strong>. {Number(engageRate) >= 50 ? `${engageRate}% das sessoes tiveram interacao — excelente!` : `${engageRate}% interagiram. Normal no inicio, tende a crescer.`}</li>
          <li>Melhor dia: <strong>{fmtDate(bestDay.date)}</strong> ({bestDay.users} visitantes). Maioria acessa por <strong>{topDevice}</strong>{topDevice === "mobile" ? " — bom que o site funcione bem no celular." : " — teste o site no celular tambem."}.</li>
        </ul>
        <p className="rel-caption">Resumo gerado automaticamente com base nos dados reais do Google Analytics.</p>
      </section>

      {/* GRAFICO DIARIO */}
      <section className="rel-section">
        <h2>Visitantes por dia</h2>
        <p className="rel-caption">Cada barra = quantas pessoas visitaram naquele dia. Picos podem indicar posts, compartilhamentos ou divulgacoes.</p>
        <div className="rel-chart">
          {daily.map((d) => (
            <div key={d.date} className="rel-chart__col" title={`${fmtDate(d.date)}: ${d.users} visitantes`}>
              <div className="rel-chart__bar" style={{ height: `${(d.users / maxDaily) * 100}%` }} />
              <span className="rel-chart__label">{fmtDate(d.date)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DIAS DA SEMANA */}
      <section className="rel-section">
        <h2>Melhores dias da semana</h2>
        <p className="rel-caption">Em quais dias seu site recebe mais visitas. Programe posts e divulgacoes nos dias de maior audiencia.</p>
        <div className="rel-bars">
          {dow.map((d) => (
            <div key={d.day} className="rel-bars__row">
              <span className="rel-bars__label">{dayNames[d.day]}</span>
              <div className="rel-bars__track">
                <div
                  className={`rel-bars__fill ${d.day === bestDow.day ? "rel-bars__fill--best" : ""}`}
                  style={{ width: `${(d.users / maxDow) * 100}%` }}
                />
              </div>
              <span className="rel-bars__val">{d.users}</span>
            </div>
          ))}
        </div>
        <p className="rel-caption">Melhor dia: {dayNames[bestDow.day]} ({bestDow.users} visitantes). Considere divulgar mais nesse dia.</p>
      </section>

      {/* RESUMO SEMANAL */}
      <section className="rel-section">
        <h2>Resumo semanal</h2>
        <p className="rel-caption">Evolucao do trafego semana a semana.</p>
        <table className="rel-table">
          <thead><tr><th>Semana</th><th>Visitantes</th><th>Sessoes</th></tr></thead>
          <tbody>
            {weeks.map((w, i) => (
              <tr key={i}><td>{w.label}</td><td>{fmt(w.users)}</td><td>{fmt(w.sessions)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* FONTES DE TRAFEGO */}
      <section className="rel-section">
        <h2>Fontes de trafego (Canais)</h2>
        <p className="rel-caption">De onde vem seus visitantes. Cada "canal" representa um tipo de origem.</p>
        <table className="rel-table">
          <thead><tr><th>Canal</th><th>Sessoes</th><th>% do total</th><th>Engajadas</th></tr></thead>
          <tbody>
            {data.channels.map((c) => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td>{fmt(c.sessions)}</td>
                <td>{((c.sessions / totalCh) * 100).toFixed(1)}%</td>
                <td>{fmt(c.engaged)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="rel-explain">
          <strong>O que significa cada canal:</strong>
          {data.channels.map((c) => (
            channelExplain[c.name] ? (
              <div key={c.name} className="rel-explain__item">
                <span className="rel-explain__dot" />
                <strong>{c.name}</strong> — {channelExplain[c.name]}
              </div>
            ) : null
          ))}
        </div>
      </section>

      {/* ORIGENS ESPECIFICAS */}
      <section className="rel-section">
        <h2>Origens especificas</h2>
        <p className="rel-caption">De onde exatamente vieram: qual rede, qual buscador, qual site.</p>
        <div className="rel-bars">
          {data.sources.map((s) => (
            <div key={s.name} className="rel-bars__row">
              <span className="rel-bars__label">{s.name}</span>
              <div className="rel-bars__track">
                <div className="rel-bars__fill rel-bars__fill--dark" style={{ width: `${(s.sessions / maxSource) * 100}%` }} />
              </div>
              <span className="rel-bars__val">{s.sessions}</span>
            </div>
          ))}
        </div>
        <p className="rel-caption">"ig" = Instagram, "(direct)" = link direto, "google" = busca organica.</p>
      </section>

      {/* DISPOSITIVOS */}
      <section className="rel-section">
        <h2>Perfil do publico</h2>
        <p className="rel-caption">Quem sao seus visitantes: aparelho, navegador, sistema e localizacao.</p>

        <h3>Dispositivos</h3>
        <div className="rel-devices">
          <div className="rel-devices__bar">
            {data.devices.map((d, i) => (
              <div
                key={d.name}
                className="rel-devices__seg"
                style={{ width: `${(d.sessions / totalDev) * 100}%`, background: devColors[i] }}
              >
                {(d.sessions / totalDev) > 0.08 && <span>{((d.sessions / totalDev) * 100).toFixed(0)}%</span>}
              </div>
            ))}
          </div>
          <div className="rel-devices__legend">
            {data.devices.map((d, i) => (
              <span key={d.name}><span className="rel-devices__dot" style={{ background: devColors[i] }} />{d.name} ({fmt(d.sessions)})</span>
            ))}
          </div>
        </div>
        <p className="rel-caption">Desktop = computador, Mobile = celular. Se maioria e mobile, o site precisa ser rapido no celular.</p>
      </section>

      {/* NAVEGADORES + SO */}
      <section className="rel-section">
        <div className="rel-two-col">
          <div>
            <h3>Navegadores</h3>
            <div className="rel-bars rel-bars--compact">
              {data.browsers.map((b) => (
                <div key={b.name} className="rel-bars__row">
                  <span className="rel-bars__label">{b.name}</span>
                  <div className="rel-bars__track">
                    <div className="rel-bars__fill rel-bars__fill--purple" style={{ width: `${(b.sessions / maxBrowser) * 100}%` }} />
                  </div>
                  <span className="rel-bars__val">{b.sessions}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Sistemas operacionais</h3>
            <div className="rel-bars rel-bars--compact">
              {data.os.map((o) => (
                <div key={o.name} className="rel-bars__row">
                  <span className="rel-bars__label">{o.name}</span>
                  <div className="rel-bars__track">
                    <div className="rel-bars__fill rel-bars__fill--green" style={{ width: `${(o.sessions / maxOs) * 100}%` }} />
                  </div>
                  <span className="rel-bars__val">{o.sessions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="rel-caption">Priorize testes no navegador e sistema que concentra mais trafego.</p>
      </section>

      {/* LOCALIZACAO */}
      <section className="rel-section">
        <h2>De onde acessam</h2>
        <p className="rel-caption">Cidades e paises dos visitantes. Mostra seu alcance geografico.</p>
        <div className="rel-two-col">
          <div>
            <h3>Paises</h3>
            <table className="rel-table">
              <thead><tr><th>Pais</th><th>Sessoes</th></tr></thead>
              <tbody>
                {data.countries.map((c) => (
                  <tr key={c.name}><td>{c.name}</td><td>{fmt(c.sessions)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3>Cidades</h3>
            <table className="rel-table">
              <thead><tr><th>Cidade</th><th>Visitantes</th></tr></thead>
              <tbody>
                {cities.map((c) => (
                  <tr key={c.name + c.country}><td>{c.name}</td><td>{fmt(c.users)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="rel-caption">Util para entender sua area de alcance. Se a maioria e local, foque divulgacao na regiao.</p>
      </section>

      {/* PAGINAS MAIS VISITADAS */}
      <section className="rel-section">
        <h2>Paginas mais visitadas</h2>
        <p className="rel-caption">Quais paginas recebem mais visualizacoes. "Views" = total de vezes que foi aberta.</p>
        <table className="rel-table">
          <thead><tr><th>Pagina</th><th>Views</th><th>Visitantes</th><th>Tempo medio</th></tr></thead>
          <tbody>
            {data.pages.map((p) => (
              <tr key={p.path}><td>{p.title || p.path}</td><td>{fmt(p.views)}</td><td>{fmt(p.users)}</td><td>{dur(p.avgTime)}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="rel-caption">Tempo medio alto = conteudo que prende. Se a pagina inicial tem views mas tempo baixo, o visitante pode nao estar encontrando o que procura.</p>
      </section>

      {/* GLOSSARIO */}
      <section className="rel-section rel-glossary">
        <h2>Glossario</h2>
        <p className="rel-caption">Explicacao de todos os termos deste relatorio.</p>
        <dl className="rel-glossary__list">
          {glossary.map(([term, desc]) => (
            <div key={term} className="rel-glossary__item">
              <dt>{term}</dt>
              <dd>{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="rel-footer">
        Gerado via Google Analytics Data API &nbsp;|&nbsp; {genDate}
      </footer>
    </div>
  );
}
