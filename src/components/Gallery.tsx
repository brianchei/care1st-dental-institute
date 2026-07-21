"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  galleryCategories,
  galleryImages,
  type GalleryCategory,
} from "@/lib/gallery";
import styles from "./Gallery.module.css";

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | "All">("All");

  const images = useMemo(() => {
    if (filter === "All") return galleryImages;
    return galleryImages.filter((img) => img.category === filter);
  }, [filter]);

  return (
    <section id="gallery" className={`section ${styles.gallery}`}>
      <div className="container">
        <div className={styles.intro}>
          <p className="section-label">Gallery</p>
          <h2 className="section-title">See the training environment.</h2>
          <p className="section-lead">
            Authentic views of Care1st&apos;s lecture room, clinical spaces,
            hands-on stations, and multipurpose areas.
          </p>
        </div>

        <div
          className={styles.filters}
          role="tablist"
          aria-label="Gallery categories"
        >
          {galleryCategories.map((category) => {
            const selected = filter === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`${styles.filter} ${selected ? styles.active : ""}`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            );
          })}
        </div>

        <ul className={styles.grid}>
          {images.map((image) => (
            <li key={image.src} className={styles.item}>
              <figure className={styles.figure}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  className={styles.image}
                />
                <figcaption className={styles.caption}>
                  {image.category}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
