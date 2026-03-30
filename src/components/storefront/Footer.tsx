"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function AnimatedTagline() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay so the animation is visible even if footer is in viewport on load
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const words = [
    "Premium",
    "Li-Ning",
    "and",
    "Anta",
    "basketball",
    "shoes",
    "in",
    "Singapore.",
    "Authentic",
    "performance",
    "footwear",
    "that's",
    "truly",
    "underrated.",
  ];

  return (
    <p
      ref={ref}
      className="text-sm text-muted-foreground leading-relaxed overflow-hidden"
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            filter: isVisible ? "blur(0px)" : "blur(4px)",
            transitionDelay: `${i * 80}ms`,
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-tight mb-3">UNDERATED</h3>
            <AnimatedTagline />
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-foreground transition-colors"
                >
                  All Shoes
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?brand=li-ning"
                  className="hover:text-foreground transition-colors"
                >
                  Li-Ning
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?brand=anta"
                  className="hover:text-foreground transition-colors"
                >
                  Anta
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://www.carousell.sg/my-account/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Carousell
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Underated. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
