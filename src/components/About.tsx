import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const text = "Yo! 👋 I'm Prajwal, a Full-Stack Dev who's obsessed with building stuff that actually matters. Whether it's crafting slick, high-level UI/UX or engineering hyper-scalable backend systems, I am totally locked in. 🚀 From slaying bugs in fast-paced agile setups to leveling up code quality. Always learning, always building, always vibing.";
  const title = "About Me";

  useEffect(() => {
    if (!containerRef.current) return;

    let ctx = gsap.context(() => {
      const chars = gsap.utils.toArray('.bouncy-char');
      const words = gsap.utils.toArray('.bouncy-word');

      // Create a ScrollTrigger that does NOT touch the DOM until the section enters the viewport
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        once: true, // Only trigger animation once
        onEnter: () => {
          // Play bouncy title animation
          gsap.fromTo(
            chars,
            { y: 100, opacity: 0, rotationZ: () => gsap.utils.random(-45, 45) },
            {
              y: 0,
              opacity: 1,
              rotationZ: 0,
              duration: 1.5,
              stagger: 0.1,
              ease: "elastic.out(1, 0.3)",
            }
          );

          // Play random bouncy paragraph animation
          gsap.fromTo(
            words,
            { y: 50, opacity: 0, scale: 0, rotation: () => gsap.utils.random(-90, 90) },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 2,
              stagger: 0.02,
              ease: "elastic.out(1, 0.5)",
              delay: 0.3, // slight delay after title starts
            }
          );
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-section" id="about" ref={containerRef}>
      <div className="about-me">
        <h3 className="title">
          {title.split("").map((char, i) => (
            <span key={i} className="bouncy-char" style={{ display: "inline-block" }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h3>
        <p className="para">
          {text.split(" ").map((word, i) => (
            <span key={i} className="bouncy-word" style={{ display: "inline-block", marginRight: "6px" }}>
              {word}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default About;
