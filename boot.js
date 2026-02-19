(function(){

  function createLoader(){
    if(document.getElementById("bootLoader")) return;

    const loader = document.createElement("div");
    loader.id = "bootLoader";

    loader.innerHTML = `
      <div class="boot-inner">
        <img src="assets/img/logo/logo_white.png" class="boot-logo" />
      </div>
    `;

    document.body.appendChild(loader);
  }

  function removeLoader(){
    const el = document.getElementById("bootLoader");
    if(!el) return;
    el.classList.add("boot-hide");
    setTimeout(()=> el.remove(), 400);
  }

  function injectCSS(){
    if(document.getElementById("bootCSS")) return;

    const style = document.createElement("style");
    style.id = "bootCSS";
    style.innerHTML = `
      #bootLoader{
        position:fixed;
        inset:0;
        background:#ffffff;
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        transition:opacity .4s ease;
      }

      #bootLoader.boot-hide{
        opacity:0;
      }

      .boot-logo{
        width:90px;
        animation: pulseLogo 1.6s ease-in-out infinite;
      }

      @keyframes pulseLogo{
        0%   { transform:scale(1); opacity:.9; }
        50%  { transform:scale(1.08); opacity:1; }
        100% { transform:scale(1); opacity:.9; }
      }
    `;
    document.head.appendChild(style);
  }

  injectCSS();
  createLoader();

  window.__bootHide = removeLoader;

  // Fail-safe
  setTimeout(removeLoader, 8000);

})();
