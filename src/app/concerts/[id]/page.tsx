import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacyConcertDetailRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/ko/concerts/${id}`);
}
