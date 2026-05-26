export interface ShowcaseModel {
  name: string;
  src: string;
  alt: string;
  poster: string;
  url?: string;
}

export const showcaseModels: ShowcaseModel[] = [
  {
    name: 'Dazzling-1',
    src: '/images/models/ZAR-1.glb',
    alt: 'Interactive 3D jewellery model 1',
    poster: '/images/homepage/product_1.webp',
    url: 'collections/18k/bangles-bracelet/plain/plain-1',
  },
  {
    name: 'Dazzling-2',
    src: '/images/models/ZAR-2.glb',
    alt: 'Interactive 3D jewellery model 2',
    poster: '/images/homepage/product_2.webp',
    url: 'collections/18k/bangles-bracelet/plain/plain-1',

  },
  {
    name: 'Dazzling-3',
    src: '/images/models/ZAR-3.glb',
    alt: 'Interactive 3D jewellery model 3',
    poster: '/images/homepage/product_3.webp',
    url: 'collections/18k/bangles-bracelet/plain/plain-1',

  },
  {
    name: 'Dazzling-4',
    src: '/images/models/ZAR-4.glb',
    alt: 'Interactive 3D jewellery model 4',
    poster: '/images/homepage/product_4.webp',
    url: 'collections/18k/bangles-bracelet/plain/plain-1',

  },
];

const modelPreloadCache = new Map<string, Promise<void>>();

export function preloadModel(src: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  const existingRequest = modelPreloadCache.get(src);

  if (existingRequest) {
    return existingRequest;
  }

  const request = fetch(src)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to preload model: ${src}`);
      }

      return response.blob();
    })
    .then(() => undefined)
    .catch((error) => {
      modelPreloadCache.delete(src);
      throw error;
    });

  modelPreloadCache.set(src, request);

  return request;
}

export function preloadShowcaseModels(count: number): Promise<PromiseSettledResult<void>[]> {
  return Promise.allSettled(showcaseModels.slice(0, count).map((model) => preloadModel(model.src)));
}

export function getNextShowcaseModel(currentIndex: number): ShowcaseModel {
  return showcaseModels[(currentIndex + 1) % showcaseModels.length];
}