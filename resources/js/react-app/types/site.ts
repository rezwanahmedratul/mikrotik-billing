export interface PackageItem {
  id?: number | string;
  name?: string;
  package?: string;
  price: number;
  speed: string;
  category?: 'home' | 'gamer' | 'sme' | 'enterprise' | string;
  popular?: boolean;
  featured?: boolean;
  badge?: string;
  features?: string[];
  description?: string;
  upload_speed?: string;
  download_speed?: string;
  bdix_speed?: string;
  youtube_speed?: string;
  real_ip?: boolean;
}

export interface ReviewItem {
  id?: number | string;
  name?: string;
  customer_name?: string;
  rating?: number;
  comment?: string;
  review?: string;
  package_name?: string;
  package?: string;
  avatar?: string;
  date?: string;
  verified?: boolean;
}

export interface SiteData {
  site_name?: string;
  site_title?: string;
  site_logo?: string;
  site_icon?: string;
  site_favicon?: string;
  site_phone?: string;
  site_email?: string;
  site_address?: string;
  site_description?: string;
  gallery_items?: Array<{
    title: string;
    description: string;
    category: string;
    image?: string;
  }>;
  facebook_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
}

export interface InitialDataPayload {
  siteData?: SiteData;
  packages?: PackageItem[];
  reviews?: ReviewItem[];
  uniqueVisitors?: number;
  totalVisits?: number;
  csrfToken?: string;
  initialPage?: string;
}

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialDataPayload;
  }
}
