(async function renderIntegrationPage(){
  const root = document.getElementById("page-root");

  function esc(value){
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function attr(value){
    return esc(value).replace(/`/g, "&#96;");
  }

  function showError(message){
    root.innerHTML = `<main style="font-family:system-ui,sans-serif;padding:32px;max-width:760px;margin:auto"><h1>Content could not be loaded</h1><p>${esc(message)}</p></main>`;
  }

  function sectionHead(section){
    return `
      <div class="section-head">
        <div>
          <h2>${esc(section.title)}</h2>
          ${section.description ? `<p>${esc(section.description)}</p>` : ""}
        </div>
      </div>
    `;
  }

  function richBlocks(blocks){
    return (blocks || []).map(block => {
      if (block.type === "list") {
        return `<ul>${block.items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
      }
      if (block.type === "link") {
        return `<p><a href="${attr(block.href)}" target="_blank" rel="noopener noreferrer">${esc(block.label)}</a></p>`;
      }
      return `<p>${esc(block.text)}</p>`;
    }).join("");
  }

  function renderHeader(page){
    return `
      <header class="site">
        <div class="wrap nav-row">
          <a href="#top" class="brand">
            <img class="brand-logo" src="${attr(page.assets.logo)}" alt="Smart Food Safe">
          </a>
          <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" id="navToggle">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M0 1H16M0 6H16M0 11H16" stroke="#16211D" stroke-width="1.5"/></svg>
          </button>
          <nav class="links" id="navLinks">
            ${page.navigation.links.map(link => `<a href="${attr(link.href)}"${link.style === "primary" ? ' class="nav-cta"' : ""}>${esc(link.label)}</a>`).join("")}
          </nav>
        </div>
      </header>
    `;
  }

  function renderHero(hero){
    return `
      <section class="hero" style="border-bottom:1px solid var(--line); padding-top:76px;">
        <div class="wrap hero-grid">
          <div>
            <h1>${esc(hero.title)}</h1>
            <p class="lede">${esc(hero.description)}</p>
            <div class="hero-stats">
              ${hero.stats.map(stat => `<div class="stat"><b>${esc(stat.value)}</b><span>${esc(stat.label)}</span></div>`).join("")}
            </div>
          </div>
          <div class="diagram-box" role="img" aria-label="${attr(hero.diagram.ariaLabel)}">
            <svg viewBox="0 0 460 320" xmlns="http://www.w3.org/2000/svg">
              <path class="flow-line" d="M100 60 C 180 60, 200 140, 260 155" stroke="#E88300" stroke-width="1.6" fill="none"/>
              <path class="flow-line d2" d="M100 160 C 180 160, 200 160, 260 160" stroke="#E88300" stroke-width="1.6" fill="none"/>
              <path class="flow-line d3" d="M100 260 C 180 260, 200 180, 260 165" stroke="#E88300" stroke-width="1.6" fill="none"/>
              <g font-family="Plus Jakarta Sans" font-size="11.5" fill="#0B163F">
                ${hero.diagram.sources.map((source, index) => {
                  const y = 40 + index * 100;
                  return `<rect x="10" y="${y}" width="90" height="40" rx="4" fill="#ECF0E9" stroke="#BFC9BC"/>
                    <text x="55" y="${y + 16}" text-anchor="middle" font-weight="600">${esc(source.title)}</text>
                    <text x="55" y="${y + 30}" text-anchor="middle" fill="#7C8A82" font-size="10">${esc(source.subtitle)}</text>`;
                }).join("")}
              </g>
              <rect x="260" y="120" width="150" height="80" rx="6" fill="#0B163F"/>
              <text x="335" y="155" text-anchor="middle" fill="#fff" font-family="Poppins" font-weight="600" font-size="15">${esc(hero.diagram.target.title)}</text>
              <text x="335" y="174" text-anchor="middle" fill="#DCE5F5" font-family="Plus Jakarta Sans" font-size="10.5">${esc(hero.diagram.target.subtitle)}</text>
            </svg>
          </div>
        </div>
      </section>
    `;
  }

  function renderIntegrationCard(item){
    const arrow = item.direction.bidirectional ? "⇄" : "→";
    return `
      <article class="card">
        <div class="card-top">
          <div class="card-title-group">
            <h3>${esc(item.title)}</h3>
            <span class="module-tag">${esc(item.module)}</span>
          </div>
        </div>
        <p class="card-desc">${esc(item.description)}</p>
        <div class="card-meta">
          <span class="meta-label">Data flow</span>
          <span class="meta-value"><span class="flow-badge">${esc(item.direction.from)} <span class="arrow">${arrow}</span> ${esc(item.direction.to)}</span></span>
          <span class="meta-label">Channels</span>
          <span class="meta-value"><div class="chip-row">${item.channels.map(channel => `<span class="chip">${esc(channel)}</span>`).join("")}</div></span>
          <span class="meta-label">Example data</span>
          <span class="meta-value"><ul class="datapoints">${item.dataPoints.map(point => `<li>${esc(point)}</li>`).join("")}</ul></span>
        </div>
        ${item.questionnaire ? `
          <details class="questionnaire">
            <summary>Implementation questionnaire &amp; answers</summary>
            <div class="questionnaire-list">
              ${item.questionnaire.map((entry, index) => `
                <div class="questionnaire-item">
                  <div class="questionnaire-question">${index + 1}. ${esc(entry.question)}</div>
                  <div class="questionnaire-answer">${richBlocks(entry.answer)}</div>
                </div>
              `).join("")}
            </div>
          </details>
        ` : ""}
      </article>
    `;
  }

  function renderPage(page){
    return `
      <div class="page-loader" id="pageLoader" role="status" aria-label="Loading Smart Food Safe">
        <img src="${attr(page.assets.loader)}" alt="">
      </div>
      ${renderHeader(page)}
      <main id="top">
        ${renderHero(page.hero)}
        <section id="${attr(page.overview.id)}">
          <div class="wrap">
            ${sectionHead(page.overview)}
            <div class="overview-grid" id="overviewGrid"></div>
          </div>
        </section>
        <section id="${attr(page.directory.id)}">
          <div class="wrap">
            ${sectionHead(page.directory)}
            <div class="filters" id="filterRow"></div>
            <div class="integration-list" id="integrationList"></div>
          </div>
        </section>
        <section id="${attr(page.glossary.id)}">
          <div class="wrap">
            ${sectionHead(page.glossary)}
            <dl class="glossary-grid">
              ${page.glossary.items.map(item => `<div class="glossary-item"><dt>${esc(item.term)}</dt><dd>${esc(item.definition)}</dd></div>`).join("")}
            </dl>
          </div>
        </section>
        <section id="${attr(page.faq.id)}">
          <div class="wrap">
            ${sectionHead(page.faq)}
            <div class="faq-list">
              ${page.faq.items.map(item => `<details class="faq-item"><summary>${esc(item.question)}</summary><div class="faq-answer">${esc(item.answer)}</div></details>`).join("")}
            </div>
          </div>
        </section>
        <section class="cta-section" id="${attr(page.cta.id)}">
          <div class="wrap">
            <div class="cta-box">
              <div>
                <h2 style="font-size:26px; margin-bottom:10px;">${esc(page.cta.title)}</h2>
                <p>${esc(page.cta.description)}</p>
              </div>
              <a href="${attr(page.cta.button.href)}" class="btn-primary">${esc(page.cta.button.label)}</a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div class="wrap footer-row">
          <img class="footer-logo" src="${attr(page.assets.logo)}" alt="Smart Food Safe">
          <span>${esc(page.footer.notice)}</span>
          <div class="footer-links">${page.footer.links.map(link => `<a href="${attr(link.href)}">${esc(link.label)}</a>`).join("")}</div>
        </div>
      </footer>
    `;
  }

  function bindIntegrations(page){
    const categories = page.categories || [];
    const integrations = page.integrations || [];

    function setFilter(active){
      const row = document.getElementById("filterRow");
      const list = document.getElementById("integrationList");
      if (!row || !list) return;
      row.innerHTML = [
        `<button class="filter-btn${active === "all" ? " active" : ""}" data-filter="all">All</button>`,
        ...categories.map(cat => `<button class="filter-btn${active === cat.id ? " active" : ""}" data-filter="${attr(cat.id)}">${esc(cat.label)}</button>`)
      ].join("");
      row.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));
      list.innerHTML = (active === "all" ? integrations : integrations.filter(item => item.category === active)).map(renderIntegrationCard).join("");
    }

    const overview = document.getElementById("overviewGrid");
    if (overview) {
      overview.innerHTML = categories.map((cat, index) => {
        const count = integrations.filter(item => item.category === cat.id).length;
        return `<a class="overview-card" href="#integrations" data-jump="${attr(cat.id)}"><span class="n">${String(index + 1).padStart(2, "0")} · ${count} connection${count === 1 ? "" : "s"}</span><h3>${esc(cat.label)}</h3><p>${esc(cat.blurb)}</p></a>`;
      }).join("");
      overview.querySelectorAll("[data-jump]").forEach(card => {
        card.addEventListener("click", event => {
          event.preventDefault();
          setFilter(card.dataset.jump);
          document.getElementById("integrations").scrollIntoView({ behavior: "smooth" });
        });
      });
    }
    setFilter("all");
  }

  function bindCommonInteractions(){
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function(){
        const open = navLinks.classList.toggle("open");
        this.setAttribute("aria-expanded", open ? "true" : "false");
      });
      const closeMobileNav = () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      };
      navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMobileNav));
      window.addEventListener("resize", () => { if (window.innerWidth > 860) closeMobileNav(); });
      document.addEventListener("keydown", event => { if (event.key === "Escape") closeMobileNav(); });
    }

    const finishLoading = () => {
      const loader = document.getElementById("pageLoader");
      if (loader) {
        loader.classList.add("is-hidden");
        setTimeout(() => loader.remove(), 250);
      }
    };

    if (document.readyState === "complete") finishLoading();
    else window.addEventListener("load", finishLoading, { once: true });
  }

  try {
    const response = await fetch("content.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const page = await response.json();
    document.title = page.page.title || document.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && page.page.description) description.setAttribute("content", page.page.description);
    root.innerHTML = renderPage(page);
    bindIntegrations(page);
    bindCommonInteractions();
  } catch (error) {
    showError("Serve this folder over HTTP so the page can fetch content.json.");
    console.error(error);
  }
})();
