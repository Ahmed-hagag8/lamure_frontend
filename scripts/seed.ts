import { db } from '../src/lib/db'

const CATEGORIES = [
  { name: 'Clothing', slug: 'clothing', description: 'Fashion apparel for every occasion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' },
  { name: 'Electronics', slug: 'electronics', description: 'Cutting-edge gadgets and devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80' },
  { name: 'Shoes', slug: 'shoes', description: 'Step into style with premium footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80' },
]

const SUPPLIER_ID = 'supplier-demo-1'
const SUPPLIER_2_ID = 'supplier-demo-2'

const PRODUCTS = [
  // Clothing
  { name: 'Classic Denim Jacket', slug: 'classic-denim-jacket', description: 'Timeless denim jacket made from premium organic cotton with a vintage wash. Perfect for layering across seasons.', price: 89.99, discount: 15, stock: 42, images: '["https://images.unsplash.com/photo-1543076447-215ad9ba913c?w=800&q=80","https://images.unsplash.com/photo-1582552607552-a4f48dc6a86e?w=800&q=80"]', size: 'M', color: 'Blue', brand: 'Urban Co', categorySlug: 'clothing' },
  { name: 'Linen Summer Shirt', slug: 'linen-summer-shirt', description: 'Breathable 100% linen shirt with a relaxed fit. Ideal for warm weather and smart-casual settings.', price: 49.99, discount: 0, stock: 78, images: '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"]', size: 'L', color: 'White', brand: 'Coastline', categorySlug: 'clothing' },
  { name: 'Wool Blend Overcoat', slug: 'wool-blend-overcoat', description: 'Elegant wool-blend overcoat tailored for chilly evenings. Lined interior with double-button closure.', price: 219.99, discount: 25, stock: 18, images: '["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80"]', size: 'L', color: 'Camel', brand: 'Northgate', categorySlug: 'clothing' },
  { name: 'Knit Beanie', slug: 'knit-beanie', description: 'Soft acrylic knit beanie with ribbed cuff. One size fits most, available in multiple colors.', price: 19.99, discount: 0, stock: 120, images: '["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80"]', size: 'OS', color: 'Charcoal', brand: 'Coastline', categorySlug: 'clothing' },

  // Electronics
  { name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-noise-cancelling-headphones', description: 'Premium over-ear headphones with adaptive ANC, 40-hour battery life, and crystal-clear audio.', price: 299.99, discount: 10, stock: 35, images: '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80","https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"]', brand: 'SoundWave', categorySlug: 'electronics' },
  { name: '4K Action Camera', slug: '4k-action-camera', description: 'Waterproof action camera with 4K60 video, image stabilization, and built-in Wi-Fi streaming.', price: 179.99, discount: 5, stock: 64, images: '["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80"]', brand: 'TrailView', categorySlug: 'electronics' },
  { name: 'Smart Watch Series 7', slug: 'smart-watch-series-7', description: 'Track fitness, heart rate, and notifications on a vibrant AMOLED display. 5-day battery life.', price: 249.99, discount: 0, stock: 50, images: '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80"]', brand: 'PulseTech', categorySlug: 'electronics' },
  { name: 'Mechanical Gaming Keyboard', slug: 'mechanical-gaming-keyboard', description: 'RGB backlit mechanical keyboard with hot-swappable switches and aluminum frame for tactile typing.', price: 119.99, discount: 20, stock: 88, images: '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"]', brand: 'KeyForge', categorySlug: 'electronics' },
  { name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', description: 'Compact waterproof speaker with 360-degree sound and 24-hour playtime. Perfect for adventures.', price: 79.99, discount: 0, stock: 95, images: '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"]', brand: 'SoundWave', categorySlug: 'electronics' },

  // Shoes
  { name: 'Running Sneakers Pro', slug: 'running-sneakers-pro', description: 'Lightweight running shoes with cushioned midsole and breathable mesh upper for daily training.', price: 129.99, discount: 15, stock: 70, images: '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"]', size: '42', color: 'Red', brand: 'Velocity', categorySlug: 'shoes' },
  { name: 'Leather Chelsea Boots', slug: 'leather-chelsea-boots', description: 'Handcrafted leather Chelsea boots with elastic side panels. A timeless wardrobe essential.', price: 189.99, discount: 0, stock: 32, images: '["https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80"]', size: '43', color: 'Brown', brand: 'Northgate', categorySlug: 'shoes' },
  { name: 'Canvas Low-Top Sneakers', slug: 'canvas-low-top-sneakers', description: 'Casual canvas sneakers with rubber sole. Minimalist design pairs with any outfit.', price: 59.99, discount: 10, stock: 110, images: '["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80"]', size: '41', color: 'White', brand: 'Urban Co', categorySlug: 'shoes' },
  { name: 'Hiking Trail Boots', slug: 'hiking-trail-boots', description: 'Durable hiking boots with waterproof membrane and aggressive grip outsole for rugged terrain.', price: 159.99, discount: 0, stock: 45, images: '["https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"]', size: '44', color: 'Olive', brand: 'TrailView', categorySlug: 'shoes' },
]

async function main() {
  console.log('🧹 Cleaning existing data...')
  await db.review.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.cartItem.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.user.deleteMany()

  console.log('👥 Creating users...')
  await db.user.createMany({
    data: [
      { id: 'admin-demo', email: 'admin@shop.dev', name: 'Admin User', password: 'admin123', role: 'ADMIN' },
      { id: SUPPLIER_ID, email: 'supplier@shop.dev', name: 'Maria Lopez', password: 'supplier123', role: 'SUPPLIER' },
      { id: SUPPLIER_2_ID, email: 'supplier2@shop.dev', name: 'James Chen', password: 'supplier123', role: 'SUPPLIER' },
      { id: 'customer-demo', email: 'customer@shop.dev', name: 'Alex Morgan', password: 'customer123', role: 'CUSTOMER', phone: '+1 555-0100', address: '123 Market St, San Francisco, CA' },
    ],
  })

  console.log('🏷️  Creating categories...')
  for (const cat of CATEGORIES) {
    await db.category.create({ data: cat })
  }

  console.log('📦 Creating products...')
  for (const p of PRODUCTS) {
    const { categorySlug, ...rest } = p
    const category = await db.category.findUnique({ where: { slug: categorySlug } })
    if (!category) continue
    const supplierId = categorySlug === 'electronics' ? SUPPLIER_2_ID : SUPPLIER_ID
    await db.product.create({
      data: {
        ...rest,
        categoryId: category.id,
        supplierId,
        rating: 3.8 + Math.random() * 1.2,
        reviewCount: Math.floor(Math.random() * 80) + 5,
      },
    })
  }

  console.log('✅ Seed completed!')
  const counts = {
    users: await db.user.count(),
    categories: await db.category.count(),
    products: await db.product.count(),
  }
  console.log(counts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
