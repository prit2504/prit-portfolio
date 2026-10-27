import Portfolio from "@/components/portfolio";
import { createProfileSchema, serializeJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script
        id="profile-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(createProfileSchema()),
        }}
      />
      <Portfolio />
    </>
  );
}
