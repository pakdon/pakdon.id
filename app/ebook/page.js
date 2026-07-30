import { getDigitalProducts } from "@/lib/content";
import EbookCatalog from "@/components/EbookCatalog";

export const metadata = {
  title: "Ebook & Produk Digital",
  description: "Toolkit siap pakai untuk bisnis Anda: ebook, SOP, dashboard, template, dan prompt AI dari PakDon.id.",
  alternates: { canonical: "/ebook" },
};

export default async function EbookPage() {
  const products = await getDigitalProducts();
  return (
    <main className="pd-section" style={{ paddingTop: 168 }}>
      <div className="pd-container">
        <div style={{ maxWidth: 640, marginBottom: 10 }}>
          <span className="pd-eyebrow">Ebook & Produk Digital</span>
          <h1 className="pd-h2">Toolkit Siap Pakai untuk Bisnis Anda</h1>
          <p className="pd-sub" style={{ marginTop: 12 }}>
            Ebook, SOP, dashboard, template, dan prompt AI yang bisa langsung dipakai — tanpa perlu mulai dari nol.
          </p>
        </div>
        <div style={{ marginTop: 34 }}>
          <EbookCatalog products={products} />
        </div>
      </div>
    </main>
  );
}
