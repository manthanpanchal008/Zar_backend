import type { Category, ProductCard, ProductDetail, Style } from '@/types/domain';
import {
  getCategoriesByPurity,
  getProductDetail,
  getProductsByStyle,
  getRelatedProducts,
  getStylesByCategory,
} from '@/lib/data/catalog';

type ProductDetailResponse = {
  product: ProductDetail;
  related: ProductCard[];
};

export async function fetchCategories(purity: string): Promise<Category[]> {
  return getCategoriesByPurity(purity);
}

export async function fetchStyles(purity: string, category: string): Promise<Style[]> {
  return getStylesByCategory(purity, category);
}

export async function fetchProducts(
  purity: string,
  category: string,
  style: string
): Promise<ProductCard[]> {
  return getProductsByStyle(purity, category, style);
}

export async function fetchProductDetail(
  purity: string,
  category: string,
  style: string,
  id: string
): Promise<ProductDetailResponse> {
  const product = getProductDetail(purity, category, style, id);

  if (!product) {
    throw new Error('Product not found');
  }

  return {
    product,
    related: getRelatedProducts(purity, category, style, id),
  };
}
