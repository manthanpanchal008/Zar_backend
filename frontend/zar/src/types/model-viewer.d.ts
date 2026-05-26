import type * as React from 'react';

type ModelViewerElementAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string;
  alt?: string;
  poster?: string;
  loading?: 'auto' | 'eager' | 'lazy';
  reveal?: 'auto' | 'interaction' | 'manual';
  exposure?: string | number;
  'camera-controls'?: boolean;
  'auto-rotate'?: boolean;
  'touch-action'?: string;
  'shadow-intensity'?: string | number;
  'interaction-prompt'?: 'auto' | 'none' | 'when-focused';
};

// Augment both runtimes so the element is recognised in all Next.js build modes
declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerElementAttributes;
    }
  }
}

declare module 'react/jsx-dev-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerElementAttributes;
    }
  }
}

declare module '@google/model-viewer';
