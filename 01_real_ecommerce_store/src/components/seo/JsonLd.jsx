/**
 * Reusable JSON-LD structured data component for SEO.
 * Renders a <script type="application/ld+json"> tag in the <head>.
 * 
 * Usage:
 *   <JsonLd data={schemaObject} />
 */

export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generate Organization schema for the Blitz brand.
 */
export function getOrganizationSchema(baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Blitz Store",
    url: baseUrl,
    logo: `${baseUrl}/Blitz-ecommerce-store-logo.png`,
    description:
      "Premium e-commerce store in Pakistan offering quality products with Cash on Delivery and EasyPaisa payments.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-349-5526117",
      contactType: "customer service",
      email: "faizanzahid150@gmail.com",
      availableLanguage: ["English", "Urdu"],
      areaServed: "PK",
    },
    sameAs: [
      "https://github.com/Faizanzahid-166",
      "https://www.linkedin.com/in/faizan-zahid-9671942a6/",
      "https://www.youtube.com/@ProgrammingHub-7107/playlists",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
    },
  };
}

/**
 * Generate WebSite schema with SearchAction for sitelinks search box.
 */
export function getWebSiteSchema(baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Blitz Store",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Product schema for a single product.
 */
export function getProductSchema(product, baseUrl) {
  const productUrl = `${baseUrl}/products/${product.id}`;
  const imageUrl =
    product.image_url ||
    (product.image_urls && product.image_urls.length > 0
      ? product.image_urls[0]
      : `${baseUrl}/Blitz-ecommerce-store-logo.png`);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description || `Buy ${product.name} at Blitz Store Pakistan.`,
    image: imageUrl,
    url: productUrl,
    sku: product.product_no ? String(product.product_no) : product.id,
    brand: {
      "@type": "Brand",
      name: "Blitz",
    },
    category: product.category || "General",
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "PKR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Blitz Store",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "300",
          currency: "PKR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PK",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
  };
}

/**
 * Generate BreadcrumbList schema.
 */
export function getBreadcrumbSchema(items, baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined,
    })),
  };
}

/**
 * Generate FAQPage schema from an array of { q, a } objects.
 */
export function getFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
