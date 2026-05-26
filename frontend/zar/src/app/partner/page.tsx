import Button from '@/components/ui/atoms/Button/Button';
import InputField from '@/components/ui/atoms/InputField/InputField';
import PhoneField from '@/components/ui/atoms/PhoneField/PhoneField';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import SelectField from '@/components/ui/atoms/SelectField/SelectField';
import TextareaField from '@/components/ui/atoms/TextareaField/TextareaField';
import Image from 'next/image';
import styles from './page.module.css';

export const metadata = {
  title: 'Become a Partner — Zar Jewels',
  description: 'Partner with India\'s leading gold bangle manufacturer. Join the Zar network of trusted retailers.',
};

export default function PartnerPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partner', isActive: true },
        ]}
        heading="Become a Partner"
        description="Collaborate with ZAR to grow your retail business with precision-crafted gold jewellery, supported by consistent quality, scalable manufacturing, and trusted supply."
      />

      <div className='bannerImage'>
        <Image
          src="/images/partner_bg.webp"
          alt="Crafting gold bangle"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className={styles.content}>
        <div className="container">
          <h2 className="formHeading txt_center mt-100">Distributor Testimonials</h2>
          <div className={styles.benefitsGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.benefitCard}>
                <Image src="/images/Distributor-Testimonials.png" alt="Benefit" width={300} height={280} style={{ objectFit: 'cover' }} className='imgFluid'/>
                <h3 className={styles.benefitTitle}>Benefit Title {i}</h3>
                <p className={styles.benefitSubtitle}>Benefit subtitle description goes here.</p>
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            <div className={styles.formSection}>
              <h2 className="formHeading">Build A Connection With Zar</h2>
              <form className={styles.form}>
                <div className={styles.formRow}>
                  <InputField
                    id="name"
                    name="name"
                    label="Full Name"
                    placeholder="Type full name here"
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                  <InputField
                    id="company"
                    name="company"
                    label="Company Name"
                    placeholder="Type your company name here"
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <SelectField
                    id="country"
                    name="country"
                    label="Country"
                    placeholder="Select your country"
                    options={[
                      { label: 'India', value: 'india' },
                      { label: 'Other', value: 'other' },
                    ]}
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                  <SelectField
                    id="state"
                    name="state"
                    label="State"
                    placeholder="Select your state"
                    options={[
                      { label: 'Maharashtra', value: 'maharashtra' },
                      { label: 'Gujarat', value: 'gujarat' },
                      { label: 'Other', value: 'other' },
                    ]}
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <SelectField
                    id="city"
                    name="city"
                    label="City"
                    placeholder="Select your city"
                    options={[
                      { label: 'Mumbai', value: 'mumbai' },
                      { label: 'Surat', value: 'surat' },
                      { label: 'Other', value: 'other' },
                    ]}
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                  <InputField
                    id="pincode"
                    name="pincode"
                    label="Pincode"
                    placeholder="Enter your pincode"
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <InputField
                    id="email"
                    name="email"
                    type="email"
                    label="Email ID"
                    placeholder="Enter your email ID"
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                  <PhoneField
                    id="phone"
                    name="phone"
                    label="Contact No."
                    placeholder="Enter your contact number"
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <SelectField
                    id="category"
                    name="category"
                    label="Category"
                    placeholder="Select Category"
                    options={[
                      { label: 'Distributor', value: 'distributor' },
                      { label: 'Retailer', value: 'retailer' },
                      { label: 'Wholesaler', value: 'wholesaler' },
                    ]}
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                  <SelectField
                    id="referred_by"
                    name="referred_by"
                    label="Referred By"
                    placeholder="Select referred by"
                    options={[
                      { label: 'ZAR Retail Partner', value: 'zar_retail_partner' },
                      { label: 'Distributor', value: 'distributor' },
                      { label: 'Social Media', value: 'social_media' },
                    ]}
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <InputField
                    id="website"
                    name="website"
                    label="Company Website"
                    placeholder="Type your company website URL here"
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <TextareaField
                    id="message"
                    name="message"
                    label="Message"
                    placeholder="Type here..."
                    wrapperClassName={styles.inputGroup}
                    required
                  />
                </div>
                <Button variant="primary" showArrow>
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
