'use client';

import parse from 'html-react-parser';
import CartButton from '@/components/ui/atoms/CartButton/CartButton';
import styles from './ProductInfo.module.css';
import type { ProductDetail } from '@/types/domain';
import { useAppDispatch } from '@/store/hooks';
import { addItem, toggleCart } from '@/features/cart/cartSlice';

interface ProductDetails extends Pick<
  ProductDetail,
  'id' | 'sku' | 'description' | 'price' | 'image' | 'pcs' | 'finish' | 'technicalSpecs' | 'manufacturing' | 'manufacturingHtml'
> {
  title: string;
  specifications?: Record<string, string>;
  purity?: string;
}

interface ProductInfoProps {
  product: ProductDetails;
}

function renderManufacturingContent(manufacturing: ProductDetails['manufacturing'], manufacturingHtml: ProductDetails['manufacturingHtml']) {
  if (manufacturingHtml) {
    return (
      <div className={styles.manufacturingContainer}>
        {parse(manufacturingHtml)}
      </div>
    );
  }

  if (manufacturing) {
    return (
      <div className={styles.manufacturingContainer}>
        <h2 className={styles.manufacturingHeading}>{manufacturing.heading}</h2>
        <p className={styles.manufacturingSubtitle}>{manufacturing.subtitle}</p>
        <ul className={styles.manufacturingList}>
          {manufacturing.points.map((point) => (
            <li key={point.label} className={styles.manufacturingItem}>
              <span className={styles.manufacturingLabel}>{point.label}: </span>
              {point.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const dispatch = useAppDispatch();

  function handleAddToCart() {
    dispatch(addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      purity: product.purity,
    }));
    dispatch(toggleCart());
  }

  const manufacturingContent = renderManufacturingContent(product.manufacturing, product.manufacturingHtml);

  return (
      <div className={styles.infoContainer}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.sku}>{product.sku}</p>

        <div className={styles.actions}>
          <CartButton            
            onClick={handleAddToCart}
            className={styles.enquireBtn}
          />
        </div>

        <div className={styles.description}>
          <p>{product.description}</p>
        </div>

        {/* Inline meta: purity, pcs, finish */}
        {(product.purity || product.pcs || product.finish) && (
          <div className={styles.metaRow}>
            {product.purity && (
              <div className={styles.metaItem}>
                <svg
                  className={styles.metaIcon}
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <mask id="mask0_61_936" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                    <path d="M0.75 35.25V0.75H35.25V35.25H0.75Z" fill="white" stroke="white" strokeWidth="1.5" />
                  </mask>
                  <g mask="url(#mask0_61_936)">
                    <path d="M28.5 18C28.5 17.9739 28.5208 17.9531 28.5469 17.9531C28.573 17.9531 28.5938 17.9739 28.5938 18C28.5938 18.0261 28.573 18.0469 28.5469 18.0469C28.5208 18.0469 28.5 18.0261 28.5 18Z" fill="#D0B480" stroke="#D0B480" strokeWidth="1.5" />
                    <path d="M0.703121 18C0.703121 27.3199 8.68008 35.2969 18 35.2969C27.3199 35.2969 35.2969 27.3199 35.2969 18C35.2969 8.68008 27.3199 0.703121 18 0.703121C8.68008 0.703121 0.703121 8.68008 0.703121 18Z" stroke="#D0B480" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 31.5703C25.3666 31.5703 31.5703 25.3666 31.5703 18C31.5703 10.6334 25.3666 4.42969 18 4.42969C10.6334 4.42969 4.42969 10.6334 4.42969 18C4.42969 25.3666 10.6334 31.5703 18 31.5703Z" stroke="#D0B480" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M28.1719 15.2109C26.947 10.744 22.8506 7.45195 17.9991 7.45195" stroke="#D0B480" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.7812 22.2188C16.5199 21.3061 19.4801 21.3061 22.2188 22.2188C21.7624 20.8491 21.5339 19.4245 21.5339 18C21.5339 16.5755 21.7624 15.1509 22.2188 13.7812C20.8491 14.2376 19.4245 14.4661 18 14.4661C16.5755 14.4661 15.1509 14.2376 13.7812 13.7812C14.2376 15.1509 14.4661 16.5755 14.4661 18C14.4661 19.4245 14.2376 20.8491 13.7812 22.2188Z" stroke="#D0B480" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
                <span>{product.purity}</span>
              </div>
            )}

            {product.pcs && (
              <div className={styles.metaItem}>
                <div>
                  <span className={styles.metaText}>Pcs:</span> {product.pcs}
                </div>
              </div>
            )}

            {product.finish && (
              <div className={styles.metaFinishItem}>
                <div className={styles.finishLine}>
                  <span className={styles.metaText}>Finish:</span> {product.finish}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Weight breakdown */}
        <div className={styles.specificationsContainer}>
          <h2 className={styles.specificationsTitle}>Weight</h2>
          <div className={styles.weightGrid}>
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} className={styles.weightItem}>
                <span className={styles.weightLabel}>{key}</span>
                <span className={styles.weightValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications table */}
        {product.technicalSpecs && product.technicalSpecs.length > 0 && (
          <div className={styles.techSpecsContainer}>
            <h2 className={styles.specificationsTitle}>Technical Specifications</h2>
            <table className={styles.techSpecTable}>
              <thead>
                <tr>
                  <th className={styles.techSpecHeader}>Feature</th>
                  <th className={styles.techSpecHeader}>Details</th>
                </tr>
              </thead>
              <tbody>
                {product.technicalSpecs.map((spec) => (
                  <tr key={spec.feature} className={styles.techSpecRow}>
                    <td className={styles.techSpecFeature}>{spec.feature}</td>
                    <td className={styles.techSpecDetails}>{spec.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Manufacturing & Customization Support - PRIORITY TO HTML */}
        {manufacturingContent}
      </div>
  );
}