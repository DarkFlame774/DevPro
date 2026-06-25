import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import TerminalTemplate from "@/components/templates/TerminalTemplate";

async function fetchProfile(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profiles/${slug}`, {
    cache: 'no-store', // Always fetch fresh data (no caching during dev)
  });

  if (!res.ok) return null;
  return res.json();
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const payload = await fetchProfile(slug);

  if (!payload || !payload.evidence) {
    return { title: "Profile Not Found — DevPro" };
  }

  const profile = payload.evidence;

  const name = profile.identity?.name || slug;
  const bio = profile.identity?.bio || profile.identity?.headline || "Developer Portfolio";

  return {
    title: `${name} — DevPro`,
    description: bio,
    openGraph: {
      title: `${name} — Developer Portfolio`,
      description: bio,
      images: profile.identity?.avatarUrl ? [profile.identity.avatarUrl] : [],
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await fetchProfile(slug);

  if (!payload || !payload.evidence) {
    notFound();
  }

  const profile = payload.evidence;
  const template = payload.themePreferences?.template || profile.metadata?.template || "professional";

  // Dispatch to the correct template
  switch (template) {
    case "minimal":
      return <MinimalTemplate profile={profile} slug={slug} />;
    case "terminal":
      return <TerminalTemplate profile={profile} slug={slug} />;
    case "professional":
    default:
      return <ProfessionalTemplate profile={profile} slug={slug} />;
  }
}
