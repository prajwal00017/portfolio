import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect, useState } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  const [hideIcons, setHideIcons] = useState(false);

  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });

    // Hide social icons when contact section is in view
    let rafId: number;
    const checkContactVisibility = () => {
      const contactEl = document.getElementById("contact");
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        // The contact section starts when its top is above the bottom of the viewport
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setHideIcons(isVisible);
      }
      rafId = requestAnimationFrame(checkContactVisibility);
    };
    rafId = requestAnimationFrame(checkContactVisibility);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className={`icons-section ${hideIcons ? "icons-hidden" : ""}`}>
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/prajwal00017" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/prajwal-singh-5a4785206/" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://x.com/prajwal_singh4u" target="_blank">
            <FaXTwitter />
          </a>
        </span>
      </div>
      <a className="resume-button" href="/Resume_PRS.pdf" target="_blank" rel="noopener noreferrer">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
