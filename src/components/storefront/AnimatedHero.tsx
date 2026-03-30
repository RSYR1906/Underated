"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AnimatedHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Subtle animated background gradient */}
      <div
        className="absolute inset-0 opacity-30 transition-opacity duration-2000"
        style={{
          opacity: mounted ? 0.3 : 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(120,120,120,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(80,80,80,0.2) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
        <div className="max-w-2xl space-y-6">
          {/* Heading — line 1 */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            <span className="block overflow-hidden">
              <span
                className="inline-block transition-all duration-700 ease-out"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(100%)",
                }}
              >
                Premium Basketball Shoes.
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="inline-block transition-all duration-700 ease-out"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(100%)",
                  transitionDelay: "200ms",
                }}
              >
                <span className="text-gray-400">Truly Underated.</span>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg text-gray-300 max-w-lg transition-all duration-700 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "500ms",
            }}
          >
            Authentic Li-Ning and Anta performance basketball shoes in
            Singapore. Quality that speaks for itself.
          </p>

          {/* CTA Button */}
          <div
            className="flex gap-4 transition-all duration-700 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "700ms",
            }}
          >
            <Link href="/shop">
              <Button size="lg" variant="secondary" className="font-semibold">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Animated accent line */}
          <div
            className="h-px bg-linear-to-r from-white/60 via-white/20 to-transparent transition-all duration-1000 ease-out"
            style={{
              width: mounted ? "100%" : "0%",
              opacity: mounted ? 1 : 0,
              transitionDelay: "900ms",
            }}
          />
        </div>
      </div>
    </section>
  );
}
