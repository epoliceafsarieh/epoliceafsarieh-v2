/* all.js — All services list (independent) */

const SERVICES = (window.CATALOG?.SERVICES || []).map(s => ({
  title: s.title,
  icon: s.icon,
  href: s.href
}));

function placeholderSvg(){
    return `
      <svg class="icon-img" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 8h10M7 12h10M7 16h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        <rect x="4.5" y="5.5" width="15" height="13" rx="2.5" stroke="currentColor" stroke-width="1.2" opacity=".7"/>
      </svg>
    `;
  }

  function iconNode(iconSrc){
    if (!iconSrc) return placeholderSvg();
    return `<img class="icon-img" src="${iconSrc}" alt="" aria-hidden="true">`;
  }

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function placeholderSvg(){
  return `
    <svg class="icon-img" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 8h10M7 12h10M7 16h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <rect x="4.5" y="5.5" width="15" height="13" rx="2.5" stroke="currentColor" stroke-width="1.2" opacity=".7"/>
    </svg>
  `;
}

function iconNode(iconKey){
  if(iconKey === "placeholder") return placeholderSvg();

  const src = ICON_SRC[iconKey];
  if(!src) return placeholderSvg();

  return `<img class="icon-img" data-icon="${iconKey}" src="${src}" alt="" aria-hidden="true">`;
}

function withFromAll(href){
  // اگر قبلاً query داشت، با & اضافه کن
  return href.includes("?") ? `${href}&from=all` : `${href}?from=all`;
}

function render(){
  const root = document.getElementById("allList");
  if(!root) return;

  root.innerHTML = SERVICES.map(s => {
    const label = escapeHtml(s.title);

    if(!s.href){
      return `
        <div class="item" aria-disabled="true">
          ${iconNode(s.icon)}
          <span class="label">${label}</span>
          <span class="chev" aria-hidden="true">›</span>
        </div>
      `;
    }

    const href = withFromAll(s.href);

    return `
      <a class="item" href="${href}">
        ${iconNode(s.icon)}
        <span class="label">${label}</span>
        <span class="chev" aria-hidden="true">›</span>
      </a>
    `;
  }).join("");
}

render();
