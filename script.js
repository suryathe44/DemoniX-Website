const panel = document.querySelector(".scanner-panel");

if (panel) {
  panel.addEventListener("pointermove", (event) => {
    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

    panel.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  panel.addEventListener("pointerleave", () => {
    panel.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}