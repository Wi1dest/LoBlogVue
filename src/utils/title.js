let titleTime, OriginTitile = document.title;
document.addEventListener("visibilitychange", (function () {
  document.hidden ? (document.title = "Lo哔哔机", clearTimeout(titleTime)) : (document.title = "Siu!!!", titleTime = setTimeout((function () {
    document.title = OriginTitile
  }), 2e3))
}));
