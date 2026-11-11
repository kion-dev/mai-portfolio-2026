/* =========================================================
   Case study renderer
   Turns a case-studies/<name>/content.js file into the page.

   case-study.html?p=my-project  →  loads case-studies/my-project/content.js
   (no ?p= shows the example in case-studies/_example)

   Works from disk (file://) and when hosted, no build step.
   ========================================================= */
(function () {
  "use strict";

  var FOLDER = "case-studies/";
  var mount = document.getElementById("case-study");
  var slug = new URLSearchParams(location.search).get("p") || "_example";

  if (!/^[\w-]+$/.test(slug)) return missing();

  var base = FOLDER + slug + "/";

  // content.js calls caseStudy({...})
  window.caseStudy = function (data) {
    try { render(data); }
    catch (e) { console.error(e); missing("Something in content.js couldn't be read — check the browser console."); }
  };

  var s = document.createElement("script");
  s.src = base + "content.js";
  s.onerror = function () { missing(); };
  document.body.appendChild(s);

  /* ---------------- helpers ---------------- */

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Inline formatting: **bold**, *italic*, [link](url)
  function inline(str) {
    return esc(str)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, label, href) {
        var ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
        return '<a href="' + href + '"' + ext + ">" + label + "</a>";
      });
  }

  // Block text: blank line = new paragraph, lines starting "- " or "1. " = lists
  function rich(str) {
    if (!str) return "";
    return String(str).trim().split(/\n\s*\n/).map(function (chunk) {
      var lines = chunk.split("\n").map(function (l) { return l.trim(); });
      if (lines.every(function (l) { return /^[-•]\s+/.test(l); })) {
        return "<ul>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^[-•]\s+/, "")) + "</li>"; }).join("") + "</ul>";
      }
      if (lines.every(function (l) { return /^\d+[.)]\s+/.test(l); })) {
        return "<ol>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^\d+[.)]\s+/, "")) + "</li>"; }).join("") + "</ol>";
      }
      return "<p>" + lines.map(inline).join("<br>") + "</p>";
    }).join("");
  }

  function src(path) {
    return /^(https?:|data:|\/|\.\.\/)/.test(path) ? path : base + path;
  }

  function slugify(str) {
    return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
  }

  // One image/video. Empty path = grey placeholder (handy while drafting).
  function media(file, alt, placeholderHeight) {
    if (!file) {
      var h = placeholderHeight ? ' style="height:' + Number(placeholderHeight) + 'px"' : "";
      return '<div class="cs-media cs-media--placeholder"' + h + "></div>";
    }
    if (/\.(mp4|webm|mov)$/i.test(file)) {
      return '<div class="cs-media"><video src="' + esc(src(file)) + '" autoplay muted loop playsinline' +
        (alt ? ' aria-label="' + esc(alt) + '"' : "") + "></video></div>";
    }
    return '<div class="cs-media"><img src="' + esc(src(file)) + '" alt="' + esc(alt) + '" loading="lazy"></div>';
  }

  function figure(b) {
    var inner;
    if (b.images) {
      inner = '<div class="cs-gallery" style="--cols:' + Math.min(b.images.length, 3) + '">' +
        b.images.map(function (im) {
          return typeof im === "string" ? media(im, "") : media(im.src, im.alt, im.height);
        }).join("") + "</div>";
    } else {
      inner = media(b.image, b.alt, b.height);
    }
    return '<figure class="cs-figure">' + inner +
      (b.caption ? '<figcaption class="cs-caption">' + inline(b.caption) + "</figcaption>" : "") +
      "</figure>";
  }

  function block(b) {
    if ("image" in b || b.images) return figure(b);
    return '<div class="cs-block">' +
      (b.title ? '<h3 class="cs-block__title">' + inline(b.title) + "</h3>" : "") +
      (b.text ? '<div class="cs-block__text">' + rich(b.text) + "</div>" : "") +
      "</div>";
  }

  /* ---------------- render ---------------- */

  function render(d) {
    document.title = (d.title || "Case study") + " — Mai Nguyen";
    if (d.description) {
      var m = document.querySelector('meta[name="description"]') || document.head.appendChild(document.createElement("meta"));
      m.name = "description";
      m.content = d.description;
    }

    var used = {};
    var sections = (d.sections || []).map(function (sec) {
      var id = slugify(sec.id || sec.nav || sec.heading);
      while (used[id]) id += "-2";
      used[id] = true;
      return { id: id, data: sec };
    });

    var toc = [{ id: "overview", label: "Overview" }].concat(sections.map(function (s) {
      return { id: s.id, label: s.data.nav || s.data.heading };
    }));

    var hero = d.hero
      ? '<div class="cs-hero">' + (d.hero.image ? '<img src="' + esc(src(d.hero.image)) + '" alt="' + esc(d.hero.alt) + '">' : "") + "</div>"
      : '<div class="cs-hero"></div>';

    var meta = (d.meta || []).length
      ? '<dl class="cs-meta">' + d.meta.map(function (m) {
          return '<div class="cs-meta__item"><dt>' + inline(m.label) + "</dt><dd>" + rich(m.value).replace(/^<p>|<\/p>$/g, "") + "</dd></div>";
        }).join("") + "</dl>"
      : "";

    var overview =
      '<section class="cs-section cs-overview" id="overview" aria-label="Overview">' +
        '<div class="cs-overview__titles">' +
          '<h1 class="cs-title">' + inline(d.title) + "</h1>" +
          (d.description ? '<p class="cs-lede">' + inline(d.description) + "</p>" : "") +
        "</div>" +
        meta +
        (d.intro ? figure(Object.assign({ height: 120 }, d.intro)) : "") +
      "</section>";

    var body = sections.map(function (s) {
      var sec = s.data;
      return '<section class="cs-section' + (sec.accent === "bright" ? " cs-section--bright" : "") +
        '" id="' + s.id + '" aria-labelledby="' + s.id + '-h">' +
        '<h2 class="cs-section__heading" id="' + s.id + '-h">' + inline(sec.heading || sec.nav) + "</h2>" +
        (sec.blocks || []).map(block).join("") +
        "</section>";
    }).join("");

    var aside =
      '<aside class="cs-aside"><div class="cs-aside__inner">' +
        '<a class="cs-back" href="' + esc(d.backLink || "index.html") + '">' +
          '<img src="assets/arrow-back.svg" alt="" width="20" height="20">' +
          "<span>" + esc(d.backLabel || "Back to home") + "</span>" +
        "</a>" +
        '<nav class="cs-toc" aria-label="On this page"><ul>' +
          toc.map(function (t) {
            return '<li><a class="nav-item" href="#' + t.id + '">' + inline(t.label) + "</a></li>";
          }).join("") +
        "</ul></nav>" +
      "</div></aside>";

    mount.innerHTML = hero + '<div class="cs-body">' + aside + overview + body + "</div>";
    spy();
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  // Underline the section you're reading in the side list
  function spy() {
    if (!("IntersectionObserver" in window)) return;
    var links = {};
    mount.querySelectorAll(".cs-toc a").forEach(function (a) { links[a.hash.slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        var a = links[e.target.id];
        if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    mount.querySelectorAll(".cs-section").forEach(function (sec) { obs.observe(sec); });
  }

  function missing(msg) {
    mount.innerHTML =
      '<div class="cs-missing">' +
        "<h1>Hmm, that adventure isn’t here.</h1>" +
        "<p>" + esc(msg || "No case study called “" + slug + "” — check the folder name in case-studies/.") + "</p>" +
        '<a class="cs-back" href="index.html"><img src="assets/arrow-back.svg" alt="" width="20" height="20"><span>Back to home</span></a>' +
      "</div>";
  }
})();
