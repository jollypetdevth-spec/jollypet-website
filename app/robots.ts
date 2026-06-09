import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://jollypet.co.th";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/products/", "/about", "/contact"],
        disallow: ["/admin/", "/api/", "/checkout/", "/orders/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
