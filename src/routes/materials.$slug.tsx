import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";

import materialStone from "@/assets/material-stone.png.asset.json";
import materialTimber from "@/assets/material-timber.png.asset.json";
import materialGlass from "@/assets/material-glass.png.asset.json";
import materialBronze from "@/assets/material-bronze.png.asset.json";
import materialWater from "@/assets/material-water.png.asset.json";
import wordmark from "@/assets/wordmark.png.asset.json";
import { ContourField } from "@/components/ContourField";

const MEDIA_ORIGIN = "https://v1-cartier.lovable.app";
const media = (u: string) => (/^https?:\/\//i.test(u) ? u : `${MEDIA_ORIGIN}${u}`);

type Material = {
  slug: string;
  label: string;
  index: string;
  tagline: string;
  poem: string;
  image: string;
  passages: { eyebrow: string; heading: string; body: string }[];
  where: string[];
  next: { slug: string; label: string };
};

const materials: Record<string, Material> = {
  stone: {
    slug: "stone",
    label: "Stone",
    index: "Material N° 01",
    tagline: "Texture that receives daylight rather than merely reflecting it.",
    poem:
      "Cut from mountains that pre-date the ocean. Laid by hand, joint by joint, until the wall stops being a wall and becomes a horizon.",
    image: media(materialStone.url),
    passages: [
      {
        eyebrow: "Source",
        heading: "Quarried in daylight.",
        body: "Each panel is chosen from a single face of stone so that grain, colour, and weathering read continuously along a corridor or a garden path.",
      },
      {
        eyebrow: "Craft",
        heading: "Dry-set by hand.",
        body: "Fitters work the wall in silence. The mortar is recessed until it disappears; the eye reads only mass, shadow, and the slow arithmetic of edges.",
      },
      {
        eyebrow: "Behaviour",
        heading: "Warms with the day.",
        body: "By late afternoon the stone holds the sun. Palms rest against it. Rooms borrow its temperature after the light has gone.",
      },
    ],
    where: [
      "The arrival wall at the entrance colonnade",
      "The plinth beneath every residence",
      "The garden threshold between water and terrace",
      "The interior spine of the lobby",
    ],
    next: { slug: "timber", label: "Timber" },
  },
  timber: {
    slug: "timber",
    label: "Timber",
    index: "Material N° 02",
    tagline: "Grain treated as quiet architecture, not decoration.",
    poem:
      "Twelve species, patient and slow, ordered from lightest to deepest. Each block a private hour of the day.",
    image: media(materialTimber.url),
    passages: [
      {
        eyebrow: "Selection",
        heading: "A palette, not a finish.",
        body: "Ash, oak, walnut, teak, ebony — chosen for how they behave under morning light and lamp light, not for how they sample in a brochure.",
      },
      {
        eyebrow: "Assembly",
        heading: "Joinery that hides itself.",
        body: "Panels are drawn from the same log and book-matched, so a doorway, a wardrobe, and a ceiling can share one continuous grain across three rooms.",
      },
      {
        eyebrow: "Care",
        heading: "Oiled, never lacquered.",
        body: "The surface is fed rather than sealed. Time is welcome here — the timber deepens rather than dulls, as with a leather-bound book.",
      },
    ],
    where: [
      "Full-height entry doors to every residence",
      "The ceiling of the private library",
      "Cabinetry in the kitchens and dressing rooms",
      "The joinery of the reading niches on every level",
    ],
    next: { slug: "glass", label: "Glass" },
  },
  glass: {
    slug: "glass",
    label: "Glass",
    index: "Material N° 03",
    tagline: "Reflections that shift with the visitor like moving water.",
    poem:
      "A wall of light held in colour. The sea rearranges itself on the floor each afternoon, and the room breathes with it.",
    image: media(materialGlass.url),
    passages: [
      {
        eyebrow: "Composition",
        heading: "A mosaic of daylight.",
        body: "Hand-poured art glass, panel by panel, in tones drawn from the horizon at Kata — dawn rose, teal, dusk gold. Each square is unique.",
      },
      {
        eyebrow: "Craft",
        heading: "Set into a bronze lattice.",
        body: "The armature is warm-blackened bronze, machined to millimetre tolerances so the wall reads as a single sheet of light rather than a series of parts.",
      },
      {
        eyebrow: "Behaviour",
        heading: "Writes on the floor.",
        body: "By noon the marble is patterned in colour. By evening the wall glows from within, quietly, and the pattern turns inward.",
      },
    ],
    where: [
      "The double-height wall of the lobby",
      "The threshold between library and terrace",
      "The pavilion at the water garden",
      "The eastern face of the wellness sanctuary",
    ],
    next: { slug: "bronze", label: "Bronze" },
  },
  bronze: {
    slug: "bronze",
    label: "Bronze",
    index: "Material N° 04",
    tagline: "Warm detailing with a softened edge and measured glow.",
    poem:
      "The first material the hand meets. Warmed by the palm long before the door decides to open.",
    image: media(materialBronze.url),
    passages: [
      {
        eyebrow: "Alloy",
        heading: "A single foundry.",
        body: "Cast in a workshop that has served European museums for four generations. The alloy is proprietary — enough copper to hold warmth, enough tin to hold silence.",
      },
      {
        eyebrow: "Finish",
        heading: "Hand-rubbed patina.",
        body: "No two handles are identical. Each is polished, then bathed, then polished again — a process closer to bookbinding than to hardware.",
      },
      {
        eyebrow: "Behaviour",
        heading: "Ages toward you.",
        body: "Where the hand rests, the metal brightens over the years. The residence quietly records its own inhabitation.",
      },
    ],
    where: [
      "Every door handle, drawer pull, and switch plate",
      "The frame of the stained-glass lobby wall",
      "Balustrade caps on the terraces and staircases",
      "The dedication plate inside the entry door",
    ],
    next: { slug: "water", label: "Water" },
  },
  water: {
    slug: "water",
    label: "Water",
    index: "Material N° 05",
    tagline: "The final surface — alive, reflective, impossibly calm.",
    poem:
      "The estate exhales through water. Basins, mirrors, and channels return the sky, the garden, and, eventually, the visitor.",
    image: media(materialWater.url),
    passages: [
      {
        eyebrow: "Presence",
        heading: "Held, never contained.",
        body: "Every pool is a black-stone mirror set flush with the terrace, so the horizon and the water read as one uninterrupted plane at dusk.",
      },
      {
        eyebrow: "Engineering",
        heading: "Silent movement.",
        body: "Recirculation is drawn from concealed slot returns. The surface is always in motion; the room never hears it.",
      },
      {
        eyebrow: "Rituals",
        heading: "The estate's clock.",
        body: "At dawn the pools are still. By noon they hold the trees. In the evening, lamps drift into them — the estate reads its own reflection back to itself.",
      },
    ],
    where: [
      "The arrival mirror at the ceremonial court",
      "The infinity terrace of the water garden",
      "The reflecting channel through the private garden of each residence",
      "The night pool at the summit level",
    ],
    next: { slug: "stone", label: "Stone" },
  },
};

export const Route = createFileRoute("/materials/$slug")({
  loader: ({ params }) => {
    const material = materials[params.slug];
    if (!material) throw notFound();
    return { material };
  },
  head: ({ loaderData }) => {
    const m = loaderData?.material;
    return {
      meta: [
        { title: m ? `${m.label} — Cartier Material Palette` : "Cartier Material" },
        {
          name: "description",
          content: m?.tagline ?? "The Cartier material palette.",
        },
        { property: "og:title", content: m ? `${m.label} — Cartier` : "Cartier" },
        { property: "og:description", content: m?.tagline ?? "" },
        { property: "og:image", content: m?.image ?? "" },
        { name: "twitter:image", content: m?.image ?? "" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: MaterialPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <p className="eyebrow">Not in the palette</p>
        <Link to="/" className="eyebrow gold-underline mt-6 inline-block">
          Return
        </Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="eyebrow">An interruption. </p>
    </div>
  ),
});

function MaterialPage() {
  const { material } = Route.useLoaderData() as { material: Material };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <main className="relative bg-background text-foreground">
      <div className="fixed inset-x-0 top-0 z-40 px-8 py-6 md:px-14">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={media(wordmark.url)} alt="Cartier" className="h-3 opacity-90" />
          </Link>
          <Link to="/" className="eyebrow gold-underline">
            ← Return to the residence
          </Link>
        </div>
      </div>

      {/* HERO — full-bleed material image */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <img
          src={material.image}
          alt={material.label}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.08_0.012_250_/_0.35),oklch(0.08_0.012_250_/_0.55)_60%,oklch(0.08_0.012_250_/_0.9))]" />
        <ContourField variant="quiet" />
        <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-20 md:px-14 md:pb-32">
          <p className="eyebrow">{material.index}</p>
          <h1 className="font-display mt-6 text-[18vw] leading-[0.9] tracking-[-0.03em] md:text-[13vw]">
            {material.label}
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/80 md:text-lg">
            {material.tagline}
          </p>
        </div>
      </section>

      {/* POEM */}
      <section className="relative py-32 md:py-48">
        <ContourField variant="quiet" />
        <div className="relative mx-auto max-w-[1200px] px-8 md:px-14">
          <p className="font-display text-3xl leading-[1.35] text-foreground/90 md:text-5xl">
            {material.poem}
          </p>
        </div>
      </section>

      {/* PASSAGES */}
      <section className="relative py-16 md:py-24">
        <ContourField variant="dense" />
        <div className="relative mx-auto max-w-[1600px] px-8 md:px-14">
          {material.passages.map((p, i) => (
            <article
              key={p.heading}
              className="grid grid-cols-12 gap-8 border-t border-white/10 py-16 md:py-24"
            >
              <div className="col-span-12 md:col-span-3">
                <p className="eyebrow">{p.eyebrow}</p>
                <p className="font-display mt-4 text-xl text-foreground/50">
                  {String(i + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="col-span-12 md:col-span-8 md:col-start-5">
                <h2 className="font-display text-4xl leading-[1.05] md:text-5xl">
                  {p.heading}
                </h2>
                <p className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/70">
                  {p.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHERE */}
      <section className="relative overflow-hidden py-24 md:py-40">
        <div className="absolute inset-0">
          <img
            src={material.image}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.08_0.012_250_/_0.75),oklch(0.08_0.012_250_/_0.92))]" />
        </div>
        <ContourField variant="warm" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-8 md:px-14">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow">Where it lives</p>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] md:text-5xl">
              Placed with intention.
            </h2>
          </div>
          <ol className="col-span-12 md:col-span-7 md:col-start-6">
            {material.where.map((w, i) => (
              <li
                key={w}
                className="grid grid-cols-[3rem_1fr] items-baseline gap-6 border-t border-white/10 py-6 md:py-8"
              >
                <span className="font-display text-lg text-[color:var(--gold)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-2xl leading-snug text-foreground/85 md:text-3xl">
                  {w}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* NEXT */}
      <section className="relative border-t border-white/10 py-24 md:py-32">
        <ContourField variant="quiet" />
        <div className="relative mx-auto flex max-w-[1600px] flex-col gap-8 px-8 md:flex-row md:items-end md:justify-between md:px-14">
          <div>
            <p className="eyebrow">Continue through the palette</p>
            <p className="font-display mt-4 text-3xl md:text-4xl">The next material.</p>
          </div>
          <Link
            to="/materials/$slug"
            params={{ slug: material.next.slug }}
            className="font-display text-5xl leading-none text-[color:var(--gold)] md:text-6xl"
          >
            {material.next.label} →
          </Link>
        </div>
      </section>
    </main>
  );
}
