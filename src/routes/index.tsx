import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import vid01 from "@/assets/vid-01.mp4.asset.json";
import vid3 from "@/assets/vid-3.mp4.asset.json";
import aerial from "@/assets/aerial.png.asset.json";
import towerContext from "@/assets/tower-context.png.asset.json";
import towerFront from "@/assets/tower-front.png.asset.json";
import balcony from "@/assets/balcony.png.asset.json";
import poolDusk from "@/assets/pool-dusk.png.asset.json";
import poolNight from "@/assets/pool-night.png.asset.json";
import wordmark from "@/assets/wordmark.png.asset.json";
import logo from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: towerFront.url },
      { name: "twitter:image", content: towerFront.url },
    ],
  }),
  component: Index,
});

/* ——— tiny scroll reveal, no dependency ——— */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ——— soft ambient cursor ——— */
function AmbientCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y;
    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const near = el.closest("a, button, [data-cursor]");
      if (ref.current) {
        ref.current.style.width = near ? "68px" : "24px";
        ref.current.style.height = near ? "68px" : "24px";
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    let raf = 0;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (ref.current) ref.current.style.transform = `translate(${x - 12}px, ${y - 12}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);
  if (!enabled) return null;
  return <div ref={ref} className="ambient-cursor" aria-hidden />;
}

/* ——— parallax image ——— */
function Parallax({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      const img = ref.current.querySelector<HTMLElement>("img");
      if (img) img.style.transform = `translate3d(0, ${p * -40}px, 0) scale(1.12)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover will-change-transform"
        style={{ transform: "scale(1.12)" }}
      />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled ? "py-4 backdrop-blur-md" : "py-8"
      }`}
      style={{
        background: scrolled
          ? "linear-gradient(to bottom, oklch(0.1 0.012 250 / 0.65), transparent)"
          : "transparent",
      }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 md:px-14">
        <a href="#top" className="flex items-center gap-3" data-cursor>
          <img src={logo.url} alt="" className="h-7 w-auto opacity-90" />
          <img src={wordmark.url} alt="Cartier" className="h-3 w-auto opacity-90" />
        </a>
        <nav className="hidden gap-12 md:flex">
          {[
            ["Architecture", "#architecture"],
            ["Residences", "#residences"],
            ["Gardens", "#gardens"],
            ["Enquiry", "#enquiry"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="eyebrow text-foreground/80 hover:text-[color:var(--gold)] transition-colors duration-500">
              {label}
            </a>
          ))}
        </nav>
        <a href="#enquiry" className="eyebrow gold-underline hidden md:inline-block">
          Private Viewing
        </a>
      </div>
    </header>
  );
}

function Index() {
  useReveal();
  return (
    <main id="top" className="relative bg-background text-foreground">
      <AmbientCursor />
      <Nav />

      {/* HERO — cinematic silent video */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <video
          src={vid01.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-0 scrim-bottom" />

        <div className="relative z-10 flex h-full flex-col justify-between px-8 pb-16 pt-40 md:px-14 md:pb-24">
          <div className="reveal max-w-xl">
            <p className="eyebrow">Phuket — West Coast — MMXXVI</p>
          </div>

          <div className="reveal">
            <h1 className="font-display text-[13vw] leading-[0.95] tracking-[-0.03em] md:text-[9vw]">
              Architecture
              <br />
              <em className="italic text-[color:var(--gold)]">remembers.</em>
            </h1>
            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-base font-light leading-relaxed text-foreground/75">
                A limited composition of nineteen residences, sculpted into the hillside
                between the forest and the sea.
              </p>
              <div className="flex items-center gap-10">
                <span className="eyebrow text-foreground/60">Scroll</span>
                <div className="h-px w-24 bg-[color:var(--gold)]/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROLOGUE */}
      <section className="relative py-40 md:py-56">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <p className="eyebrow reveal">Prologue</p>
          <p className="reveal font-display mt-10 text-3xl leading-[1.35] text-foreground/90 md:text-[2.6rem]">
            Some places are not built to be seen.
            <br />
            They are built to be <em className="italic text-[color:var(--gold)]">remembered</em> —
            the way light falls at a certain hour, the way silence has a shape,
            the way stone learns to hold warmth.
          </p>
          <div className="hairline reveal mx-auto mt-16 w-40" />
        </div>
      </section>

      {/* AERIAL — the object */}
      <section id="architecture" className="relative">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-8 md:px-14">
          <div className="reveal col-span-12 md:col-span-4 md:pt-24">
            <p className="eyebrow">I — The Composition</p>
            <h2 className="font-display mt-8 text-5xl leading-[1.05] md:text-6xl">
              A single gesture,
              <br />
              drawn across the forest.
            </h2>
            <p className="mt-10 max-w-sm text-sm leading-relaxed text-foreground/70">
              Seen from above, the residence forms a continuous line — a series of rooms
              that curve with the terrain rather than resist it. Nothing is imposed. Nothing
              is unnecessary.
            </p>
          </div>
          <div className="reveal col-span-12 md:col-span-8">
            <Parallax
              src={aerial.url}
              alt="Aerial view of the Cartier residence woven through the tropical canopy at blue hour"
              className="aspect-[3/2] w-full"
            />
          </div>
        </div>
      </section>

      {/* THE TOWER — film */}
      <section className="relative mt-40 md:mt-56">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal grid grid-cols-12 items-end gap-8">
            <div className="col-span-12 md:col-span-7">
              <p className="eyebrow">II — The Vertical</p>
              <h2 className="font-display mt-8 text-6xl leading-[1] md:text-7xl">
                Light becomes
                <br />
                <em className="italic text-[color:var(--gold)]">structure.</em>
              </h2>
            </div>
            <p className="col-span-12 max-w-md text-sm leading-relaxed text-foreground/70 md:col-span-5">
              Nine ascending strata. Each floor a single residence. Each balcony a
              private theatre for the Andaman.
            </p>
          </div>
        </div>

        <div className="relative mt-20 grid grid-cols-12 gap-8 px-8 md:px-14">
          <div className="reveal relative col-span-12 md:col-span-7">
            <Parallax
              src={towerFront.url}
              alt="The Cartier tower — sculpted stratified balconies illuminated at blue hour"
              className="aspect-[3/4] w-full"
            />
          </div>
          <div className="col-span-12 flex flex-col justify-end gap-10 md:col-span-5">
            <div className="reveal">
              <Parallax
                src={towerContext.url}
                alt="The tower rising from the tropical forest with the coastline beyond"
                className="aspect-[4/5] w-full"
              />
            </div>
            <div className="reveal grid grid-cols-2 gap-x-8 gap-y-10 pt-4">
              <Stat k="Residences" v="19" />
              <Stat k="Floors" v="09" />
              <Stat k="Ceilings" v="4.2 m" />
              <Stat k="Elevation" v="118 m" />
            </div>
          </div>
        </div>
      </section>

      {/* WIDE CINEMATIC VIDEO */}
      <section className="relative mt-40 h-[90svh] w-full overflow-hidden md:mt-56">
        <video
          src={vid3.url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 scrim-top" />
        <div className="absolute inset-0 scrim-bottom" />
        <div className="relative z-10 flex h-full items-end px-8 pb-20 md:px-14">
          <div className="reveal max-w-xl">
            <p className="eyebrow">III — Interior</p>
            <p className="font-display mt-6 text-4xl leading-[1.15] md:text-5xl">
              Rooms without corners.
              <br />
              Time without hours.
            </p>
          </div>
        </div>
      </section>

      {/* GARDENS */}
      <section id="gardens" className="relative mt-40 md:mt-56">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">IV — The Grounds</p>
            <h2 className="font-display mt-8 text-6xl leading-[1] md:text-7xl">
              A landscape that
              <br />
              <em className="italic text-[color:var(--gold)]">exhales.</em>
            </h2>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-foreground/70">
              Six terraced gardens descend toward the sea. Water follows stone. Stone
              follows the eye. Nothing points anywhere — everything arrives.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-4 px-8 md:gap-6 md:px-14">
          <div className="reveal col-span-12 md:col-span-7">
            <Parallax src={poolDusk.url} alt="Infinity pool at dusk overlooking the Andaman coast" className="aspect-[3/2]" />
          </div>
          <div className="reveal col-span-12 md:col-span-5">
            <Parallax src={balcony.url} alt="Private balcony overlooking the illuminated gardens below" className="aspect-[3/2] md:aspect-[4/5]" />
          </div>
          <div className="reveal col-span-12 md:col-span-12">
            <Parallax src={poolNight.url} alt="Sculpted pool terrace at deep blue hour" className="aspect-[21/9]" />
          </div>
        </div>
      </section>

      {/* RESIDENCES — as numbered editions */}
      <section id="residences" className="relative mt-40 md:mt-56">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal flex items-end justify-between border-b border-white/10 pb-10">
            <div>
              <p className="eyebrow">V — The Collection</p>
              <h2 className="font-display mt-8 text-6xl leading-[1] md:text-7xl">
                Nineteen editions.
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm leading-relaxed text-foreground/60 md:block">
              Each residence is composed once, then withdrawn from the record.
            </p>
          </div>

          <ol className="mt-4 divide-y divide-white/10">
            {editions.map((r) => (
              <li key={r.no} className="reveal grid grid-cols-12 items-center gap-6 py-10 md:py-12">
                <span className="font-display col-span-2 text-3xl text-[color:var(--gold)] md:text-4xl">
                  {r.no}
                </span>
                <div className="col-span-6 md:col-span-5">
                  <p className="font-display text-2xl md:text-3xl">{r.name}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-foreground/50">
                    {r.orientation}
                  </p>
                </div>
                <p className="col-span-2 text-sm text-foreground/70">{r.area}</p>
                <p className="col-span-2 text-right text-xs uppercase tracking-[0.25em] text-foreground/50 md:text-left">
                  {r.status}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CREDO */}
      <section className="relative py-40 md:py-56">
        <div className="mx-auto max-w-3xl px-8 text-center">
          <div className="hairline reveal mx-auto w-40" />
          <p className="reveal font-display mt-16 text-3xl leading-[1.35] italic text-foreground/90 md:text-[2.4rem]">
            "Ownership begins long
            <br />
            before possession."
          </p>
          <p className="reveal eyebrow mt-10 text-foreground/50">— The Architect</p>
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="enquiry" className="relative border-t border-white/10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-8 py-32 md:px-14 md:py-40">
          <div className="reveal col-span-12 md:col-span-5">
            <p className="eyebrow">Private Viewing</p>
            <h2 className="font-display mt-8 text-5xl leading-[1.05] md:text-6xl">
              By invitation.
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-foreground/70">
              Correspondence is conducted quietly. A member of the architectural office
              will respond within seven days.
            </p>
          </div>

          <form
            className="reveal col-span-12 flex flex-col gap-10 md:col-span-6 md:col-start-7"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Name" name="name" />
            <Field label="Correspondence" name="email" type="email" />
            <Field label="Country of Residence" name="country" />
            <Field label="Reason for Enquiry" name="msg" textarea />
            <button
              type="submit"
              className="eyebrow gold-underline mt-4 self-start"
              data-cursor
            >
              Submit Enquiry —
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-8 px-8 py-16 md:flex-row md:justify-between md:px-14">
          <img src={wordmark.url} alt="Cartier" className="h-3 opacity-70" />
          <p className="eyebrow text-foreground/50">
            Phuket · MMXXVI · An Architectural Edition
          </p>
          <p className="text-xs text-foreground/40">© Cartier Residences</p>
        </div>
      </footer>
    </main>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-display text-4xl text-foreground/95">{v}</p>
      <p className="eyebrow mt-2 text-foreground/50">{k}</p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="group flex flex-col gap-3">
      <span className="eyebrow text-foreground/60">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          className="border-0 border-b border-white/20 bg-transparent pb-2 font-light text-foreground outline-none transition-colors duration-500 focus:border-[color:var(--gold)]"
        />
      ) : (
        <input
          type={type}
          name={name}
          className="border-0 border-b border-white/20 bg-transparent pb-2 font-light text-foreground outline-none transition-colors duration-500 focus:border-[color:var(--gold)]"
        />
      )}
    </label>
  );
}

const editions = [
  { no: "N° 01", name: "The Grove Pavilion", orientation: "Ground · West", area: "412 m²", status: "Reserved" },
  { no: "N° 04", name: "The Canopy Suite", orientation: "Level III · South-West", area: "386 m²", status: "Available" },
  { no: "N° 07", name: "The Reflection Terrace", orientation: "Level V · West", area: "402 m²", status: "Available" },
  { no: "N° 12", name: "The Andaman Belvedere", orientation: "Level VII · West", area: "441 m²", status: "Reserved" },
  { no: "N° 16", name: "The Crescent Room", orientation: "Level VIII · North-West", area: "468 m²", status: "Available" },
  { no: "N° 19", name: "The Summit Residence", orientation: "Level IX · Panoramic", area: "612 m²", status: "By Invitation" },
];
