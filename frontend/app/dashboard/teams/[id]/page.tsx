import { TeamDetails } from "./TeamDetails";

// This is required for static site generation with dynamic routes
export async function generateStaticParams() {
  // In production, you would fetch this from your API
  // For now, we'll return a static list of IDs
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function TeamDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <TeamDetails id={params.id} />;
}
