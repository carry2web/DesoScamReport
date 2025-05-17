import { Page } from '@/components/Page';
import { isMaybePublicKey } from '@/utils/profileUtils';
import { PostsPageClient } from './PostsPageClient';

export async function generateMetadata({ params }) {
  const { username } = await params
  const rawParam = decodeURIComponent(username);
  const isPublicKey = isMaybePublicKey(rawParam);
  const lookupKey = !isPublicKey && rawParam.startsWith('@') ? rawParam.slice(1) : rawParam;

  return {
    title: `${lookupKey} • Posts`,
    description: `All posts made by ${lookupKey}`,
    openGraph: {
      title: `${lookupKey} • Posts`,
      description: `All posts made by ${lookupKey}`,
    },
    twitter: {
      title: `${lookupKey} • Posts`,
      description: `All posts made by ${lookupKey}`,
    },
  };
}

export default async function PostsPage({ params }) {
  const { username } = await params
  const rawParam = decodeURIComponent(username);
  return (
    <Page>
      <PostsPageClient rawParam={rawParam} />
    </Page>
  );
}
