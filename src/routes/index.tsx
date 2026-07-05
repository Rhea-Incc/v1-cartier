import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

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
import entrance from "@/assets/entrance.png.asset.json";
import towerLowAngle from "@/assets/tower-low-angle.png.asset.json";
import estateAerial2 from "@/assets/estate-aerial-2.png.asset.json";
import lobby from "@/assets/lobby.jpg.asset.json";
import interiorConcept from "@/assets/interior-concept.jpg.asset.json";
import sculptedFacade from "@/assets/sculpted-facade.jpg.asset.json";

// Media served from Lovable's CDN. Prefixing with an absolute origin makes
// every asset resolve identically from Vercel, Railway, or any other host —
// the /__l5e/assets-v1/* path is only routable on lovable.app domains.
const MEDIA_ORIGIN = "https://v1-cartier.lovable.app";
const media = (u: string) => (/^https?:\/\//i.test(u) ? u : `${MEDIA_ORIGIN}${u}`);

const MEDIA = {
  vid01: media(vid01.url),
  vid3: media(vid3.url),
  aerial: media(aerial.url),
  towerContext: media(towerContext.url),
  towerFront: media(towerFront.url),
  balcony: media(balcony.url),
  poolDusk: media(poolDusk.url),
  poolNight: media(poolNight.url),
  wordmark: media(wordmark.url),
  logo: media(logo.url),
  entrance: media(entrance.url),
  towerLowAngle: media(towerLowAngle.url),
  estateAerial2: media(estateAerial2.url),
  lobby: media(lobby.url),
  interiorConcept: media(interiorConcept.url),
  sculptedFacade: media(sculptedFacade.url),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: MEDIA.towerFront },
      { name: "twitter:image", content: MEDIA.towerFront },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useActiveChapter(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.45, 0.65], rootMargin: "-20% 0px -35% 0px" },
    );

    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function AmbientCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const near = el.closest("a, button, [data-cursor], input, textarea");
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${scrolled ? "py-4 backdrop-blur-md" : "py-8"}`}
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
            ["Belonging", "#belonging"],
            ["Collection", "#collection"],
            ["Residence", "#residence"],
            ["Estate", "#estate"],
            ["Reservation", "#reservation"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="eyebrow text-foreground/80 transition-colors duration-500 hover:text-[color:var(--gold)]"
            >
              {label}
            </a>
          ))}
        </nav>
        <a href="#reservation" className="eyebrow gold-underline hidden md:inline-block">
          Private Viewing
        </a>
      </div>
    </header>
  );
}

function SceneChapters({ activeId }: { activeId: string }) {
  return (
    <aside className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="scene-panel flex flex-col gap-4 px-5 py-6">
        <p className="eyebrow text-[10px] text-foreground/45">Phase 02 — Belonging</p>
        <div className="flex flex-col gap-3">
          {chapters.map((chapter) => {
            const active = activeId === chapter.id;
            return (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                data-cursor
                className="group flex items-center gap-3"
              >
                <span className={`chapter-line ${active ? "chapter-line-active" : ""}`} />
                <span
                  className={`text-[11px] uppercase tracking-[0.24em] transition-colors duration-500 ${
                    active ? "text-[color:var(--gold)]" : "text-foreground/38 group-hover:text-foreground/72"
                  }`}
                >
                  {chapter.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function PhaseLead() {
  return (
    <section id="belonging" className="relative py-28 md:py-40">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-8 md:px-14">
        <div className="reveal col-span-12 md:col-span-3">
          <p className="eyebrow">Phase 02</p>
          <h2 className="font-display mt-6 text-4xl leading-none md:text-5xl">Belonging</h2>
        </div>
        <div className="reveal col-span-12 md:col-span-7 md:col-start-5">
          <p className="font-display text-3xl leading-[1.3] text-foreground/88 md:text-[2.65rem]">
            Admiration gives way to ownership the moment architecture stops being the
            object of attention and quietly becomes the setting of life.
          </p>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-foreground/66">
            These chapters do not explain Cartier. They lead the visitor through a gradual
            emotional shift — from observing a place to unconsciously inhabiting it.
          </p>
        </div>
      </div>
    </section>
  );
}

function Index() {
  useReveal();
  const chapterIds = useMemo(() => chapters.map((chapter) => chapter.id), []);
  const activeChapter = useActiveChapter(chapterIds);

  return (
    <main id="top" className="relative bg-background text-foreground">
      <AmbientCursor />
      <Nav />
      <SceneChapters activeId={activeChapter} />

      <section className="relative h-[100svh] w-full overflow-hidden">
        <video
          src={vid3.url}
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
            <p className="eyebrow">Phuket — West Coast — Cartier Residences</p>
          </div>

          <div className="reveal">
            <h1 className="font-display text-[13vw] leading-[0.95] tracking-[-0.03em] md:text-[9vw]">
              Belonging
              <br />
              <em className="italic text-[color:var(--gold)]">begins quietly.</em>
            </h1>
            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-base font-light leading-relaxed text-foreground/75">
                The visitor no longer stands outside Cartier. They begin to imagine a life
                already unfolding within it.
              </p>
              <div className="flex items-center gap-10">
                <span className="eyebrow text-foreground/60">Enter Phase 02</span>
                <div className="h-px w-24 bg-[color:var(--gold)]/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <PhaseLead />

      <section id="collection" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal mb-14 grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className="eyebrow">The Collection</p>
              <h2 className="font-display mt-6 text-5xl leading-[1.02] md:text-6xl">
                Residences as
                <br />
                architectural editions.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <p className="max-w-xl text-sm leading-relaxed text-foreground/68">
                Each residence is introduced as a singular composition — defined by light,
                orientation, and its private relationship with the landscape. Never a unit.
                Never inventory. Always an edition.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {collectionCards.map((card, index) => (
              <article
                key={card.title}
                className={`reveal group relative overflow-hidden ${
                  index === 0 ? "col-span-12 md:col-span-7" : index === 1 ? "col-span-12 md:col-span-5" : "col-span-12 md:col-span-4"
                }`}
              >
                <Parallax src={card.image} alt={card.alt} className={index === 0 ? "aspect-[4/5]" : index === 1 ? "aspect-[4/5]" : "aspect-[4/5]"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="eyebrow text-foreground/70">{card.edition}</p>
                  <h3 className="font-display mt-4 text-3xl leading-none md:text-4xl">{card.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/70 opacity-0 transition-opacity duration-700 group-hover:opacity-100 md:opacity-80">
                    {card.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="editions" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal flex items-end justify-between border-b border-white/10 pb-10">
            <div>
              <p className="eyebrow">Editions</p>
              <h2 className="font-display mt-6 text-5xl leading-none md:text-6xl">A numbered gallery.</h2>
            </div>
            <p className="hidden max-w-sm text-sm leading-relaxed text-foreground/58 md:block">
              Selection becomes a cinematic entry point rather than a transaction.
            </p>
          </div>

          <ol className="mt-4 divide-y divide-white/10">
            {editions.map((r) => (
              <li key={r.no} className="reveal grid grid-cols-12 items-center gap-6 py-10 md:py-12">
                <span className="font-display col-span-3 text-3xl text-[color:var(--gold)] md:col-span-2 md:text-4xl">
                  {r.no}
                </span>
                <div className="col-span-9 md:col-span-4">
                  <p className="font-display text-2xl md:text-3xl">{r.name}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-foreground/50">{r.orientation}</p>
                </div>
                <p className="col-span-6 text-sm text-foreground/70 md:col-span-2">{r.area}</p>
                <p className="col-span-6 text-sm text-foreground/55 md:col-span-2">{r.qualifier}</p>
                <p className="col-span-12 text-xs uppercase tracking-[0.25em] text-foreground/50 md:col-span-2 md:text-right">
                  {r.status}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="residence" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal max-w-2xl">
            <p className="eyebrow">The Residence</p>
            <h2 className="font-display mt-6 text-5xl leading-[1.02] md:text-7xl">
              Morning enters.
              <br />
              Silence follows.
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-12 gap-6">
            <div className="reveal col-span-12 md:col-span-7">
              <Parallax
                src={lobby.url}
                alt="Grand Cartier lobby with sculpted layered stone walls and soft circular skylight"
                className="aspect-[16/10]"
              />
            </div>
            <div className="col-span-12 grid gap-6 md:col-span-5">
              <div className="reveal">
                <Parallax
                  src={interiorConcept.url}
                  alt="Fluid interior architecture with soft reflected light and sculptural forms"
                  className="aspect-[4/5]"
                />
              </div>
              <div className="reveal scene-panel p-8 md:p-10">
                <p className="font-display text-3xl leading-[1.2] text-foreground/88">
                  “Morning enters quietly. Every curve softens light. Time feels less measured here.”
                </p>
                <div className="mt-8 grid grid-cols-1 gap-4 text-sm text-foreground/60">
                  <span>— uninterrupted walkthroughs</span>
                  <span>— daylight as material</span>
                  <span>— terraces opening into the sea air</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="atmosphere" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal mb-14 max-w-2xl">
            <p className="eyebrow">The Atmosphere</p>
            <h2 className="font-display mt-6 text-5xl leading-[1.05] md:text-6xl">
              Life appears without
              <br />
              ever being staged.
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="reveal col-span-12 md:col-span-5">
              <Parallax
                src={entrance.url}
                alt="Cartier entrance glowing softly at blue hour between palms and reflected light"
                className="aspect-[4/5]"
              />
            </div>
            <div className="reveal col-span-12 md:col-span-7">
              <Parallax
                src={poolNight.url}
                alt="Quiet pool terrace at night suggesting books, water, and warm evening rituals"
                className="aspect-[16/10]"
              />
            </div>
            <div className="reveal col-span-12 md:col-span-6">
              <p className="font-display max-w-xl text-3xl leading-[1.25] text-foreground/86 md:text-4xl">
                Steam from coffee. Rain against glass. Trees reflected in still water. Architecture becomes the condition for feeling calm.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="craft" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className="eyebrow">Invisible Luxury</p>
              <h2 className="font-display mt-6 text-5xl leading-[1.02] md:text-6xl">
                Precision, not ornament.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <p className="max-w-2xl text-sm leading-relaxed text-foreground/68">
                Luxury is revealed through edge conditions, reflections, joinery, shadow depth,
                and the way materials receive light. Not through declaration.
              </p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
            {materialMoments.map((moment) => (
              <div key={moment.label} className="reveal scene-panel p-6 md:p-8">
                <p className="font-display text-2xl text-foreground/92 md:text-3xl">{moment.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/58">{moment.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wellbeing" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal mb-14 max-w-2xl">
            <p className="eyebrow">Wellbeing</p>
            <h2 className="font-display mt-6 text-5xl leading-[1.05] md:text-6xl">
              Wellness, translated into architecture.
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="reveal col-span-12 md:col-span-6">
              <Parallax
                src={poolDusk.url}
                alt="Water garden terraces glowing softly at dusk"
                className="aspect-[4/3]"
              />
            </div>
            <div className="reveal col-span-12 md:col-span-6">
              <Parallax
                src={sculptedFacade.url}
                alt="Sculpted facade with rounded terraces and soft internal glow"
                className="aspect-[4/3]"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
            {wellbeingSpaces.map((space) => (
              <div key={space.name} className="reveal scene-panel p-5">
                <p className="eyebrow text-foreground/45">{space.was}</p>
                <p className="font-display mt-3 text-2xl">{space.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="estate" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal mb-14 grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <p className="eyebrow">The Estate</p>
              <h2 className="font-display mt-6 text-5xl leading-[1.02] md:text-6xl">
                An ecosystem, not a plot.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <p className="max-w-xl text-sm leading-relaxed text-foreground/68">
                The journey continues from residence to garden, from water to architecture,
                from architecture to coastline — without ever feeling like a page transition.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="reveal col-span-12 md:col-span-7">
              <Parallax
                src={estateAerial2.url}
                alt="Aerial view of the Cartier estate woven through gardens and water bodies"
                className="aspect-[16/10]"
              />
            </div>
            <div className="reveal col-span-12 md:col-span-5">
              <Parallax
                src={balcony.url}
                alt="Balcony outlook over the estate, pools, and distant coastline at sunset"
                className="aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="availability" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-8 md:px-14">
          <div className="reveal mb-14 max-w-2xl">
            <p className="eyebrow">Availability</p>
            <h2 className="font-display mt-6 text-5xl leading-[1.05] md:text-6xl">
              Scarcity is seen, never announced.
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="reveal col-span-12 md:col-span-7">
              <Parallax
                src={towerLowAngle.url}
                alt="Low angle view of the illuminated Cartier tower at dusk"
                className="aspect-[4/5]"
              />
            </div>
            <div className="col-span-12 flex flex-col justify-center gap-4 md:col-span-5">
              {availabilityStates.map((item) => (
                <div key={item.label} className="reveal scene-panel flex items-center justify-between px-6 py-5">
                  <div>
                    <p className="font-display text-2xl">{item.label}</p>
                    <p className="mt-1 text-sm text-foreground/55">{item.copy}</p>
                  </div>
                  <span className={`h-4 w-4 rounded-full ${item.className}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="reservation" className="relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0">
          <img
            src={aerial.url}
            alt="Night aerial of the Cartier estate behind the reservation form"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.08_0.012_250_/_0.72),oklch(0.08_0.012_250_/_0.92))]" />
        </div>

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-8 py-28 md:px-14 md:py-40">
          <div className="reveal col-span-12 md:col-span-5">
            <p className="eyebrow">Reservation</p>
            <h2 className="font-display mt-6 text-5xl leading-[1.05] md:text-6xl">
              An invitation,
              <br />
              completed quietly.
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-foreground/72">
              Correspondence is handled discreetly. The interface recedes. The relationship begins.
            </p>
          </div>

          <form
            className="reveal scene-panel col-span-12 flex flex-col gap-10 px-6 py-8 md:col-span-5 md:col-start-8 md:px-10 md:py-10"
            onSubmit={(e) => e.preventDefault()}
          >
            <Field label="Name" name="name" />
            <Field label="Email" name="email" type="email" />
            <Field label="Preferred Edition" name="edition" />
            <Field label="Private Consultation" name="msg" textarea />
            <button type="submit" className="eyebrow gold-underline mt-4 self-start" data-cursor>
              Submit Enquiry —
            </button>
            <p className="font-display text-2xl text-[color:var(--gold)]">Welcome to Cartier.</p>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-8 px-8 py-16 md:flex-row md:justify-between md:px-14">
          <img src={wordmark.url} alt="Cartier" className="h-3 opacity-70" />
          <p className="eyebrow text-foreground/50">Phuket · Phase 02 · Belonging</p>
          <p className="text-xs text-foreground/40">© Cartier Residences</p>
        </div>
      </footer>
    </main>
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

const chapters = [
  { id: "belonging", label: "Belonging" },
  { id: "collection", label: "Collection" },
  { id: "editions", label: "Editions" },
  { id: "residence", label: "Residence" },
  { id: "atmosphere", label: "Atmosphere" },
  { id: "craft", label: "Invisible Luxury" },
  { id: "wellbeing", label: "Wellbeing" },
  { id: "estate", label: "Estate" },
  { id: "availability", label: "Availability" },
  { id: "reservation", label: "Reservation" },
];

const collectionCards = [
  {
    edition: "Edition N° 04",
    title: "The Arrival Piece",
    image: entrance.url,
    alt: "Cartier arrival facade illuminated at blue hour",
    copy: "A residence introduced through ceremony, proportion, and the first encounter with light.",
  },
  {
    edition: "Edition N° 12",
    title: "The Vertical Room",
    image: towerLowAngle.url,
    alt: "Tower residence rising with rounded balconies and warm internal lighting",
    copy: "A sculptural ascent where every floor turns toward a different relation with the horizon.",
  },
  {
    edition: "Edition N° 19",
    title: "The Coastline Belvedere",
    image: towerFront.url,
    alt: "Front view of the Cartier tower at blue hour",
    copy: "The final edition, composed for long evening light and uninterrupted silence.",
  },
];

const editions = [
  { no: "N° 01", name: "The Grove Pavilion", orientation: "Ground · West", area: "412 m²", qualifier: "garden threshold", status: "Reserved" },
  { no: "N° 04", name: "The Canopy Suite", orientation: "Level III · South-West", area: "386 m²", qualifier: "morning light", status: "Available" },
  { no: "N° 07", name: "The Reflection Terrace", orientation: "Level V · West", area: "402 m²", qualifier: "water horizon", status: "Available" },
  { no: "N° 12", name: "The Andaman Belvedere", orientation: "Level VII · West", area: "441 m²", qualifier: "evening panorama", status: "Reserved" },
  { no: "N° 16", name: "The Crescent Room", orientation: "Level VIII · North-West", area: "468 m²", qualifier: "private sky view", status: "Available" },
  { no: "N° 19", name: "The Summit Residence", orientation: "Level IX · Panoramic", area: "612 m²", qualifier: "ceremonial arrival", status: "By Invitation" },
];

const materialMoments = [
  { label: "Stone", copy: "Texture that receives daylight rather than merely reflecting it." },
  { label: "Bronze", copy: "Warm detailing with a softened edge and measured glow." },
  { label: "Glass", copy: "Reflections that shift with the visitor like moving water." },
  { label: "Timber", copy: "Grain treated as quiet architecture, not decoration." },
  { label: "Water", copy: "The final surface — alive, reflective, impossibly calm." },
];

const wellbeingSpaces = [
  { was: "Gym", name: "Movement Studio" },
  { was: "Spa", name: "Sanctuary" },
  { was: "Pool", name: "Water Garden" },
  { was: "Lounge", name: "Library" },
  { was: "Business Centre", name: "Private Salon" },
];

const availabilityStates = [
  {
    label: "Available",
    copy: "Warmly illuminated — still within the constellation.",
    className: "bg-[color:var(--gold)] shadow-[0_0_18px_color-mix(in_oklab,var(--gold)_70%,transparent)]",
  },
  {
    label: "Reserved",
    copy: "A softened neutral glow — already quietly spoken for.",
    className: "bg-white/45",
  },
  {
    label: "Sold",
    copy: "Darkened entirely — absorbed into private life.",
    className: "bg-black/80 ring-1 ring-white/10",
  },
];

void vid01;
void towerContext;
