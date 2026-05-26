import styles from './page.module.css';

export const metadata = {
  title: 'Terms of Service — Zar Jewels',
  description: 'Terms of service for using the Zar Jewels website and services.',
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Terms of Service</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
          <p className={styles.text}>
            By accessing and using the Zar Jewels website, you agree to be bound by these terms of service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Use of Content</h2>
          <p className={styles.text}>
            All content on this website, including text, images, designs, and logos, is the property of Zar Gold Bangles Pvt. Ltd. and is protected by intellectual property laws. You may not reproduce, distribute, or use any content without prior written permission.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Product Information</h2>
          <p className={styles.text}>
            We strive to ensure all product information and images on our website are accurate. However, we do not warrant that product descriptions or other content are error-free. Prices and availability are subject to change without notice.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <p className={styles.text}>
            Zar Jewels shall not be liable for any damages arising from the use or inability to use this website. This includes direct, indirect, incidental, and consequential damages.
          </p>
        </div>
      </div>
    </div>
  );
}
