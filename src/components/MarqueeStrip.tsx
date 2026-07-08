"use client";

import styles from "./MarqueeStrip.module.css";

const ITEMS = [
  "Preservative Free",
  "Vegan Friendly",
  "Gluten Free",
  "Refined Sugar Free",
  "Eggless",
  "PCOS Friendly"
];

export default function MarqueeStrip() {
  return (
    <div className={styles.marquee} aria-label={ITEMS.join(", ")}>
      <div className={styles.track}>
        <ul className={styles.group}>
          {ITEMS.map((item) => (
            <li key={item} className={styles.item}>
              {item}
              <span className={styles.dot} aria-hidden="true">◆</span>
            </li>
          ))}
        </ul>
        <ul className={styles.group} aria-hidden="true">
          {ITEMS.map((item) => (
            <li key={`dup-${item}`} className={styles.item}>
              {item}
              <span className={styles.dot} aria-hidden="true">◆</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
