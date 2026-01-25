"use client"

import Link from "next/link"
import { ArrowRight, Minus, Plus, Trash2, Camera, ShieldCheck } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">
            Carrito de compras
          </h1>
          <p className="text-muted-foreground mb-8">Tu carrito está vacío</p>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors"
          >
            Ir a la tienda <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">
            Carrito de compras
          </h1>
          <p className="text-muted-foreground">
            Estás a un paso de crear algo único y personalizado.
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 flex gap-6 items-start"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-cream-dark rounded-lg flex items-center justify-center shrink-0">
                    <Camera className="w-8 h-8 text-gold" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-1">
                      Precio unidad: {item.price} €
                    </p>
                    <p className="text-muted-foreground text-sm mb-1">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      Total del producto: {item.price * item.quantity} €
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-xl text-[#1a1a1a]">
                        {item.price * item.quantity} €
                      </p>
                      
                      <div className="flex items-center gap-2 bg-gold rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#1a1a1a] hover:opacity-70"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-medium text-[#1a1a1a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#1a1a1a] hover:opacity-70"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">
                  Resumen del pedido
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#1a1a1a]">
                    <span>Subtotal</span>
                    <span>{totalPrice} €</span>
                  </div>
                  <div className="flex justify-between text-[#1a1a1a]">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between font-bold text-lg text-[#1a1a1a]">
                      <span>Total</span>
                      <span>{totalPrice} €</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/finalizar-pedido"
                  className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors mb-3"
                >
                  Finalizar pedido <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Pago seguro - Datos protegidos
                </p>

                <Link
                  href="/tienda"
                  className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-[#1a1a1a] px-6 py-3 rounded-full font-medium transition-colors mt-4"
                >
                  Continuar comprando <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
