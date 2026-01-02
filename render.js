// render.js
(function () {
  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  function safeText(v) {
    const t = (v ?? "").toString().trim();
    return t ? t : "—";
  }

  function liList(items) {
    if (!items || !items.length) return "";
    const clean = items.map(x => String(x ?? "").trim()).filter(Boolean);
    const isHead = (s) => /[:：]$/.test(s);
    const hasAnyHead = clean.some(isHead);
    if (!hasAnyHead) return `<ul>${clean.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;

    let html = "", i = 0, openMainUl = false;
    const openUl = () => { if (!openMainUl) { html += `<ul>`; openMainUl = true; } };
    const closeUl = () => { if (openMainUl) { html += `</ul>`; openMainUl = false; } };

    while (i < clean.length) {
      const cur = clean[i];
      if (isHead(cur)) {
        closeUl();
        html += `<div class="subhead">${esc(cur)}</div>`;
        const sub = [];
        i++;
        while (i < clean.length && !isHead(clean[i])) sub.push(clean[i++]);
        if (sub.length) html += `<ul class="sublist">${sub.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
        continue;
      }
      openUl();
      html += `<li>${esc(cur)}</li>`;
      i++;
    }
    closeUl();
    return html;
  }

  function olList(items) {
    if (!items || !items.length) return "";
    return `<ol>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`;
  }

  const app = document.getElementById("app");
  if (!app) return;

  if (typeof window.SERVICES === "undefined") {
    app.innerHTML = `<div style="padding:16px;font-family:tahoma">خطا: فایل‌های سرویس بارگذاری نشده است.</div>`;
    return;
  }

  const style = document.querySelector("style") ? "" : "";

  function renderService(serviceKey) {
    const svc = window.SERVICES[serviceKey];
    if (!svc) {
      app.innerHTML = `<div class="content">این خدمت پیدا نشد.</div>`;
      return;
    }

    const sections = svc.sections || [];
    const firstSection = sections[0];
    const restSections = sections.slice(1);

    const renderSection = (sec, idx, anchor) => {
      const body = liList(sec.items || []);
      const ctaHtml = (sec.cta && sec.cta.label && sec.cta.href)
        ? `<div class="cta"><a href="${esc(sec.cta.href)}">${esc(sec.cta.label)}</a></div>`
        : "";
      const openAttr = sec.open ? " open" : "";
      const anchorAttr = anchor ? ` id="${anchor}"` : "";
      return `
        <details class="sec"${openAttr}${anchorAttr}>
          <summary>
            <span>${esc(sec.heading || "")}</span>
            <small>${esc(sec.tag || "")}</small>
          </summary>
          <div class="sec-body">${body}${ctaHtml}</div>
        </details>
      `;
    };

    const heroPrimary = svc.heroPrimary || null;
    const heroSecondary = svc.heroSecondary || null;

    app.innerHTML = `
      <div class="wrap">
        <div class="card">
          <div class="brandbar">
            <div class="brand-right">
              ${svc.icon ? `<div class="svc-badge"><img class="svc-icon" src="${esc(svc.icon)}"></div>` : ""}
              <div class="svc-title">${esc(svc.barTitle || svc.shortTitle || "")}</div>
            </div>
            <a class="back-btn" href="index.html">بازگشت</a>
          </div>

          <div class="card-clip">
            <div class="header"></div>

            <div class="hero">
              <div class="hero-title">${esc(svc.heroTitle || "")}</div>

              ${firstSection ? renderSection(firstSection, 0, "docs") : ""}

              <div class="hero-actions">
                ${heroPrimary ? `<a class="btn-primary" href="${esc(heroPrimary.href)}">${esc(heroPrimary.label)}</a>` : ""}
                ${heroSecondary ? `<a class="btn-secondary" href="${esc(heroSecondary.href)}">${esc(heroSecondary.label)}</a>` : ""}
              </div>
            </div>

            <div class="content">
              ${restSections.map(renderSection).join("")}

              ${svc.notDone && svc.notDone.length ? `
                <details class="sec">
                  <summary><span>نکات مهم</span></summary>
                  <div class="sec-body">${olList(svc.notDone)}</div>
                </details>` : ""}

              ${svc.faq && svc.faq.length ? `
                <div class="faq">
                  <div class="faq-title">سؤالات پرتکرار</div>
                  ${svc.faq.map(f => `
                    <details>
                      <summary>${esc(f.q)}</summary>
                      <div class="ans">${esc(f.a)}</div>
                    </details>`).join("")}
                </div>` : ""}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (!window.SERVICE_KEY) return;
  renderService(window.SERVICE_KEY);
})();
