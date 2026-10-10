'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from '@/lib/router'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/shop/cart-drawer'
import { HomePage } from '@/components/shop/home-page'
import { ShopPage } from '@/components/shop/shop-page'
import { ProductDetailPage } from '@/components/shop/product-detail-page'
import { CartPage } from '@/components/shop/cart-page'
import { CheckoutPage } from '@/components/shop/checkout-page'
import { ProfilePage } from '@/components/shop/profile-page'
import { OrdersPage } from '@/components/shop/orders-page'
import { AboutPage } from '@/components/shop/about-page'
import { ContactPage } from '@/components/shop/contact-page'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { SupplierDashboard } from '@/components/supplier/supplier-dashboard'
import { AuthPage } from '@/components/auth/auth-page'
import { WishlistPage } from '@/components/shop/wishlist-page'
import type { ProductDTO, CategoryDTO } from '@/lib/types'

interface AppShellProps {
  initialProducts: ProductDTO[]
  categories: CategoryDTO[]
}

export function AppShell({ initialProducts, categories }: AppShellProps) {
  const { route } = useRouter()

  function renderRoute() {
    switch (route.name) {
      case 'home':
        return <HomePage categories={categories} featured={initialProducts} />

      case 'shop':
        return (
          <ShopPage
            initialProducts={initialProducts}
            categories={categories}
            initialCategory={route.category}
            initialSearch={route.search}
          />
        )

      case 'product':
        return <ProductDetailPage productId={route.id} />

      case 'cart':
        return <CartPage />

      case 'checkout':
        return <CheckoutPage />

      case 'profile':
        return <ProfilePage />

      case 'orders':
        return <OrdersPage />

      case 'wishlist':
        return <WishlistPage />

      case 'admin':
        return <AdminDashboard />

      case 'supplier':
        return <SupplierDashboard />

      case 'about':
        return <AboutPage />

      case 'contact':
        return <ContactPage />

      case 'login':
        return <AuthPage mode="login" />

      case 'register':
        return <AuthPage mode="register" />

      default:
        return <HomePage categories={categories} featured={initialProducts} />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {renderRoute()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
