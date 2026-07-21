export const site = {
  name: "Care1st Dental Institute",
  shortName: "Care1st",
  tagline: "Excellence in Dental Education",
  description:
    "A modern dental training and education facility for hands-on instruction, continuing education, professional collaboration, and industry events.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://care1stdental.com",
  phone: "(972) 315-2345",
  phoneHref: "tel:+19723152345",
  email: "meetdrlee@gmail.com",
  emailHref: "mailto:meetdrlee@gmail.com",
  address: {
    street: "1548 Valwood Pkwy Ste 100",
    city: "Carrollton",
    state: "TX",
    zip: "75006",
    full: "1548 Valwood Pkwy Ste 100, Carrollton, TX 75006",
  },
  social: {
    instagram: "https://www.instagram.com/care1stdental/",
    facebook: "https://www.facebook.com/care1stdental/",
  },
} as const;

export const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#training", label: "Training" },
  { href: "/#facility", label: "Facility" },
  { href: "/#events", label: "Events" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
] as const;

export const inquiryTypes = [
  { value: "training", label: "Training opportunities" },
  { value: "programs", label: "Upcoming programs" },
  { value: "hosting", label: "Hosting an event" },
  { value: "facility", label: "Using the facility" },
  { value: "speaking", label: "Speaking or teaching" },
  { value: "general", label: "General question" },
] as const;

export type InquiryType = (typeof inquiryTypes)[number]["value"];
