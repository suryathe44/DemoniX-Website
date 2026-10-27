const panel = document.querySelector(".scanner-panel");

if (panel) {
  panel.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

    panel.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  panel.addEventListener("pointerleave", () => {
    panel.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}

const feedbackForm = document.querySelector("#feedback-form");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!feedbackForm.reportValidity()) return;

    const type = feedbackForm.elements.type.value;
    const clarity = feedbackForm.elements.clarity.value;
    const note = feedbackForm.elements.note.value.trim();
    const title = `[Feedback] ${type}`;
    const body = [
      "## DemoniX & AI Shield Feedback",
      `Category: ${type}`,
      `Guidance clear: ${clarity}`,
      "",
      "## Details",
      note || "No additional note provided.",
      "",
      "---",
      "Submitted via DemoniX Website. Please verify no sensitive credentials or personal financial data are present."
    ].join("\n");

    const url = new URL("https://github.com/suryathe44/AI_Shield/issues/new");
    url.searchParams.set("title", title);
    url.searchParams.set("body", body);
    window.location.assign(url.toString());
  });
}
