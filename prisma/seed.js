import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.preorder.deleteMany();

  // Create seed data
  const preorders = await prisma.preorder.createMany({
    data: [
      {
        name: 'Classic T-Shirt Collection',
        productCount: 125,
        preorderMode: 'standard',
        status: 'active',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-03-15'),
      },
      {
        name: 'Limited Edition Sneakers',
        productCount: 45,
        preorderMode: 'exclusive',
        status: 'active',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-02-28'),
      },
      {
        name: 'Summer Accessories Bundle',
        productCount: 320,
        preorderMode: 'standard',
        status: 'inactive',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-01-31'),
      },
      {
        name: 'Winter Jacket Pre-Order',
        productCount: 87,
        preorderMode: 'standard',
        status: 'active',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-04-30'),
      },
      {
        name: 'Vintage Watch Reissue',
        productCount: 12,
        preorderMode: 'exclusive',
        status: 'active',
        startDate: new Date('2026-02-15'),
        endDate: new Date('2026-05-15'),
      },
    ],
  });

  console.log(`Created ${preorders.count} preorders`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
