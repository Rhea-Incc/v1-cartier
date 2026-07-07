import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404 — Not found</p>
        <h1 className="font-display mt-6 text-5xl text-foreground">
          This corridor does not exist.
        </h1>
        <div className="mt-10">
          <Link to="/" className="eyebrow gold-underline">
            Return to the residence
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">An interruption</p>
        <h1 className="font-display mt-6 text-4xl">Something failed to load.</h1>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="eyebrow gold-underline"
          >
            Try again
          </button>
          <a href="/" className="eyebrow gold-underline">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cartier — An Architectural Residence" },
      {
        name: "description",
        content:
          "A limited collection of architectural residences composed in silence, precision, and light. Discover Cartier — where ownership begins long before possession.",
      },
      { name: "author", content: "Cartier" },
      { property: "og:title", content: "Cartier — An Architectural Residence" },
      {
        property: "og:description",
        content:
          "A limited collection of architectural residences composed in silence, precision, and light.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cartier — An Architectural Residence" },
      { name: "description", content: "A limited collection of architectural residences composed in silence, precision, and light. Discover Cartier — where ownership begins long before possession." },
      { property: "og:description", content: "A limited collection of architectural residences composed in silence, precision, and light. Discover Cartier — where ownership begins long before possession." },
      { name: "twitter:description", content: "A limited collection of architectural residences composed in silence, precision, and light. Discover Cartier — where ownership begins long before possession." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/5vPgYwXLOcXwWa6AUdDpeQ4YDSr1/social-images/social-1783193116187-1.3.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/5vPgYwXLOcXwWa6AUdDpeQ4YDSr1/social-images/social-1783193116187-1.3.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter+Tight:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Analytics />
    </QueryClientProvider>
  );
}
