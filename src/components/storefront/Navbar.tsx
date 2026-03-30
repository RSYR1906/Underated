"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">UNDERATED</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/shop"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/shop?brand=li-ning"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Li-Ning
          </Link>
          <Link
            href="/shop?brand=anta"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Anta
          </Link>
        </nav>

        {/* Cart + mobile menu */}
        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {mounted && totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link
            href="/shop"
            className="block text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Shop All
          </Link>
          <Link
            href="/shop?brand=li-ning"
            className="block text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Li-Ning
          </Link>
          <Link
            href="/shop?brand=anta"
            className="block text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Anta
          </Link>
        </div>
      )}
    </header>
  );
}
