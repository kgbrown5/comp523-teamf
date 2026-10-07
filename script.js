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

// Keep the timeline usable as a native horizontal scroller without JavaScript.
var milestoneTrack = document.getElementById("milestone-track");
if (milestoneTrack) {
  var timelineControls = document.querySelector(".timeline-controls");
  var previousMilestone = timelineControls.querySelector('[data-direction="-1"]');
  var nextMilestone = timelineControls.querySelector('[data-direction="1"]');
  timelineControls.hidden = false;

  function updateTimelineControls() {
    previousMilestone.disabled = milestoneTrack.scrollLeft < 2;
    nextMilestone.disabled = milestoneTrack.scrollLeft + milestoneTrack.clientWidth >= milestoneTrack.scrollWidth - 2;
  }

  timelineControls.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    var cards = Array.from(milestoneTrack.children);
    var current = cards.reduce(function (best, card, index) {
      return Math.abs(card.offsetLeft - cards[0].offsetLeft - milestoneTrack.scrollLeft) <
        Math.abs(cards[best].offsetLeft - cards[0].offsetLeft - milestoneTrack.scrollLeft) ? index : best;
    }, 0);
    var next = Math.max(0, Math.min(cards.length - 1, current + Number(button.dataset.direction)));
    milestoneTrack.scrollTo({
      left: cards[next].offsetLeft - cards[0].offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  });

  // Tapping anywhere on a card reveals its details on touch screens too.
  milestoneTrack.addEventListener("click", function (event) {
    var card = event.target.closest(".milestone");
    if (card) card.focus({ preventScroll: true });
  });
  milestoneTrack.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && event.target.closest(".milestone")) {
      milestoneTrack.focus({ preventScroll: true });
    }
  });
  milestoneTrack.addEventListener("scroll", updateTimelineControls, { passive: true });
  window.addEventListener("resize", updateTimelineControls);
  var demoWeek = document.getElementById("demo-week");
  if (!window.location.hash && demoWeek) {
    milestoneTrack.scrollLeft = demoWeek.offsetLeft - milestoneTrack.firstElementChild.offsetLeft;
  }
  updateTimelineControls();
}
