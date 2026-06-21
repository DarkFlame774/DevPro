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
  const profile = await fetchProfile(slug);

  if (!profile) {
    return { title: "Profile Not Found — DevPro" };
  }

  const name = profile.user?.name || slug;
  const bio = profile.user?.bio || "Developer Portfolio";

  return {
    title: `${name} — DevPro`,
    description: bio,
    openGraph: {
      title: `${name} — Developer Portfolio`,
      description: bio,
      images: profile.user?.avatar_url ? [profile.user.avatar_url] : [],
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await fetchProfile(slug);

  if (!profile) {
    notFound();
  }

  const template = profile.metadata?.template || "professional";

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
