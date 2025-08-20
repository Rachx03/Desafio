import { useState } from 'react'
import { Product } from '../types/Product'
import './PricingCalculator.css'
import { useCart } from '../contexts/CartContext'

interface PricingCalculatorProps {
  product: Product
}

const PricingCalculator = ({ product }: PricingCalculatorProps) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedBreak, setSelectedBreak] = useState<number>(0)
  const [companyName, setCompanyName] = useState<string>('')
  const [companyEmail, setCompanyEmail] = useState<string>('')

  const { addToCart } = useCart()
  const maxQty = product.stock ?? 10000

  const calculatePrice = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return product.basePrice * qty
    }

    let applicableBreak = product.priceBreaks[0]
    for (const pb of product.priceBreaks) {
      if (qty >= pb.minQty && pb.price < applicableBreak.price) {
        applicableBreak = pb
      }
    }

    return applicableBreak.price * qty
  }

  const getDiscount = (qty: number) => {
    if (!product.priceBreaks || product.priceBreaks.length === 0) {
      return 0
    }
    const baseTotal = product.basePrice * qty
    const discountedTotal = calculatePrice(qty)
    return ((baseTotal - discountedTotal) / baseTotal) * 100
  }

  const formatPrice = (price: number) =>
    price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })

  const currentPrice = calculatePrice(quantity)
  const discountPercent = getDiscount(quantity)

  // Generar archivo .txt con la cotización
  const exportQuotation = () => {
    if (!companyName || !companyEmail) {
      alert('Por favor completa los datos de empresa y email')
      return
    }

    const content = `
Cotización solicitada por: ${companyName}
Email: ${companyEmail}

Producto: ${product.name}
SKU: ${product.sku}
Cantidad: ${quantity}
Precio unitario: ${formatPrice(currentPrice / quantity)}
Descuento aplicado: ${discountPercent.toFixed(1)}%
Precio total: ${formatPrice(currentPrice)}
`

    const blob = new Blob([content], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `cotizacion_${product.name}.txt`
    link.click()
  }

  return (
    <div className="pricing-calculator">
      <div className="calculator-header">
        <h3 className="calculator-title p1-medium">Calculadora de Precios</h3>
        <p className="calculator-subtitle l1">
          Calcula el precio según la cantidad que necesitas
        </p>
      </div>

      <div className="calculator-content">
        {/* Empresa */}
        <div className="company-section">
          <label className="p1-medium">Nombre de la empresa</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="company-input p1"
            placeholder="Ej. Mi Empresa S.A."
          />

          <label className="p1-medium">Email de contacto</label>
          <input
            type="email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            className="company-input p1"
            placeholder="correo@empresa.com"
          />
        </div>

        {/* Cantidad */}
        <div className="quantity-section">
          <label className="quantity-label p1-medium">Cantidad</label>
          <div className="quantity-input-group">
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1))
                )
              }
              className="quantity-input p1"
              min={1}
              max={maxQty}
            />
            <span className="quantity-unit l1">unidades</span>
          </div>
        </div>

        {/* Price Breaks */}
        {product.priceBreaks && product.priceBreaks.length > 0 && (
          <div className="price-breaks-section">
            <h4 className="breaks-title p1-medium">Descuentos por volumen</h4>
            <div className="price-breaks">
              {product.priceBreaks.map((priceBreak, index) => {
                const isActive = quantity >= priceBreak.minQty
                const isSelected = selectedBreak === index

                return (
                  <div
                    key={index}
                    className={`price-break ${isActive ? 'active' : ''} ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => {
                      setSelectedBreak(index)
                      setQuantity(priceBreak.minQty)
                    }}
                  >
                    <div className="break-quantity l1">{priceBreak.minQty}+ unidades</div>
                    <div className="break-price p1-medium">{formatPrice(priceBreak.price)}</div>
                    {priceBreak.discount && (
                      <div className="break-discount l1">-{priceBreak.discount}%</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Resumen */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label p1">Precio unitario:</span>
            <span className="summary-value p1-medium">
              {formatPrice(currentPrice / quantity)}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label p1">Cantidad:</span>
            <span className="summary-value p1-medium">{quantity} unidades</span>
          </div>
          {discountPercent > 0 && (
            <div className="summary-row discount-row">
              <span className="summary-label p1">Descuento:</span>
              <span className="summary-value discount-value p1-medium">
                -{discountPercent.toFixed(1)}%
              </span>
            </div>
          )}
          <div className="summary-row total-row">
            <span className="summary-label p1-medium">Total:</span>
            <span className="summary-value total-value h2">{formatPrice(currentPrice)}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="calculator-actions">
          <button className="btn btn-secondary cta1" onClick={exportQuotation}>
            <span className="material-icons">file_download</span>
            Exportar cotización
          </button>

          <button
            className="btn btn-primary cta1"
            onClick={() =>
              addToCart({
                product,
                quantity
              })
            }
          >
            <span className="material-icons">shopping_cart</span>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default PricingCalculator
