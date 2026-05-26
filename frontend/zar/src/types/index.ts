/* Navigation */
export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

/* Collection */
export interface Collection {
  id: string;
  name: string;
  image: string;
  category?: string;
  description?: string;
}

/* Feature Card */
export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

/* Testimonial */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  image: string;
}

/* Exhibition Event */
export interface Exhibition {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

/* Client Brand */
export interface ClientBrand {
  id: string;
  name: string;
  logo: string;
}

/* Instagram Post */
export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
}

/* Stat */
export interface Stat {
  value: string;
  label: string;
}

/* Footer Stats Section */
export interface FooterStat {
  value: string;
  label: string;
  description: string;
}
