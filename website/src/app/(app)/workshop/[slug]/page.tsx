import Image from "next/image";
import { notFound } from "next/navigation";
import WorkshopDetailClient from "./WorkshopDetailClient";
import styles from "./detail.module.css";

type Workshop = {
  id: string;
  name: string;
  slug: string;
  description: string;
  fee: number;
  image?: { url?: string };
  scheduleOptions?: { label: string }[];
};

export default async function WorkshopDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const base = process.env.PAYLOAD_URL || process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${base}/api/workshops?where[slug][equals]=${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const data = await res.json();
  const workshop: Workshop | undefined = data.docs?.[0];
  if (!workshop) return notFound();

  const imageUrl = workshop.image?.url?.startsWith("http")
    ? workshop.image.url
    : `${base}${workshop.image?.url || ""}`;

  return (
    <div className={styles.wrap}>
      <p className={styles.description}>WORKSHOP &gt; {workshop.name}</p>

      <div className={styles.gallery}>
        <h1 className={styles.title}>{workshop.name}</h1>
        <div className={styles.thumb}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={workshop.name}
              width={800}
              height={0}
              sizes='100vw'
              className={styles.img}
              priority
              unoptimized
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </div>
        <p className={styles.descText}>{workshop.description}</p>
      </div>

      <WorkshopDetailClient workshop={workshop} />
    </div>
  );
}
