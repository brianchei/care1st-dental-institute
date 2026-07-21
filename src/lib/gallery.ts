export type GalleryCategory =
  | "Clinical training"
  | "Lecture room"
  | "Hands-on workstations"
  | "Multipurpose / events"
  | "Exterior";

export type GalleryImage = {
  src: string;
  alt: string;
  category: GalleryCategory;
  width: number;
  height: number;
};

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/facility/lecture-room.jpg",
    alt: "Lecture and training room with presenter, projection screens, and dental professionals seated at seminar tables",
    category: "Lecture room",
    width: 2048,
    height: 1536,
  },
  {
    src: "/images/facility/hands-on-training.jpg",
    alt: "Hands-on dental training session with instructors and professionals working at instrument stations",
    category: "Hands-on workstations",
    width: 2048,
    height: 1536,
  },
  {
    src: "/images/facility/clinical-demo.jpg",
    alt: "Clinical demonstration with dental professionals in protective gowns observing a hands-on practice exercise",
    category: "Clinical training",
    width: 1600,
    height: 1200,
  },
  {
    src: "/images/facility/clinical-group.jpg",
    alt: "Group of dental professionals gathered in the clinical training area with dental supplies displayed",
    category: "Clinical training",
    width: 2048,
    height: 1536,
  },
  {
    src: "/images/facility/multipurpose-event.jpg",
    alt: "Central multipurpose area during a professional networking and product demonstration event",
    category: "Multipurpose / events",
    width: 2048,
    height: 1536,
  },
  {
    src: "/images/facility/multipurpose-event-2.jpg",
    alt: "Professionals gathering in the Care1st multipurpose space for an educational event",
    category: "Multipurpose / events",
    width: 2048,
    height: 1536,
  },
  {
    src: "/images/gallery/networking-1.jpg",
    alt: "Dental professionals networking in the facility near clinical cabinetry and presentation materials",
    category: "Multipurpose / events",
    width: 2048,
    height: 1536,
  },
  {
    src: "/images/gallery/facility-wide.jpg",
    alt: "Wide view of the Care1st Dental Institute training environment",
    category: "Clinical training",
    width: 3600,
    height: 1324,
  },
  {
    src: "/images/facility/exterior-entrance.jpg",
    alt: "Exterior entrance of Care1st Dental Institute at 1548 Valwood Parkway, Suite 100",
    category: "Exterior",
    width: 4032,
    height: 3024,
  },
];

export const galleryCategories: Array<GalleryCategory | "All"> = [
  "All",
  "Clinical training",
  "Lecture room",
  "Hands-on workstations",
  "Multipurpose / events",
  "Exterior",
];
