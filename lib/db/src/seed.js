import bcrypt from "bcryptjs";
import { db, usersTable, propertiesTable } from "./index.js";
import { count, eq, inArray } from "drizzle-orm";

const SEED_LANDLORD_IDS = ["seed-landlord-1", "seed-landlord-2", "seed-landlord-3"];
const SEED_ADMIN_ID = "seed-admin-1";

const seedLandlords = [
  {
    id: "seed-landlord-1",
    email: "seed.john@example.com",
    username: "john_properties",
    role: "landlord",
    isVerified: "true",
    phone: "+234 801 111 2222",
    bio: "Seed landlord — Lagos-focused listings.",
  },
  {
    id: "seed-landlord-2",
    email: "seed.grace@example.com",
    username: "grace_realty",
    role: "landlord",
    isVerified: "true",
    phone: "+234 802 333 4444",
    bio: "Seed landlord — Abuja & PH.",
  },
  {
    id: "seed-landlord-3",
    email: "seed.emeka@example.com",
    username: "emeka_homes",
    role: "landlord",
    isVerified: "false",
    phone: "+234 803 555 6666",
    bio: "Seed landlord — Enugu area.",
  },
];

const seedProperties = [
  {
    title: "Modern 2-bed flat in Lekki Phase 1",
    description:
      "Bright apartment, fitted kitchen, 24h security, close to shops and the expressway.",
    type: "rent",
    price: 3_500_000,
    city: "Lagos",
    address: "12 Admiralty Way, Lekki Phase 1",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    isVerified: true,
    hasLandDocuments: true,
    landlordIndex: 0,
  },
  {
    title: "Spacious 4-bedroom duplex — Yaba",
    description: "Family home with BQ, parking for 3 cars, quiet street.",
    type: "sale",
    price: 185_000_000,
    city: "Lagos",
    address: "8 Murtala Muhammed Way, Yaba",
    bedrooms: 4,
    bathrooms: 4,
    area: 280,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    isVerified: true,
    hasLandDocuments: true,
    landlordIndex: 0,
  },
  {
    title: "Studio apartment — Garki",
    description: "Compact studio, ideal for professionals; generator and water included.",
    type: "rent",
    price: 950_000,
    city: "Abuja",
    address: "22 Gimbiya Street, Garki II",
    bedrooms: 0,
    bathrooms: 1,
    area: 32,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    ],
    isVerified: true,
    hasLandDocuments: false,
    landlordIndex: 1,
  },
  {
    title: "3-bed bungalow — Maitama",
    description: "Single-level home with garden, recently repainted, good road access.",
    type: "sale",
    price: 320_000_000,
    city: "Abuja",
    address: "15 Nelson Mandela Street, Maitama",
    bedrooms: 3,
    bathrooms: 3,
    area: 220,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
    isVerified: true,
    hasLandDocuments: true,
    landlordIndex: 1,
  },
  {
    title: "Waterfront 3-bed — Old GRA",
    description: "Views over the creeks, gated estate, backup power.",
    type: "rent",
    price: 4_200_000,
    city: "Port Harcourt",
    address: "7 Evo Road, Old GRA",
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    isVerified: false,
    hasLandDocuments: true,
    landlordIndex: 1,
  },
  {
    title: "New build 2-bed — Trans Amadi",
    description: "Estate property, uniformed security, children’s play area.",
    type: "rent",
    price: 1_800_000,
    city: "Port Harcourt",
    address: "Plot 44 Trans Amadi Industrial Layout",
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    ],
    isVerified: true,
    hasLandDocuments: false,
    landlordIndex: 1,
  },
  {
    title: "5-bedroom mansion — Independence Layout",
    description: "Large plot, swimming pool, two living rooms, staff quarters.",
    type: "sale",
    price: 280_000_000,
    city: "Enugu",
    address: "3 Ogui Road, Independence Layout",
    bedrooms: 5,
    bathrooms: 6,
    area: 450,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    ],
    isVerified: true,
    hasLandDocuments: true,
    landlordIndex: 2,
  },
  {
    title: "Affordable 1-bed — New Haven",
    description: "Top floor, cross-ventilation, prepaid meter.",
    type: "rent",
    price: 550_000,
    city: "Enugu",
    address: "18 Gariki Street, New Haven",
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    images: [
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80",
    ],
    isVerified: false,
    hasLandDocuments: false,
    landlordIndex: 2,
  },
  {
    title: "Penthouse — Victoria Island",
    description: "Panoramic city views, smart home basics, two parking slots.",
    type: "rent",
    price: 12_000_000,
    city: "Lagos",
    address: "1004 Housing Estate, VI",
    bedrooms: 3,
    bathrooms: 4,
    area: 240,
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    ],
    isVerified: true,
    hasLandDocuments: true,
    landlordIndex: 0,
  },
  {
    title: "Semi-detached 4-bed — Lekki",
    description: "Corner unit, small lawn, CCTV, estate gym access.",
    type: "sale",
    price: 210_000_000,
    city: "Lagos",
    address: "25 Freedom Way, Lekki Phase 1",
    bedrooms: 4,
    bathrooms: 4,
    area: 260,
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    ],
    isVerified: true,
    hasLandDocuments: true,
    landlordIndex: 0,
  },
];

async function main() {
  await db.delete(propertiesTable).where(inArray(propertiesTable.landlordId, SEED_LANDLORD_IDS));
  await db.delete(usersTable).where(inArray(usersTable.id, SEED_LANDLORD_IDS));
  await db.delete(usersTable).where(eq(usersTable.id, SEED_ADMIN_ID));

  await db.insert(usersTable).values(seedLandlords);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@shelterng.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123";
  await db.insert(usersTable).values({
    id: SEED_ADMIN_ID,
    email: adminEmail,
    username: "admin",
    passwordHash: await bcrypt.hash(adminPassword, 10),
    role: "admin",
    firstName: "Site",
    lastName: "Admin",
    isVerified: "true",
  });

  const rows = seedProperties.map((p) => {
    const { landlordIndex, ...rest } = p;
    return {
      ...rest,
      landlordId: SEED_LANDLORD_IDS[landlordIndex],
      status: "available",
    };
  });

  await db.insert(propertiesTable).values(rows);

  const [row] = await db
    .select({ n: count() })
    .from(propertiesTable)
    .where(inArray(propertiesTable.landlordId, SEED_LANDLORD_IDS));

  console.log(
    `Seeded admin (${adminEmail}), ${seedLandlords.length} demo landlords, ${rows.length} properties (${row?.n ?? 0} seed property rows). Admin password: set via SEED_ADMIN_PASSWORD or default admin123`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
