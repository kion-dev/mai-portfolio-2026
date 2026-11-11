/* =========================================================
   Folio — shared layout
   Injects the same nav and footer into every page, so they're
   edited in one place. Works when opened straight from disk
   (file://) as well as when hosted.

   On each page:
     <header id="site-nav"></header>
     <main class="site-main"> …page content… </main>
     <footer id="site-footer"></footer>
     <script src="js/layout.js" data-root="./" data-page="work"></script>

   data-root : path from the page back to the Portfolio folder
               ("./" for top-level pages, "../" one folder down)
   data-page : which nav link to mark as the current page
   ========================================================= */
(function () {
  "use strict";

  // ---- Edit links here: they update on every page ----
  var NAV = [
    { id: "work",   label: "work",   href: "index.html" },
    { id: "about",  label: "about",  href: "about.html" },
    { id: "play",   label: "play",   href: "play.html" },
    { id: "resume", label: "resume", href: "resume.html" },
    { id: "email",  label: "email",  href: "mailto:hello@example.com", external: true }
  ];

  var SOCIALS = [
    { label: "linkedin",  href: "https://www.linkedin.com/" },
    { label: "email",     href: "mailto:hello@example.com" },
    { label: "instagram", href: "https://www.instagram.com/" }
  ];

  var FOOTER_TITLE = "Daydreaming of an adventure together?";
  // -----------------------------------------------------

  var script = document.currentScript;
  var root = (script && script.getAttribute("data-root")) || "./";
  var current = script && script.getAttribute("data-page");

  function url(item) {
    return item.external || /^(https?:|mailto:|tel:|#)/.test(item.href) ? item.href : root + item.href;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function link(item, extra) {
    var ext = /^https?:/.test(item.href) ? ' target="_blank" rel="noopener"' : "";
    return '<a class="nav-item" href="' + esc(url(item)) + '"' + ext + (extra || "") + ">" + esc(item.label) + "</a>";
  }

  var navHTML =
    '<nav class="site-nav" aria-label="Main">' +
      '<div class="site-nav__inner">' +
        '<a class="site-nav__brand" href="' + esc(root) + 'index.html" aria-label="Mai Nguyen — home">' +
          '<img class="site-nav__logo" src="' + esc(root) + 'assets/logo.png" alt="" width="24" height="23">' +
          '<span class="site-nav__name">Mai Nguyen</span>' +
        "</a>" +
        '<ul class="site-nav__links">' +
          NAV.map(function (n) {
            return "<li>" + link(n, n.id === current ? ' aria-current="page"' : "") + "</li>";
          }).join("") +
        "</ul>" +
      "</div>" +
    "</nav>";

  var quick = NAV.filter(function (n) { return n.id !== "email"; });

  var footerHTML =
    '<div class="site-footer__text">' +
      '<p class="site-footer__title">' + esc(FOOTER_TITLE) + "</p>" +
      '<div class="site-footer__links">' +
        '<div class="site-footer__col">' +
          '<p class="site-footer__heading">Quick Links</p>' +
          "<ul>" + quick.map(function (n) { return "<li>" + link(n) + "</li>"; }).join("") + "</ul>" +
        "</div>" +
        '<div class="site-footer__col">' +
          '<p class="site-footer__heading">Socials</p>' +
          "<ul>" + SOCIALS.map(function (n) { return "<li>" + link(n) + "</li>"; }).join("") + "</ul>" +
        "</div>" +
      "</div>" +
    "</div>" +
    '<div class="site-footer__art" aria-hidden="true">' +
      '<img class="site-footer__paper" src="' + esc(root) + 'assets/footer-paper.png" alt="" width="1440" height="442">' +
      '<img class="site-footer__landscape" src="' + esc(root) + 'assets/footer-landscape.png" alt="" width="1440" height="708">' +
    "</div>";

  var nav = document.getElementById("site-nav");
  if (nav) nav.innerHTML = navHTML;

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = footerHTML;
  }
})();
