import { litFixture, html } from "@nfq/test-helpers";
import "./styles.css";

const template = html`<p>Hello world!</p>`;
const container = litFixture(template);

describe("Issue: React Fake Link", () => {
  it("renders", () => {
    const p = container.querySelector("p");
    expect(p).toBeInTheDocument();
    expect(p.textContent).toBe("Hello world!");
  });
});

// Add event listener to button
const button = document.getElementById("unrotate");
if (button) {
  button.addEventListener("click", function () {
    // Reset transform on all images
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.style.transform = "";
    });
  });
}