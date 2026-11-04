// Portfolio v5: theme toggle, tabs with keyboard support, and the stat counters.
// The counters are the one orchestrated moment on load. Everything else moves
// only in response to a click or a hover.
(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme toggle ---------- */
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab[data-tab]"));

  function activateTab(name, updateHash, moveFocus) {
    var found = false;
    tabs.forEach(function (tab) {
      var isTarget = tab.getAttribute("data-tab") === name;
      if (isTarget) {
        found = true;
        if (moveFocus) tab.focus();
      }
      tab.classList.toggle("is-active", isTarget);
      tab.setAttribute("aria-selected", isTarget ? "true" : "false");
      tab.tabIndex = isTarget ? 0 : -1;
      var panel = document.getElementById("panel-" + tab.getAttribute("data-tab"));
      if (panel) panel.hidden = !isTarget;
    });
    if (!found) return;
    if (updateHash) {
      try { history.replaceState(null, "", "#" + name); } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (tabs.length) {
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        activateTab(tab.getAttribute("data-tab"), true, false);
      });
      tab.addEventListener("keydown", function (ev) {
        var next = null;
        if (ev.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (ev.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (ev.key === "Home") next = tabs[0];
        if (ev.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          ev.preventDefault();
          activateTab(next.getAttribute("data-tab"), true, true);
        }
      });
    });

    document.querySelectorAll("[data-tab-link]").forEach(function (el) {
      el.addEventListener("click", function (ev) {
        ev.preventDefault();
        activateTab(el.getAttribute("data-tab-link"), true, false);
      });
    });

    var initial = (window.location.hash || "").replace("#", "");
    if (initial && document.getElementById("panel-" + initial)) {
      activateTab(initial, false, false);
    } else {
      activateTab(tabs[0].getAttribute("data-tab"), false, false);
    }
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---------- stat counters: run once, when the stats band first appears ---------- */
  function format(value, decimals) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (reduceMotion || isNaN(target)) {
      el.textContent = format(target, decimals);
      return;
    }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(target * eased, decimals);
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = format(target, decimals);
      }
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll(".count");
  if (counters.length && "IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countIO.observe(el); });
  } else {
    counters.forEach(animateCount);
  }
})();
