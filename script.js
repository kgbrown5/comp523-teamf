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

// Refresh the static fallback from the journal, which is the source of action items.
var actionScroll = document.getElementById("action-scroll");
if (actionScroll && window.location.protocol !== "file:") {
  fetch("journal.html", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Journal unavailable");
      return response.text();
    })
    .then(function (html) {
      var journal = new DOMParser().parseFromString(html, "text/html");
      var meetings = document.createDocumentFragment();
      var itemCount = 0;

      // The journal is maintained in reverse chronological order.
      journal.querySelectorAll(".journal-entry").forEach(function (entry) {
        var actions = entry.querySelector(".journal-actions");
        var meta = entry.querySelector(".meta");
        if (!actions || !actions.children.length || !meta) return;

        var meeting = document.createElement("article");
        meeting.className = "action-meeting";
        var heading = document.createElement("h3");
        var source = document.createElement("a");
        source.href = "journal.html" + (entry.id ? "#" + entry.id : "");
        source.textContent = meta.textContent.replace(/\s+/g, " ").trim().replace("Meeting Type: ", "");
        heading.appendChild(source);
        meeting.appendChild(heading);

        var list = document.importNode(actions, true);
        list.className = "action-list";
        itemCount += list.children.length;
        meeting.appendChild(list);
        meetings.appendChild(meeting);
      });

      if (!itemCount) {
        var empty = document.createElement("p");
        empty.className = "action-note";
        empty.textContent = "No action items have been recorded in the meeting journal yet.";
        meetings.appendChild(empty);
      }
      actionScroll.replaceChildren(meetings);
      document.getElementById("action-count").textContent = itemCount + (itemCount === 1 ? " item" : " items");
    })
    .catch(function () {
      var status = document.getElementById("action-load-status");
      status.textContent = "Showing saved items. Open the meeting journal for the latest notes.";
      status.hidden = false;
    });
}
