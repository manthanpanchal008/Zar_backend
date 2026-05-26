import React from 'react';
import styles from './Testimonials.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface Testimonial {
  message: string;
  name: string;
  designation: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const isMobile = useIsMobile();
  return (
    <section className="mt-100 mb-100">
      <div className="container">
        <h4 className="fs_54 txt_center">What Our Customers Say</h4>
        {isMobile ? (
          <Swiper slidesPerView={1} spaceBetween={24} className={styles.text_testi_slider}>
            {testimonials.map((testi, idx) => (
              <SwiperSlide key={idx}>
                <div className={styles.testimonialCard }>
                  <div className={styles.testimonialText }>{testi.message}</div>
                  <div className={styles.testimonialName }>{testi.name}</div>
                  <div className={styles.testimonialDesignation }>{testi.designation}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className={styles.testimonialGrid}>
            {testimonials.map((testi, idx) => (
              <div className={styles.testimonialCard } key={idx}>
                <div className={styles.testimonialText }>{testi.message}</div>
                <div className={styles.testimonialName }>{testi.name}</div>
                <div className={styles.testimonialDesignation }>{testi.designation}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
