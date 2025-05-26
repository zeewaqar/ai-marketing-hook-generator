export interface Hook {
    seo: {
      title: string;
      meta_desc: string;
      keywords: string[];
      og_title: string;
      og_desc: string;
      og_image: string;
      twitter_title: string;
      twitter_desc: string;
    };
    copy: {
      cta: string[];
      tweet: string;
      linkedin: string;
      facebook: string;
      instagram: { caption: string; hashtags: string[] };
    };
  }
  