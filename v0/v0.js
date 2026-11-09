// v0 – statischer Nachbau der Live-Seite geo.lu.ch/energieplanung (Navigation zwischen gespeicherten Ansichten)
(function () {
  var V = window.V0_VIEWS, panel = document.getElementById("v0-panel");
  var BASE = "https://www.geo.lu.ch/energieplanung";

  function resolve(path) {
    path = (path || "/").replace(/\/+$/, "") || "/";
    if (path === "/" || path === "/aktuelle-planungen" || path === "/aktuelle-planungen/planungen") return "liste";
    if (path === "/kontakte") return "kontakte";
    if (path === "/kontakte/neu") return "kontakt_neu";
    if (/^\/kontakte\/\d+$/.test(path)) return "kontakt_detail";
    if (/^\/kontakte\/\d+\/bearbeiten$/.test(path)) return "kontakt_edit";
    if (path === "/zugriffsverwaltung") return "zugriff";
    if (/^\/aktuelle-planungen\/planungen\/\d+$/.test(path)) return "planung";
    if (/^\/aktuelle-planungen\/planungen\/\d+\/bearbeiten$/.test(path)) return "planung_edit";
    if (/^\/aktuelle-planungen\/planungen\/\d+\/massnahmen\/neu$/.test(path)) return "massnahme_neu";
    if (/^\/aktuelle-planungen\/planungen\/\d+\/massnahmen\/\d+\/bearbeiten$/.test(path)) return "massnahme_edit";
    if (/^\/aktuelle-planungen\/planungen\/\d+\/massnahmen\/\d+$/.test(path)) return "massnahme";
    return null;
  }
  function closeOverlays() {
    document.querySelectorAll(".v0-overlay, .v0-popover-host").forEach(function (n) { n.remove(); });
  }
  var curN = 7, curK = 13; // aktuelle Planung / aktueller Kontakt (fuer Ansichten pro Objekt)
  function show(view) {
    closeOverlays();
    var param = /^planung/.test(view) ? curN : /^kontakt_edit/.test(view) ? curK : null;
    panel.innerHTML = (param !== null && V[view + ":" + param]) || V[view];
    panel.scrollTop = 0;
    document.body.setAttribute("data-v0-view", view);
    wire(view);
  }
  function go(path) {
    path = path.replace(/^\/energieplanung/, "");
    if (!resolve(path)) return;
    if (location.hash === "#" + path) route(); else location.hash = "#" + path;
  }
  function route() {
    var p = location.hash.replace(/^#/, "") || "/aktuelle-planungen/planungen";
    var mp = /\/planungen\/(\d+)/.exec(p); if (mp) curN = +mp[1];
    var mk = /^\/kontakte\/(\d+)/.exec(p); if (mk) curK = +mk[1];
    show(resolve(p) || "liste");
  }
  function btnByText(root, t) {
    return Array.prototype.filter.call(root.querySelectorAll("button, a"), function (b) { return b.textContent.trim() === t; });
  }

  // Kontakt-Auswahl (Popover mit Suche)
  function openPopover(trigger, html) {
    closeOverlays();
    var host = document.createElement("div"); host.className = "v0-popover-host"; host.innerHTML = html;
    var wrap = host.firstElementChild, r = trigger.getBoundingClientRect();
    wrap.style.transform = "translate(" + Math.round(r.left) + "px, " + Math.round(r.bottom + 4) + "px)";
    wrap.style.setProperty("--radix-popper-anchor-width", r.width + "px");
    document.body.appendChild(host);
    var items = host.querySelectorAll("[cmdk-item]"), input = host.querySelector("input");
    if (input) input.focus();
    items.forEach(function (it) {
      it.addEventListener("mouseenter", function () {
        items.forEach(function (o) { o.setAttribute("data-selected", "false"); o.setAttribute("aria-selected", "false"); });
        it.setAttribute("data-selected", "true"); it.setAttribute("aria-selected", "true");
      });
      it.addEventListener("click", function () {
        var s = trigger.querySelector("span"); if (s) s.textContent = it.getAttribute("data-value");
        closeOverlays();
      });
    });
    if (input) input.addEventListener("input", function () {
      var q = input.value.toLowerCase();
      items.forEach(function (it) { it.style.display = it.getAttribute("data-value").toLowerCase().indexOf(q) < 0 ? "none" : ""; });
    });
  }

  // Loesch-Dialoge ("Energieplanung löschen?" / "Kontakt löschen")
  function openDialog(html, backTo) {
    closeOverlays();
    var ov = document.createElement("div"); ov.className = "v0-overlay";
    ov.innerHTML = '<div class="v0-overlay-bg"></div>' + html;
    document.body.appendChild(ov);
    btnByText(ov, "Abbrechen").forEach(function (b) { b.addEventListener("click", closeOverlays); });
    btnByText(ov, "Löschen").forEach(function (b) { b.addEventListener("click", function () { go(backTo); }); });
    ov.querySelector('[aria-label="Dialog schliessen"]').addEventListener("click", closeOverlays);
    ov.querySelector(".v0-overlay-bg").addEventListener("click", closeOverlays);
  }
  function openDeleteDialog() { openDialog(V.$deleteDialog, "/aktuelle-planungen/planungen"); }

  // Planungstyp (Radix-Select) – Optionen: Kommunale / Regionale Energieplanung
  function openSelect(trigger, options) {
    closeOverlays();
    var host = document.createElement("div"); host.className = "v0-popover-host";
    var r = trigger.getBoundingClientRect(), cur = (trigger.querySelector("span") || {}).textContent;
    host.innerHTML = '<div class="v0-select-content" role="listbox" style="left:' + Math.round(r.left) + "px;top:" + Math.round(r.bottom + 4) + "px;width:" + Math.round(r.width) + 'px">' +
      options.map(function (o) { return '<div class="v0-select-item" role="option" data-value="' + o + '"' + (o === cur ? ' aria-selected="true"' : "") + "><span>" + o + "</span>" +
        (o === cur ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : "") + "</div>"; }).join("") + "</div>";
    document.body.appendChild(host);
    host.querySelectorAll(".v0-select-item").forEach(function (it) {
      it.addEventListener("click", function () {
        var s = trigger.querySelector('[data-slot="select-value"]'); if (s) s.textContent = it.getAttribute("data-value");
        var native = trigger.parentNode.querySelector("select"); if (native) Array.prototype.forEach.call(native.options, function (o) { o.selected = o.textContent === it.getAttribute("data-value"); });
        closeOverlays();
      });
    });
  }

  // Sammelbearbeitung in der Massnahmentabelle
  function wireBulk() {
    var row = panel.querySelector(".geo-activity-list-table-row"); if (!row) return;
    var boxes = row.querySelectorAll('tbody input[type="checkbox"]'), head = row.querySelector('thead input[type="checkbox"]');
    function update() {
      var n = 0; boxes.forEach(function (b) { if (b.checked) n++; });
      var old = row.querySelector(":scope > .bg-blue-50"); if (old) old.remove();
      if (head) { head.checked = n > 0 && n === boxes.length; head.indeterminate = n > 0 && n < boxes.length; }
      if (!n) return;
      var h = document.createElement("div"); h.innerHTML = V.$bulkBar;
      var bar = h.firstElementChild;
      bar.querySelector("span.text-sm.font-medium").textContent = n + " ausgewählt";
      bar.querySelector('[aria-label="Auswahl aufheben"]').addEventListener("click", function () {
        boxes.forEach(function (b) { b.checked = false; }); update();
      });
      row.insertBefore(bar, row.firstChild);
    }
    boxes.forEach(function (b) { b.addEventListener("change", update); b.addEventListener("click", function (e) { e.stopPropagation(); }); });
    if (head) head.addEventListener("change", function () { boxes.forEach(function (b) { b.checked = head.checked; }); update(); });
  }

  function wire(view) {
    panel.querySelectorAll('a[role="tab"]').forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); }); });
    panel.querySelectorAll("table tbody tr").forEach(function (tr) {
      tr.style.cursor = "pointer";
      tr.addEventListener("click", function (e) {
        if (e.target.tagName === "INPUT") return;
        var id = (tr.querySelector("span") || {}).textContent || "";
        go("/aktuelle-planungen/planungen/" + curN + "/massnahmen/" + id.replace(/\D/g, ""));
      });
    });
    panel.querySelectorAll("[data-v0-route]").forEach(function (c) {
      c.addEventListener("click", function () { go(c.getAttribute("data-v0-route")); });
    });
    if (view === "kontakte") {
      panel.querySelectorAll('[data-slot="card"]').forEach(function (c) {
        if (/Katja Schürmann/.test(c.textContent)) c.addEventListener("click", function () { go("/kontakte/13"); });
      });
    }
    if (view === "planung") {
      btnByText(panel, "Energieplanung bearbeiten").forEach(function (b) { b.addEventListener("click", function () { show("planung_edit"); }); });
    }
    if (view === "planung_edit") {
      btnByText(panel, "Abbrechen").forEach(function (b) { b.addEventListener("click", function () { show("planung"); }); });
      btnByText(panel, "Speichern").forEach(function (b) { b.addEventListener("click", function () { show("planung"); }); });
    }
    if (view === "planung" || view === "planung_edit") {
      btnByText(panel, "Energieplanung löschen").forEach(function (b) { b.addEventListener("click", openDeleteDialog); });
    }
    if (view === "planung") wireBulk();
    if (view === "massnahme_neu" || view === "massnahme_neu_err") {
      btnByText(panel, "Abbrechen").forEach(function (b) { b.addEventListener("click", function () { go("/aktuelle-planungen/planungen/" + curN); }); });
      btnByText(panel, "Speichern").forEach(function (b) { b.addEventListener("click", function () { if (view === "massnahme_neu") show("massnahme_neu_err"); }); });
    }
    if (view === "massnahme") {
      btnByText(panel, "Massnahme bearbeiten").forEach(function (b) { b.addEventListener("click", function () { show("massnahme_edit"); }); });
    }
    if (view === "massnahme_edit") {
      btnByText(panel, "Abbrechen").forEach(function (b) { b.addEventListener("click", function () { show("massnahme"); }); });
      btnByText(panel, "Speichern").forEach(function (b) { b.addEventListener("click", function () { show("massnahme"); }); });
    }
    if (view === "kontakt_neu") {
      btnByText(panel, "Abbrechen").forEach(function (b) { b.addEventListener("click", function () { go("/kontakte"); }); });
    }
    if (view === "kontakt_detail") {
      btnByText(panel, "Kontakt bearbeiten").forEach(function (b) { b.addEventListener("click", function () { go("/kontakte/" + curK + "/bearbeiten"); }); });
    }
    if (view === "kontakt_edit") {
      btnByText(panel, "Abbrechen").forEach(function (b) { b.addEventListener("click", function () { go("/kontakte/" + curK); }); });
      panel.querySelectorAll("form").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); go("/kontakte/" + curK); }); });
      btnByText(panel, "Kontakt löschen").forEach(function (b) { b.addEventListener("click", function () { openDialog(V.$deleteContactDialog, "/kontakte"); }); });
    }
    panel.querySelectorAll('button[data-slot="select-trigger"]').forEach(function (t) {
      var item = t.closest('[data-slot="form-item"]'), lab = item ? (item.querySelector("label") || {}).textContent || "" : "";
      if (/^Planungstyp/.test(lab.trim())) t.addEventListener("click", function (e) { e.preventDefault(); openSelect(t, ["Kommunale Energieplanung", "Regionale Energieplanung"]); });
    });
    panel.querySelectorAll('button[role="combobox"], [data-slot="popover-trigger"] > button').forEach(function (t) {
      var item = t.closest('[data-slot="form-item"]'), lab = item ? (item.querySelector("label") || {}).textContent || "" : "";
      var html = null;
      if (/^Gemeinden/.test(lab.trim())) html = V.$municipalityPopover;
      else if (/^(Beratungsperson|Kontaktperson)/.test(lab.trim()) || /Kontakt auswählen/.test(t.textContent)) html = V.$contactPopover;
      if (html) t.addEventListener("click", function (e) { e.preventDefault(); openPopover(t, html); });
    });
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".v0-popover-host") && !e.target.closest('button[role="combobox"]')) {
      document.querySelectorAll(".v0-popover-host").forEach(function (n) { n.remove(); });
    }
    var a = e.target.closest && e.target.closest("a[href]"); if (!a) return;
    var h = a.getAttribute("href") || "", p = null;
    if (h.indexOf(BASE) === 0) p = h.slice(BASE.length);
    else if (h.indexOf("/energieplanung") === 0) p = h.slice("/energieplanung".length);
    if (p !== null) { e.preventDefault(); go(p.replace(/[?#].*$/, "") || "/"); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeOverlays(); });
  window.addEventListener("hashchange", route);
  route();
})();

// Versionsumschalter: Raster-Icon im Header oeffnet Menue (v0 / v1 / v1.5 / v2)
(function () {
  var icon = document.querySelector(".geo-app-header i.th.icon");
  var btn = icon && icon.closest("button");
  if (!btn) return;
  var VERSIONS = [["v0", "index.html"], ["v1", "../index.html"], ["v1.5", "../v1.5/index.html"], ["v2", "../v2/index.html"]];
  var menu = document.createElement("div");
  menu.className = "v0-version-menu"; menu.hidden = true; menu.setAttribute("role", "menu");
  menu.innerHTML = '<div class="v0-version-title">Version wählen</div>' + VERSIONS.map(function (v) {
    return '<a role="menuitem" href="' + v[1] + '" class="v0-version-item' + (v[0] === "v0" ? " active" : "") + '" data-v0-nav="1">' + v[0] + "</a>";
  }).join("");
  document.body.appendChild(menu);
  function place() {
    var r = btn.getBoundingClientRect();
    menu.style.top = Math.round(r.bottom + 6) + "px";
    menu.style.left = Math.max(8, Math.round(r.left + r.width / 2 - 80)) + "px";
  }
  btn.addEventListener("click", function (e) {
    e.preventDefault(); e.stopPropagation();
    menu.hidden = !menu.hidden; if (!menu.hidden) place();
  });
  document.addEventListener("click", function (e) { if (!menu.contains(e.target)) menu.hidden = true; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") menu.hidden = true; });
  window.addEventListener("resize", function () { if (!menu.hidden) place(); });
})();
