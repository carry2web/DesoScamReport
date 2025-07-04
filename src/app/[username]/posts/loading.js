import { Page } from '@/components/Page';
import { PostPlaceholder } from '@/components/Post';

import styles from './page.module.css';

const POSTS_PER_PAGE = 10;

export default function Loading() {
  return (
    <Page>
        <div className={styles.postsContainer}>
        {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
            <PostPlaceholder key={i} />
        ))}
        </div>        
    </Page>
  );
}