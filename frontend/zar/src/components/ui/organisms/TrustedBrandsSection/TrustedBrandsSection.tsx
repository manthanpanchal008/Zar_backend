"use client";

import ClientLogo from '@/components/ui/molecules/ClientLogo/ClientLogo';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import { Autoplay } from 'swiper/modules';
import styles from './TrustedBrandsSection.module.css';
const brands = [
  { name: 'anjali', logo: '/images/clients/anjali.webp' },
  { name: 'b.c.sen', logo: '/images/clients/b.c.sen.webp' },
  { name: 'bhima', logo: '/images/clients/bhima.webp' },
  { name: 'goldplus', logo: '/images/clients/goldplus.webp' },
  { name: 'josco', logo: '/images/clients/josco.webp' },
  { name: 'joyalukkas', logo: '/images/clients/joyalukkas.webp' },
  { name: 'Kalyan Jewellers', logo: '/images/clients/kalyan.webp' },
  { name: 'khazana', logo: '/images/clients/khazana.webp' },
  { name: 'malabar', logo: '/images/clients/malabar.webp' },
  { name: 'nac', logo: '/images/clients/nac.webp' },
  { name: 'p.c.chandra', logo: '/images/clients/p.c.chandra.webp' },
  { name: 'prince', logo: '/images/clients/prince.webp' },
  { name: 'sawansukha', logo: '/images/clients/sawansukha.webp' },
  { name: 'senco', logo: '/images/clients/senco.webp' },
  { name: 'tanishq', logo: '/images/clients/tanishq.webp' },
];

export default function TrustedBrandsSection() {
  return (
    <section className="mt-100 mb-100">
      <div className={styles.inner}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="fs_54">Trusted Across Generations</h2>
          <p className="">
            Built on decades of craftsmanship and consistency, ZAR continues to earn the trust of retail partners across generations through precision, reliability, and lasting relationships.
          </p>
        </motion.div>
      </div>
      <motion.div 
        className={styles.marquee}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView="auto"
          loop={true}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <ClientLogo name={brand.name} logo={brand.logo} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}
