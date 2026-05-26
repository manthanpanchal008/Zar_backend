import styles from './page.module.css';

export const metadata = {
  title: 'Privacy Policy — Zar Jewels',
  description: 'Privacy policy for Zar Jewels website and services.',
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Privacy Policy</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Information We Collect</h2>
          <p className={styles.text}>
            We collect personal information you provide directly to us, such as your name, email address, phone number, and any other information you submit through our contact forms or when making enquiries about our products.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
          <p className={styles.text}>
            We use the information we collect to respond to your enquiries, process your requests, improve our services, and communicate with you about our collections and exhibitions. We do not sell your personal information to third parties.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Security</h2>
          <p className={styles.text}>
            We implement appropriate security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <p className={styles.text}>
            If you have any questions about this privacy policy, please contact us at info@zarjewels.com or visit our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
