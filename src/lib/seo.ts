import type { Metadata } from "next";
import { profile, skillGroups } from "./portfolio";

/** Only an explicitly configured public origin is used for canonical URLs. */
export function getSiteUrl(
  value = process.env.SITE_URL?.trim() || profile.website,
): string | undefined {
  if (!value?.trim()) return undefined;
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error(
      "SITE_URL must be an absolute public URL, such as https://your-domain.com.",
    );
  }
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/" ||
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  )
    throw new Error(
      "SITE_URL must be a public HTTP(S) origin without a path, credentials, query, or fragment.",
    );
  return url.origin;
}

export const seo = {
  title: "Prit Panchal | Full-Stack AI Engineer · Generative AI & Agents",
  description:
    "Prit Panchal is a Full-Stack AI Engineer in Vadodara, India, building multi-agent banking assistants, RAG and NL2SQL systems, and AML/FINTRAC automation with Python, LangGraph, FastAPI, and vLLM.",
  imagePath: "/social-image",
  imageAlt:
    "Prit Panchal — Full-Stack AI Engineer. Generative AI, multi-agent systems, RAG, NL2SQL, and Python backend engineering. Vadodara, India.",
};

export function createMetadata(url = getSiteUrl()): Metadata {
  const image = url
    ? {
        url: `${url}${seo.imagePath}`,
        width: 1200,
        height: 630,
        alt: seo.imageAlt,
        type: "image/png",
      }
    : undefined;
  return {
    ...(url
      ? { metadataBase: new URL(url), alternates: { canonical: `${url}/` } }
      : {}),
    title: seo.title,
    description: seo.description,
    applicationName: "Prit Panchal Portfolio",
    authors: [{ name: profile.name, ...(url ? { url: `${url}/` } : {}) }],
    creator: profile.name,
    publisher: profile.name,
    category: "technology",
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: "Prit Panchal | AI Engineer",
      type: "website",
      locale: "en_IN",
      ...(url ? { url: `${url}/` } : {}),
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      ...(image ? { images: [{ url: image.url, alt: image.alt }] } : {}),
    },
  };
}

export function createProfileSchema(url = getSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    ...(url ? { "@id": `${url}/#profile`, url: `${url}/` } : {}),
    name: seo.title,
    description: seo.description,
    inLanguage: "en-IN",
    mainEntity: {
      "@type": "Person",
      ...(url ? { "@id": `${url}/#person`, url: `${url}/` } : {}),
      name: profile.name,
      jobTitle: profile.role,
      description:
        "Full-Stack AI Engineer building LLM-powered banking applications, multi-agent workflows, retrieval-augmented generation, NL2SQL, and compliance automation.",
      email: profile.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vadodara",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      worksFor: { "@type": "Organization", name: "Navaera Software Services" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "SVIT, Vasad" },
      knowsAbout: skillGroups.flatMap((group) => [...group.items]),
    },
  };
}

/** Escape '<' so content can never terminate the JSON-LD script element. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
