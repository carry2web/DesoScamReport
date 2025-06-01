"use client";

import { useEffect } from 'react';   
import { Page } from "@/components/Page";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/Button";
import Link from 'next/link';
import styles from "./page.module.css";

export default function Home() {
  const { userPublicKey, isAuthChecking } = useAuth();
  const { userProfile } = useUser();

  // Scroll animation setup
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all features and steps
    const features = document.querySelectorAll(`.${styles.feature}`);
    const steps = document.querySelectorAll(`.${styles.step}`);
    
    [...features, ...steps].forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);  

  return (
    <Page>
      <div className={styles.pageContainer}>

        {/* Loading State */}
        {isAuthChecking && (
          <div className={styles.loadingState}>
            <div>Checking authentication...</div>
          </div>
        )}

        {/* Main Welcome Content - Always Visible */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              DeSo Frontend Starter
            </h1>
            <p className={styles.heroSubtitle}>
              Build production-ready DeSo applications without backend or database. 
              Connect directly to DeSo nodes and start shipping social features today.
            </p>

            {/* Dynamic CTA based on auth status */}
            <div className={styles.heroCTA}>
              {userPublicKey ? (
                <>
                  <Button href="/compose/post" size="large">
                    ✨ Try the Modal Composer
                  </Button>
                  <p className={styles.welcomeBack}>
                    Welcome back, {userProfile?.ExtraData?.DisplayName || userProfile?.Username || 'Developer'}! 👋
                  </p>
                </>
              ) : (
                <p className={styles.exploreNote}>
                  🔍 Explore posts, search users, and browse feeds without authentication. 
                  Login to try the full composer experience!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.features}>
          <h2 className={styles.featuresTitle}>Built-in Features & Best Practices</h2>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>DeSo Authentication</h3>
              <p>Ready-to-use auth system with Identity service integration, profile switching, and secure wallet connections.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Network-Resilient React Query</h3>
              <p>Enterprise-grade data fetching with wake-from-sleep protection, smart retry logic, and offline awareness.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>💬</div>
              <h3>Advanced Comment System</h3>
              <p>Optimistic updates, infinite pagination, smart deduplication, and local/remote data merging out of the box.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎨</div>
              <h3>Complete Component Library</h3>
              <p>Professional UI components with dark/light theming, CSS modules, and Storybook documentation.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Modern Next.js App Router</h3>
              <p>Built with Next.js 15.2.4, React 19, intercepting routes for modals, and production-ready patterns.</p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🛠️</div>
              <h3>Developer Experience</h3>
              <p>ESLint configured, Storybook included, and clean folder structure for scaling.</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Connect Your Wallet</h3>
                <p>Use your existing DeSo wallet or create a new one in seconds.</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Create & Share</h3>
                <p>Post your thoughts, share media, and engage with the community.</p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Build Your Network</h3>
                <p>Follow interesting creators and grow your own following organically.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Tech Stack Section */}
        <div className={styles.techStack}>
          <h2 className={styles.sectionTitle}>Built with Modern Tech Stack</h2>
          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <strong>Next.js 15.2.4</strong>
              <span>App Router, Server Components</span>
            </div>
            <div className={styles.techItem}>
              <strong>React 19</strong>
              <span>Latest features, Concurrent rendering</span>
            </div>
            <div className={styles.techItem}>
              <strong>React Query v5</strong>
              <span>Network-resilient data fetching</span>
            </div>
            <div className={styles.techItem}>
              <strong>React Toastify</strong>
              <span>Beautiful toast notifications</span>
            </div>
            <div className={styles.techItem}>
              <strong>CSS Modules</strong>
              <span>Scoped styling, Theme system</span>
            </div>
            <div className={styles.techItem}>
              <strong>Floating UI</strong>
              <span>Precise dropdown positioning</span>
            </div>
            <div className={styles.techItem}>
              <strong>Storybook</strong>
              <span>Component documentation</span>
            </div>
            <div className={styles.techItem}>
              <strong>DeSo Protocol</strong>
              <span>Decentralized social blockchain</span>
            </div>
          </div>
        </div>

        {/* Open Source Section - Always Visible */}
        <div className={styles.openSourceSection}>
          <h2 className={styles.sectionTitle}>🚀 Open Source & Free Forever</h2>
          <p className={styles.openSourceDescription}>
            This starter is MIT licensed and built to empower developers to create amazing DeSo applications. 
            No vendor lock-in, no licensing fees, no hidden costs.
          </p>
          <div className={styles.openSourceLinks}>
            <a 
              href="https://github.com/brootle/deso-starter-nextjs-plus" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              ⭐ Star on GitHub
            </a>
            <span className={styles.linkSeparator}>•</span>
            <a 
              href="https://github.com/brootle/deso-starter-nextjs-plus/blob/master/README.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.docsLink}
            >
              📚 View Documentation
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCTA}>
          {userPublicKey ? (
            <div className={styles.userActions}>
              <h3>Start Building</h3>
              <p>You're logged in! Try the features and see how easy it is to build on DeSo.</p>
              <div className={styles.actionButtons}>
                <Button href="/compose/post" size="large">
                  Try Modal Composer
                </Button>
                <Button 
                  href={`/${userProfile?.Username || userPublicKey}`} 
                  variant="secondary"
                  size="large"
                >
                  View Your Profile
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.developerCTA}>
              <h3>Ready to Build Your DeSo App?</h3>
              <p>Clone this starter and launch your decentralized social application today. Join the DeSo ecosystem!</p>
              <p className={styles.loginNote}>
                💡 <strong>Tip:</strong> Login with the button above to experience the full composer and see how authentication works.
              </p>
            </div>
          )}
        </div>

        {/* User Settings Link */}
        {userPublicKey && (
          <div className={styles.settingsLink}>
            <Link href={`/${userProfile?.Username || userPublicKey}/settings/posts`}>
              Account Settings →
            </Link>
          </div>
        )}

      </div>
    </Page>
  );
}



// "use client";

// import { Page } from "@/components/Page";

// import { useAuth } from "@/context/AuthContext";
// import { useUser } from "@/context/UserContext";

// import Link from 'next/link';

// import styles from "./page.module.css";

// // import { PostEditor } from "@/components/PostEditor";

// export default function Home() {

//   const { 
//     userPublicKey, isAuthChecking, 
//   } = useAuth();

//   // const { userProfile } = useUser();

//   const isDisabled = !userPublicKey || isAuthChecking;

//   return (
//     <Page>
//       <div className={styles.pageContainer}>

//         {/* Public Key Loading State */}
//         {isAuthChecking && <div>Checking authentication...</div>}

//         {/* { userPublicKey && <PostEditor disabled={isDisabled} />} */}
      

//         {
//           userPublicKey && 
//           <Link href={`/${userProfile?.Username || userPublicKey}/settings/posts`}>
//             Settings
//           </Link>           
//         }
    
//       </div>
//     </Page>
//   );
// }