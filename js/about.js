/* =========================================================
   Stamp playground on the About page (about.html)
   1. Pick a postage stamp → it's stuck in the paper's corner.
   2. Pick up a wooden block, dab it on the ink pad,
      then click the paper to stamp. Ink runs out after a few prints.
   3. Undo / Wash Off / New Sheet. Write a message underneath.
   The sheet is remembered in this browser (localStorage) only —
   messages aren't sent anywhere.
   ========================================================= */
(function () {
  "use strict";

  var INK_PER_DIP = 5;
  var STORE_KEY = "folio-about-sheet";
  var ROT = -1 * Math.PI / 180;            // paper__draw is rotated -1deg
  var POSTAGE = {
    dandelion: { src: "assets/about/stamp-dandelion.png", label: "Dandelion postage stamp" },
    mai:       { src: "assets/about/stamp-mai.png",       label: "Mai shrub postage stamp" },
    sunflower: { src: "assets/about/stamp-sunflower.png", label: "Sunflower postage stamp" },
    tulip:     { src: "assets/about/stamp-tulip.png",     label: "Tulips postage stamp" }
  };
  // ink impression size for each block's character (from the Figma blocks)
  var MARKS = { 1: [95, 96], 2: [63, 93], 3: [99, 93], 4: [98, 94] };
  // The impression shapes are inlined (also saved as assets/about/mark-N.png):
  // browsers block CSS masks loaded from files when a page is opened from disk.
  var MARK_SRC = {
    1: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABgCAYAAAB7YK6NAAAH0klEQVR4Xu2de6odRRCH64qg4gZ8xIioO4gmERVdgcEkIuo/LkCNoKALMApR1OgOQjQ+UNyAosEXugFjBN8rEGL8wyPfYSrU7TvT093T3XP6OB9cEnLP9HT/pqa6urr6ZGe1WsnCPFw1z20XoGXxT7b+CHcadjv4y2dF5I1WH0Krln+kE/xQq8K37Hb2tyy60qrl37KIPx/75rt1Plq1/BvySTAfrYq/uJ2FabRq+VvBIv6MtCr+nzNqlo1Wxf8jmwIz0qr4W0Gr4v++Deq3Kv5vi/gLk2jV8mtzSkQu5b7pIv44T4vIcyLy9vhH4/g/iD+lQgDh3xSRf0Tk+Thpx9l28VX4m8el2IMKD9ckXD9K6+If8IzwoPld7KKMnTIsHnZGVUyklPh/JfYnlu89F3ze/Y5Ndgv7v8dHbvRLaeGhlPjXi6xf+RMjg/TB9VN2rNRV2OoGhP9YxLtOONN16pEJfQ+D0pECP5+tdpNyj4tdEyd6+nfE8zu9F7jXwjnPeEPaTRlL7zXZGuoZkMvxkYd8xtOG2/6BrnFf/y8PtOe7Bs4XMMbee5ZyO+DW1LwvImc97+MTnauy/lgnO3eBE5JS7otQfOPVyOi+MJ8xnZLifyuyZ6/1sU7gPl7t/pGHZOEBfOT8G+IfThj+UMyvD7dYZNNLpVfs7B4ntNcf05ejq9Xa16/LGCv9fBrgwor0pXatJm4H61feEZHHEyw4F1j8tSJyq4j8mqvRUEq6nT4Qmlf7me6XPjdUGkJKhGcdUF14qC2+ctp5CFPXBCkwdmJ5X5XzTSkNh1Lb7Qyh7ihmwuOzT5kGmZRz7XDR9g8icqfIOhDInlRbU2lSy3kfXQgNcWm1Wh1KHBfGeME0fCqxnaDxzuV2UsFPkx7wgR//ugtpY+v3yX6iCYEAf5axeKXkk+3aJtWQaom2fxoSxtKXnqgx7tF71LB8FkRqiUysrySYPbn1B811RCj0Hd9sfyigxWotr4vIuwn3LE8Fy9d7fOGYbIxFWkL7HJtbcttVxnJSof3Z87na0Q5W+qOI3N6ZVUh0Y1MCIZ+3uOmEmOtJX7wsIg+UegVquB1XjDuMq4ghJZfjTrhjmygWXGUx4aG2+LHoxsZ7IvJN7MUi6+Se5WhCG8XYdPFJM8OjExTQVAZsVKWb9fkXugFiLd+JyFciV/ZI2c7jHBR/srnM331Hc7geyJmw6vTttfpgG9K3/A9FfT+uK+UNKoIV/6KZCEvyk8ja79dEy0B8Ey4hMIVRbopCDe/hzuCOdQm5VH4Wkdu4eCjaCY0K7u7eBt6Cu0SulGtoNAOXO2t7q9sUGdrQcLF1M6H98UEbvnu76e5QGJ8vp8TD0121XV9XMCT+3FBzY91DDvFD0PASwXC/LBDpB3/PlbS7wtUhPZqBG517EiJ+UKEfxcNLSw3Lt6lf8vihWBfxt4hcF3phK5S0fBY4WJKF0DY0emFi1rmDTGWuyGdjKGn5WKst30iJctwJsvb36zDpA8EEsLP1ZK5tx5LiM2kRlmH9TFi4H/LlMRMXg3WLXGM23XVHimgsxW31RUfZJv+SK1xEptL3oS7E+7dHyDGINtzB6qa7rw6Ua1g0ck+2Aj8Zu9EAWmyrZK3fLGH5DPwlEXnRDCjF5bgMxeFkSfXUCO5BUxKWbNaalUz5fB7iSSeBTvHTwUzt234e7gqrQqAPucaYvZ0clk/mUa0NC6c2x80m2moA4PXNEbfTLqtsm24meVZkUZSbqaEmEyIDJ6x0BVf6Jq1c2UXa5r5D906FPM8LqReHksPyxxgLF3lwG5Np7NA+x0RW0dQUH5dE5GEfhi7ENirV6zyAnG5yFyVDTYUYG99MGrlPeNg0ywf6fE83CFsZl42pPj+EvkWVTT1oXf4mwgKxWJhaw/JdXOFTqsJyCMLhON5EfnwnZopRw+dbrPD3isiX5pd6UjBEWAQL+dwYU0pLJlPT8q3wCGeFB63BPBc4qpRT5S70w1a48TBiyksmUUt8V3gfmnLmGsQYEjnXd2uyKLQVDpwJq/MAKiy/95s8wNgxTJsOUIaOmYaUG1Ki2FcGOFQCaMlR3OvVt4bl61H6sXsR62tVgy2WCoXvYXB9OMc6+6wY6+7Lilo3RKQz5QT9OIUtP7XYVBmyPnBPkvcdjNZT7Hacx4x57xsYv/0MJymL6DRmjVNQK2T3KSaJxrc6KSnlfXaO4EuKwFrwh8bHD+WY+IxGU+UO7RV6qkpKSteWkvf5bPrcZ/n6764/B44KpY6Vo0FKyDwTfJ8Slm/9bkplGlanxB7FJwJi98rCCpoN+FRYBGqagYMWWlY5mdyLLD1UDFMWQbprNbQDxgM+LyL3ByqQe1GWpZQlp+VjEWphnOiegh6W9r05MWdkc8XtGBRrAsb52pQBrq0z03/VZHezapR3YMk59oVToTKDyXrK253F8rFA3UbEv4YWRaWiFp9adp4DMrUIP2kdkCOlTHkHEx31NaEVyFOIcTelmWRoOcSHmEKohY6cE24tNOxrnhbFV3JVQMxGy+LHflHpxtGi+CnncTeSFsVXNrHiIYoWxdda+cXnz0jzPj9XeqEmeuJl0tJ+E2hRfF1FNy9+iz5/a1jEn5FWxSed3Dytih/yLeIbT6viu98q3iStRjvsJDUf57do+RS2Ni88tGj5W0OLlr81/Aff7OpkX60xYAAAAABJRU5ErkJggg==",
    2: "data:image/png;base64,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",
    3: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABdCAYAAACxS9hIAAAFwElEQVR4Xu2da6oVRxDH6wbBZAtR8EPiDpSo4CMrMD7yQF2C+EI/uIEIeWCSLYiaoCGuICIx8bkBJfniaws+PnjD/zJzmDt3Tk91dVd31ZzzA0HwnDnT9Z+q6q6uHldWV1dpiQ0+sHEbS4BnMZ4SEdy6/XPGu6QrTsNUKLaueBXFo2eMJbmxfzeLNzG4hv7XrMUDeBLjswgDf0JEuyI+bwJPOQNPO4zM5T8i+pT7YQt4EoMborq4SuZewlRMiOrypYUnnosXMa5yB9TjiPB7VfASpiQhCrwhoo+qWFbA1MUAbvKGhzD1seAhc4kHMY66tKwAD2LsFozLJR7E2OnSsgI8iLEwLMUwxFIMQyzFMIQHMV4ZspcqHsR4kGABlNHdsCniTncQ0Z7O5x8S0f2I70v5m4jOC7/syqs4YqALY3vAGNeI6LjQWBxucT40hxSvKs5YmEK1NCQEONa0y1jc5nxZ3KIJhMS4Ennde0TifQctSoTRbIRK6NI9BIB6Uk5DYF9is2DUbsrnYCxMSYGXINfk4o9cF7KMlhgAuQbelaPt8oVlI+ZCU4yWy40oKTxP+bIXQmLkXjCleMk/AoMiz7giJIZGA1gOL+HialrLSeA/cEceSYqXcHnM/aAVxnLGBSJ6q3Sz2l6Sc2pdhDExwIeKggB4yY8Ko51cmGqBIFohC5xrRNkyR5RugZKLuxkYxzNaELJOcy0hBOuJoVZOSVNC7TCF1f8XRGtlpe5xN/x9sF1V2lGYUirh0pZUMKj33C91KFkKwW8dJFrr7T0Rca9niein9vNSMcApIvo54odLoyWG1PDzmN1nihgtcDmU0a2RSwyEGjzx6GxE7szNX0S0DxfNIUZL7MkibbYSRc+otA0f9I6YBD4GVuy4Xu4yipSxgzLwnG+b6nKbYFEdRszX8IB5zOyVUwyAQVkRBYvK/u4jnvz2MD8mBRcZO5nazCoFOcPUPKzmFCvMNuJKiGE90ddmNtHIHaZCoIMEPyxZTU+VdccdSnpGHwhzm4j2T9XSI8AR1i2eS3pGH9zIgcZb0Hu1KNxtxryhilHTM/rg7J67SmskG7yhS03P6OOqFTMS1KAQloM1PU575xIZWMwhDLM7Wyx5xveyMZsCuQ81LHgBFr9sIYAFz5CWyFPAVjL2O5CjEB4luQqNeiBbc3VNMSDCkwLliHdNVfn3FPVKUGM2VUqEllyldHVKekZpEQD2CtxQKoFjHxhV0rGzHrlx9d4RbTGwNYu5dcy+cE7wGj1sMrlAK2dg38BSG7+LvJHbMzDo14pCfNXM4WONm+NYgjo5PeNPIvpc6Y4xPe2fXLpORN9E/F6sgMXJ4RkIScgLWkKgk3HoCFlsS+ivxa0bSapnICRpbt4Hq5xjhbcBTHuH1DNQR4I3aAmBIttolVPQiWL6tdwSz9D2BoQl9PVykMzazHpHjBiSgccyFpaGCO4RDGD2tdxcMcZeWZFKioFixQAmvYOTMzivrEgBYSnl/KDk3IjJ3BHyDKthKUeoMukd8zwDsyXNcsbcDomCmFt3DImBCqv0/U4cUNLYy/lgBBLDfh1x/SL0w5TmtDUlSXOQJPJ1J4dq0xUD/0eF1jk4eMMN5cFKxDCVO7phSvp/VIT4rZlGagsBrJwLEdMVI+cmDAyDa8dUVVOR5jkz09xumMp1YHIbET1LtawQ16Gq6xm/CA3QhghcCyvbWkKkhKqxI2dF6E9tYcyYjnCsfnENrKClT2VOpA/UpZw3ISW0AsdBjsNEdKi5OFoVHzUzLssNYdKHonq9KiSGV6Ri5H7JZTScQqE3JIVD8F3tgU7RM4DUO6qGqil6RsqsqipTFUO6P1K1v2qqYgBJ7jhZ0zWmmjNaJK/trpY3pi6GJJlXE2PKYaoFxr3DDD9VX0y8CGIAnDrl1J+0WlRZLIoY4Gbn3SVD7+rFBpjW5hqLRcgZITgtpMVYJM8YQrpSV+F/sJk8ETGZWnQAAAAASUVORK5CYII=",
    4: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABeCAYAAADYHcHYAAAFG0lEQVR4Xu2dZ6oWMRSG3yuCugXrD8sKxAaK7sCOqLgEe9mCYEHFHYiCyLVsQGxY0A3YfqiLsPzwyqsTCWFKMslMzsl8D9x/38ydyXtaTvLlm1tYWMCM/CzK/wgzyBSEuKRB6tKF2AxglQYhFmt4yAheA9gacf1olOwRt6pRpBjiKVUIhqSjAD6LV6BirtDy1dTkDEsqPKJEIb4DWGoMTYtHlBaajlsi3NUiAinJI1YD+GINvhpvKG1CZ4ugyhtK8gi3YabKG0rxCLeFoc4bSvAIJufrTlJW5w3ahXCTM/kBYJmmasmguXy1k7PhmEYRNHtE02qWyrCkNVk3iaAabaGJ7Ysi0STEY6t90cQBrSppaXFwbYFt7S7Y9l7X9SGJaBDCVwSDyoQtPTRxwubjCTYqk7lkIegJ7qzZl2e+H5SCVCFCw5HLdgBXpAyyDxKFiBXBcBrASZ9BkIC0ZG0vc6biCYBdqW42FJKEGDrJiq6mpISmoUUg/B8rh7LoWHILsaUaoLH4JjVv5AxNXFk7O5YCNYgKVbk8gkk5pwgmVImpqsb2CIaiVxm9oInsOwLHFILdU8ll5EcAG3IZyRihaXeVkCWLQNZXz/khR3VlewTLu5QJjPd6X72gVkYLWbZHsJdPMWIXVygAreq3chEI8xnHhO9Dzx4MN0eYiVWftgBb1he1bmcJhOPzAMCNwOsaqUvW9iyXCew8gIc1d9gIYC+A/QVYfgooDtv2dWPVSVPVdBvA4c6rZ7RBI75fCdP5ZZkmIQgt/d5srJPCnYhss7wB8BbAy+ru79qEMIzRkJsqdyqvmfeZR7AKOjHVkUoIq9LL1fe+Oab8OwJgnv/DxyMMbCHTrWb48d/afT4eIoThE4C1PjefELT2m1XV1CuU+4QmF27gmnqoorWzmDEhhmNyLWZtpY9H2PRSXyG0+Asmng9B7FkctIhSxWBi5WR2lPfrE5pcSgpTHHyOCQ3s3FgihFZNbYxiNQPBsGNa4NmIDU2aESGAIUVo0sjBavu+GE+eokekXPxKxtQ8QqQIJIUQy5OZxbCIFSGVEJxhSkf8uX4pPGKPcBV4NkfnwkxuYlscREzl0YDokDSV8vVqbkv3JTY08TTJFLC1wO2Yp1LczOJM4vsNRmxoil2bYKKvWzipO/4nlOcAdoRelItYIfrkh5DWQp/7G0bbpZeCmNDUJyytCWwtMNH+7Pmi4islmxghuPfJF8Z+DupX3wsseIYrV8RC4LYVVcT0mnzWrVOdjcHdDsR309sjVSpEtDjMAehtmA5nKijGU8+bee2ckETfZN2WRH8BWDLgS/okcBWTuNgc0ZakGcuHFIGoG2Qf+iTrpmqECdnE8qEpaZ38n3UF/mwBvaFOCIrAfT1j0hai1HlNqEfUlaw5RCDSu75BhHqEa4W5RDAUc+xoiEe4JWtuEQibhUUQ4hG29b0A/h5OJYE6ryg2R7jeIEWEYvD1CNvqpFlbXSte2jN24pMj7N9nkLgIX3e4CheZVOHjEcYbuAh/SOjbuXmCfS5VX8Ts8gi7nSFVhDr2CTWYRrqE4EkCRGJIsnF/gZFfxldFlxA7ARX7gtyjGHzWSkTRlSNSn1gzJG6eUFU5tXkEd1Kk3t4yo4E2IfiD3GN3VGNQ3RrvCk3akDzxbKUrWWvDrp5WaHr40oSwf01l20yIvJidHpvyPkYYpXkE4dyH9NmJmI0ShSA8IFJVq760qsmGZ+wZ7xBPyUKootTQpI4/s/wo8j6uhJ4AAAAASUVORK5CYII="
  };
  var HINTS = {
    idle: "Pick up a block",
    holding: "Now dab it on the ink",
    inked: "Stamp it on the paper!",
    dry: "Out of ink! Dab again",
    noInk: "Ink it up first!"
  };

  var $ = function (s) { return document.querySelector(s); };
  var area = $("#playground"), paper = $("#paper"), wrap = $(".paper-wrap");
  var draw = $("#paper-draw"), marksEl = $("#marks"), postageImg = $("#paper-postage");
  var hint = $("#stamp-hint"), ink = $("#ink"), ghost = $("#ghost"), ghostImg = ghost.querySelector("img");
  var message = $("#message");
  var undoBtn = $("#undo"), washBtn = $("#wash"), newBtn = $("#new-sheet");

  var state = { postage: "dandelion", marks: [], message: "" };
  var held = null;   // block number being held
  var inkLeft = 0;
  var scale = 1;

  // ---------- persistence (this browser only) ----------
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (s && POSTAGE[s.postage] && Array.isArray(s.marks)) state = s;
    } catch (e) { /* ignore */ }
  }

  // ---------- postage stamps ----------
  function setPostage(name, animate) {
    state.postage = name;
    document.querySelectorAll(".postage__btn").forEach(function (b) {
      var on = b.dataset.stamp === name;
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-checked", on ? "true" : "false");
    });
    postageImg.src = POSTAGE[name].src;
    postageImg.alt = POSTAGE[name].label;
    if (animate) {
      postageImg.classList.remove("is-new"); void postageImg.offsetWidth; postageImg.classList.add("is-new");
    }
  }
  document.querySelectorAll(".postage__btn").forEach(function (b) {
    b.addEventListener("click", function () { setPostage(b.dataset.stamp, true); save(); });
  });
  document.querySelector(".postage").addEventListener("keydown", function (e) {
    var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!keys[e.key]) return;
    e.preventDefault();
    var btns = Array.prototype.slice.call(document.querySelectorAll(".postage__btn"));
    var i = btns.findIndex(function (b) { return b.dataset.stamp === state.postage; });
    var next = btns[(i + keys[e.key] + btns.length) % btns.length];
    setPostage(next.dataset.stamp, true); next.focus(); save();
  });

  // ---------- holding a block ----------
  function setHint(key) { hint.textContent = HINTS[key]; }

  function pickUp(n) {
    held = n; inkLeft = 0;
    document.querySelectorAll(".block").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.block === String(n) ? "true" : "false");
    });
    ghostImg.src = "assets/about/block-" + n + ".png";
    ghost.classList.add("is-visible");
    ghost.classList.remove("is-inked");
    area.classList.add("is-holding");
    setHint("holding");
  }
  function putDown() {
    held = null; inkLeft = 0;
    document.querySelectorAll(".block").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    ghost.classList.remove("is-visible", "is-inked");
    area.classList.remove("is-holding");
    setHint("idle");
  }
  document.querySelectorAll(".block").forEach(function (b) {
    b.addEventListener("click", function (e) {
      var n = Number(b.dataset.block);
      if (held === n) putDown(); else { pickUp(n); moveGhost(e.clientX, e.clientY, e.detail === 0); }
    });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && held) putDown(); });

  function moveGhost(x, y, fromKeyboard) {
    if (fromKeyboard || (!x && !y)) {
      var r = draw.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2;
    }
    // hold the block so its face is centred just above the pointer
    ghost.style.transform = "translate(" + (x - 62) + "px," + (y - 96) + "px)";
  }
  // The floating block is for mouse/pen. On touch the picked block just stays highlighted.
  var touch = false;
  function setPointer(e) {
    touch = e.pointerType === "touch";
    ghost.style.display = touch ? "none" : "";
  }
  document.addEventListener("pointerdown", setPointer, true);
  document.addEventListener("pointermove", function (e) {
    setPointer(e);
    if (held) moveGhost(e.clientX, e.clientY);
  });

  ink.addEventListener("click", function () {
    if (!held) { setHint("idle"); flash(hint); return; }
    inkLeft = INK_PER_DIP;
    ghost.classList.add("is-inked");
    ink.classList.remove("is-dabbing"); void ink.offsetWidth; ink.classList.add("is-dabbing");
    setHint("inked");
  });

  function flash(el) { el.animate && el.animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: 400 }); }
  function shake() { ghost.classList.remove("is-shaking"); void ghost.offsetWidth; ghost.classList.add("is-shaking"); }
  function press() {
    ghost.classList.add("is-pressing");
    setTimeout(function () { ghost.classList.remove("is-pressing"); }, 120);
  }

  // ---------- stamping ----------
  // screen point → coordinates inside the (rotated, possibly scaled) draw area
  function toLocal(cx, cy) {
    var r = draw.getBoundingClientRect();
    var mx = r.left + r.width / 2, my = r.top + r.height / 2;
    var dx = (cx - mx) / scale, dy = (cy - my) / scale;
    var c = Math.cos(-ROT), s = Math.sin(-ROT);
    return { x: dx * c - dy * s + draw.offsetWidth / 2, y: dx * s + dy * c + draw.offsetHeight / 2 };
  }

  function renderMark(m) {
    var size = MARKS[m.n];
    var el = document.createElement("span");
    el.className = "mark";
    var url = 'url("' + MARK_SRC[m.n] + '")';
    el.style.webkitMaskImage = url; el.style.maskImage = url;
    el.style.width = size[0] + "px"; el.style.height = size[1] + "px";
    el.style.left = (m.x - size[0] / 2) + "px"; el.style.top = (m.y - size[1] / 2) + "px";
    el.style.setProperty("--rot", "rotate(" + m.r + "deg)");
    el.style.transform = "rotate(" + m.r + "deg)";
    el.style.opacity = m.o;
    marksEl.appendChild(el);
    return el;
  }

  function stampAt(x, y) {
    if (!held) return;
    if (inkLeft <= 0) { shake(); setHint("noInk"); return; }
    var m = {
      n: held,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      r: Math.round((Math.random() * 16 - 8) * 10) / 10,
      o: Math.round((0.5 + 0.45 * (inkLeft / INK_PER_DIP)) * 100) / 100
    };
    state.marks.push(m);
    renderMark(m);
    press();
    inkLeft -= 1;
    if (inkLeft <= 0) { ghost.classList.remove("is-inked"); setHint("dry"); }
    updateTools(); save();
  }

  draw.addEventListener("pointerdown", function (e) {
    if (!held) return;
    e.preventDefault();
    var p = toLocal(e.clientX, e.clientY);
    stampAt(p.x, p.y);
  });
  draw.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && held) {
      e.preventDefault();
      stampAt(60 + Math.random() * 280, 60 + Math.random() * 320);
    }
  });

  // ---------- toolbar ----------
  function updateTools() {
    var none = state.marks.length === 0;
    undoBtn.disabled = none;
    washBtn.disabled = none;
  }
  undoBtn.addEventListener("click", function () {
    if (!state.marks.length) return;
    state.marks.pop();
    if (marksEl.lastElementChild) marksEl.removeChild(marksEl.lastElementChild);
    updateTools(); save();
  });
  function wash(done) {
    var els = Array.prototype.slice.call(marksEl.children);
    els.forEach(function (el) { el.classList.add("is-washing"); });
    state.marks = [];
    setTimeout(function () { marksEl.innerHTML = ""; if (done) done(); }, els.length ? 450 : 0);
    updateTools(); save();
  }
  washBtn.addEventListener("click", function () { wash(); });
  newBtn.addEventListener("click", function () {
    paper.classList.remove("is-swapping"); void paper.offsetWidth; paper.classList.add("is-swapping");
    setTimeout(function () {
      marksEl.innerHTML = ""; state.marks = []; message.value = ""; state.message = "";
      updateTools(); save();
    }, 270);
    setTimeout(function () { paper.classList.remove("is-swapping"); }, 650);
  });

  // ---------- message ----------
  message.addEventListener("input", function () { state.message = message.value; save(); });

  // ---------- fit the paper on small screens ----------
  function fit() {
    var avail = wrap.parentElement.clientWidth;
    scale = Math.min(1, avail / 523);
    paper.style.transform = scale < 1 ? "scale(" + scale + ")" : "";
    wrap.style.width = 523 * scale + "px";
    wrap.style.height = 709 * scale + "px";
  }
  window.addEventListener("resize", fit);

  // ---------- start ----------
  load();
  setPostage(state.postage, false);
  state.marks.forEach(renderMark);
  message.value = state.message || "";
  updateTools();
  fit();
})();
