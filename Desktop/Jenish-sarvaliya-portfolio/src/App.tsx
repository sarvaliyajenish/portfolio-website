import { useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { CustomCursor } from "./components/CustomCursor";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Portfolio } from "./components/Portfolio";
import { Skills } from "./components/Skills";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  useEffect(() => {
    // Add custom cursor to body
    document.body.style.cursor = "none";

    // Easter egg: Click on logo 5 times for a surprise
    let clickCount = 0;
    const handleLogoClick = () => {
      clickCount++;
      if (clickCount === 5) {
        // Create confetti effect
        const colors = [
          "var(--neon-green)",
          "var(--electric-blue)",
          "var(--coral)",
          "var(--neon-purple)",
        ];
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement("div");
          confetti.style.position = "fixed";
          confetti.style.left =
            Math.random() * window.innerWidth + "px";
          confetti.style.top = "-10px";
          confetti.style.width = "10px";
          confetti.style.height = "10px";
          confetti.style.background =
            colors[Math.floor(Math.random() * colors.length)];
          confetti.style.borderRadius = "50%";
          confetti.style.pointerEvents = "none";
          confetti.style.zIndex = "10000";
          confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
          document.body.appendChild(confetti);

          setTimeout(() => {
            confetti.remove();
          }, 5000);
        }
        clickCount = 0;
      }
    };

    // Add confetti animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fall {
        0% {
          transform: translateY(-100vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Add click listener to logo (will be added after component mounts)
    setTimeout(() => {
      const logo = document.querySelector("h1");
      if (logo) {
        logo.addEventListener("click", handleLogoClick);
      }
    }, 1000);

    return () => {
      document.body.style.cursor = "default";
      style.remove();
    };
  }, []);

  return (
    <ThemeProvider
      defaultTheme="light"
      storageKey="portfolio-theme"
    >
      <div className="min-h-screen bg-background text-foreground">
        <CustomCursor />
        <Navigation />

        <main>
          <Hero />
          <About />
          <Portfolio />
          <Skills />
          <Testimonials />
          <Contact />
        </main>

        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}