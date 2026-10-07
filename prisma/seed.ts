// Lamure Egypt — Database seed script
// Run: npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
// Or:  npx prisma db seed

const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function main() {
  console.log('🇪🇬 Seeding Lamure Egypt database...')

  // Clean up existing data
  await db.review.deleteMany()
  await db.cartItem.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.user.deleteMany()

  // --- Users ---
  const admin = await db.user.create({
    data: {
      email: 'admin@lamure.eg',
      name: 'Mohamed El-Sayed',
      password: 'admin123',
      role: 'ADMIN',
      phone: '+20 100 123 4567',
      address: '15 El-Tahrir St, Downtown, Cairo, Egypt',
    },
  })

  const supplier1 = await db.user.create({
    data: {
      email: 'supplier@lamure.eg',
      name: 'Fatma Hassan',
      password: 'supplier123',
      role: 'SUPPLIER',
      phone: '+20 111 987 6543',
      address: '42 Corniche El-Nil, Garden City, Cairo, Egypt',
    },
  })

  const supplier2 = await db.user.create({
    data: {
      email: 'khaled@lamure.eg',
      name: 'Khaled Mostafa',
      password: 'supplier123',
      role: 'SUPPLIER',
      phone: '+20 122 555 8888',
      address: '7 Fouad St, Alexandria, Egypt',
    },
  })

  const customer1 = await db.user.create({
    data: {
      email: 'customer@lamure.eg',
      name: 'Nour El-Din',
      password: 'customer123',
      role: 'CUSTOMER',
      phone: '+20 100 222 3333',
      address: '28 Road 9, Maadi, Cairo, Egypt',
    },
  })

  const customer2 = await db.user.create({
    data: {
      email: 'yasmin@lamure.eg',
      name: 'Yasmin Ahmed',
      password: 'customer123',
      role: 'CUSTOMER',
      phone: '+20 109 444 5555',
      address: '51 San Stefano, Alexandria, Egypt',
    },
  })

  const customer3 = await db.user.create({
    data: {
      email: 'omar@lamure.eg',
      name: 'Omar Hassan',
      password: 'customer123',
      role: 'CUSTOMER',
      phone: '+20 115 666 7777',
      address: '12 El-Haram St, Giza, Egypt',
    },
  })

  console.log('✅ Users created')

  // --- Categories ---
  const clothing = await db.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Premium Egyptian and international fashion — from casual to formal wear.',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
    },
  })

  const electronics = await db.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets, smart devices, and tech accessories available across Egypt.',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    },
  })

  const shoes = await db.category.create({
    data: {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Footwear for every occasion — sneakers, formal shoes, and sandals for the Egyptian climate.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    },
  })

  console.log('✅ Categories created')

  // --- Products ---
  const products = [
    // Clothing
    {
      name: 'Premium Egyptian Cotton T-Shirt',
      slug: 'premium-egyptian-cotton-tshirt',
      description: 'Made from the finest Egyptian cotton, this t-shirt offers unmatched softness and breathability. Perfect for Cairo\'s warm climate. Available in multiple colors.',
      price: 450,
      discount: 15,
      stock: 120,
      rating: 4.8,
      reviewCount: 234,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
      ]),
      size: 'M',
      color: 'White',
      brand: 'Lamure Essentials',
      categoryId: clothing.id,
      supplierId: supplier1.id,
    },
    {
      name: 'Casual Linen Blazer',
      slug: 'casual-linen-blazer',
      description: 'Lightweight linen blazer, ideal for Egyptian summers and smart-casual occasions. Tailored fit with a modern silhouette.',
      price: 1200,
      discount: 10,
      stock: 45,
      rating: 4.6,
      reviewCount: 87,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
      ]),
      size: 'L',
      color: 'Navy',
      brand: 'Cairo Couture',
      categoryId: clothing.id,
      supplierId: supplier1.id,
    },
    {
      name: 'Floral Summer Dress',
      slug: 'floral-summer-dress',
      description: 'Beautiful floral print dress with a flowing silhouette. Perfect for Sahel beach outings and summer gatherings.',
      price: 850,
      discount: 20,
      stock: 60,
      rating: 4.9,
      reviewCount: 156,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
      ]),
      size: 'S',
      color: 'Floral',
      brand: 'Nile Fashions',
      categoryId: clothing.id,
      supplierId: supplier1.id,
    },
    {
      name: 'Relaxed Fit Joggers',
      slug: 'relaxed-fit-joggers',
      description: 'Comfortable joggers with a modern tapered fit. Made from breathable cotton blend, perfect for Egyptian daily life.',
      price: 550,
      discount: 0,
      stock: 200,
      rating: 4.5,
      reviewCount: 312,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80',
      ]),
      size: 'L',
      color: 'Black',
      brand: 'Lamure Essentials',
      categoryId: clothing.id,
      supplierId: supplier1.id,
    },
    // Electronics
    {
      name: 'Wireless Noise-Cancelling Headphones',
      slug: 'wireless-noise-cancelling-headphones',
      description: 'Premium over-ear headphones with active noise cancellation. 40-hour battery life, perfect for commuting in Cairo.',
      price: 2500,
      discount: 25,
      stock: 35,
      rating: 4.7,
      reviewCount: 198,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
      ]),
      color: 'Matte Black',
      brand: 'SoundPro',
      categoryId: electronics.id,
      supplierId: supplier2.id,
    },
    {
      name: 'Smart Watch Pro X',
      slug: 'smart-watch-pro-x',
      description: 'Feature-packed smartwatch with heart rate monitor, GPS, and 5-day battery. Water-resistant — perfect for Egypt\'s active lifestyle.',
      price: 3200,
      discount: 15,
      stock: 50,
      rating: 4.6,
      reviewCount: 145,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80',
      ]),
      color: 'Silver',
      brand: 'TechGear',
      categoryId: electronics.id,
      supplierId: supplier2.id,
    },
    {
      name: 'Portable Bluetooth Speaker',
      slug: 'portable-bluetooth-speaker',
      description: 'Waterproof portable speaker with 360° sound. 12-hour battery, perfect for Sahel trips and pool parties.',
      price: 1800,
      discount: 30,
      stock: 75,
      rating: 4.4,
      reviewCount: 267,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
      ]),
      color: 'Midnight Blue',
      brand: 'SoundPro',
      categoryId: electronics.id,
      supplierId: supplier2.id,
    },
    {
      name: 'USB-C Fast Charger 65W',
      slug: 'usb-c-fast-charger-65w',
      description: 'GaN technology fast charger with 65W output. Charges laptops, tablets, and phones. Dual-voltage support for Egyptian outlets.',
      price: 650,
      discount: 0,
      stock: 150,
      rating: 4.8,
      reviewCount: 423,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
      ]),
      color: 'White',
      brand: 'ChargeTech',
      categoryId: electronics.id,
      supplierId: supplier2.id,
    },
    // Shoes
    {
      name: 'Classic Leather Oxford Shoes',
      slug: 'classic-leather-oxford-shoes',
      description: 'Handcrafted leather oxford shoes with Goodyear welt construction. Elegant enough for downtown Cairo business meetings.',
      price: 2200,
      discount: 10,
      stock: 30,
      rating: 4.9,
      reviewCount: 89,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80',
        'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80',
      ]),
      size: '42',
      color: 'Brown',
      brand: 'Cairo Leather Co.',
      categoryId: shoes.id,
      supplierId: supplier1.id,
    },
    {
      name: 'Retro Running Sneakers',
      slug: 'retro-running-sneakers',
      description: 'Vintage-inspired running sneakers with modern comfort technology. Lightweight cushioning for all-day wear on Egyptian streets.',
      price: 1500,
      discount: 20,
      stock: 85,
      rating: 4.7,
      reviewCount: 321,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80',
      ]),
      size: '43',
      color: 'Red/White',
      brand: 'StreetRunner',
      categoryId: shoes.id,
      supplierId: supplier2.id,
    },
    {
      name: 'Comfortable Leather Sandals',
      slug: 'comfortable-leather-sandals',
      description: 'Genuine leather sandals with anatomic footbed. Designed for Egypt\'s warm climate — stylish and incredibly comfortable.',
      price: 750,
      discount: 0,
      stock: 110,
      rating: 4.5,
      reviewCount: 178,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80',
      ]),
      size: '41',
      color: 'Tan',
      brand: 'Nile Comfort',
      categoryId: shoes.id,
      supplierId: supplier1.id,
    },
    {
      name: 'High-Top Canvas Sneakers',
      slug: 'high-top-canvas-sneakers',
      description: 'Classic high-top canvas sneakers with vulcanized rubber sole. A timeless streetwear essential for Egyptian youth.',
      price: 900,
      discount: 15,
      stock: 95,
      rating: 4.3,
      reviewCount: 245,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=600&q=80',
      ]),
      size: '44',
      color: 'Black',
      brand: 'StreetRunner',
      categoryId: shoes.id,
      supplierId: supplier2.id,
    },
  ]

  await db.product.createMany({ data: products })
  console.log(`✅ ${products.length} products created`)

  // --- Sample Orders ---
  const allProducts = await db.product.findMany()
  const p1 = allProducts[0]
  const p2 = allProducts[4]
  const p3 = allProducts[8]

  await db.order.create({
    data: {
      userId: customer1.id,
      total: 3425,
      status: 'DELIVERED',
      paymentMethod: 'COD',
      address: '28 Road 9, Maadi, Cairo, Egypt',
      items: {
        create: [
          { productId: p1.id, quantity: 2, price: p1.price * (1 - p1.discount / 100) },
          { productId: p2.id, quantity: 1, price: p2.price * (1 - p2.discount / 100) },
        ],
      },
    },
  })

  await db.order.create({
    data: {
      userId: customer2.id,
      total: 1980,
      status: 'SHIPPED',
      paymentMethod: 'CARD',
      address: '51 San Stefano, Alexandria, Egypt',
      items: {
        create: [
          { productId: p3.id, quantity: 1, price: p3.price * (1 - p3.discount / 100) },
        ],
      },
    },
  })

  await db.order.create({
    data: {
      userId: customer3.id,
      total: 2650,
      status: 'PAID',
      paymentMethod: 'WALLET',
      address: '12 El-Haram St, Giza, Egypt',
      items: {
        create: [
          { productId: allProducts[5].id, quantity: 1, price: allProducts[5].price * (1 - allProducts[5].discount / 100) },
        ],
      },
    },
  })

  console.log('✅ Sample orders created')

  // --- Sample Reviews ---
  await db.review.createMany({
    data: [
      { userId: customer1.id, productId: p1.id, rating: 5, comment: 'Best Egyptian cotton t-shirt I have ever owned! The quality is incredible and shipping to Maadi was fast.' },
      { userId: customer2.id, productId: p1.id, rating: 5, comment: 'So soft and comfortable. Worth every pound. Will buy more colors!' },
      { userId: customer3.id, productId: p2.id, rating: 4, comment: 'Great headphones, noise cancellation works perfectly on the Cairo metro.' },
      { userId: customer1.id, productId: p3.id, rating: 5, comment: 'Beautiful shoes. The leather quality is outstanding — true Egyptian craftsmanship.' },
      { userId: customer2.id, productId: allProducts[2].id, rating: 5, comment: 'Perfect summer dress for Sahel! Got so many compliments.' },
      { userId: customer3.id, productId: allProducts[9].id, rating: 4, comment: 'Very comfortable sneakers. Great for walking around Zamalek.' },
    ],
  })

  console.log('✅ Reviews created')
  console.log('🎉 Lamure Egypt database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
