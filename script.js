document.addEventListener("click", function (event) {
  var btn = event.target.closest(".copy-btn");
  if (!btn) return;

  var target = document.getElementById(btn.getAttribute("data-copy-target"));
  if (!target) return;

  var text = target.textContent.trim();
  var originalLabel = btn.getAttribute("data-label") || btn.textContent;

  function showCopied() {
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(function () {
      btn.textContent = originalLabel;
      btn.classList.remove("copied");
    }, 1500);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showCopied, function () {
      fallbackCopy(text, showCopied);
    });
  } else {
    fallbackCopy(text, showCopied);
  }
});

function fallbackCopy(text, onDone) {
  var temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "fixed";
  temp.style.opacity = "0";
  document.body.appendChild(temp);
  temp.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    /* clipboard unavailable; text remains selectable on the page */
  }
  document.body.removeChild(temp);
  onDone();
}
