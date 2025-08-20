import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../types/Product'
import PricingCalculator from './PricingCalculator'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [showCalculator, setShowCalculator] = useState(false)

  // Manejo del estado del producto
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active l1">Disponible</span>
      case 'inactive':
        return <span className="status-badge status-inactive l1">No disponible</span>
      case 'pending':
        return <span className="status-badge status-pending l1">Pendiente</span>
      default:
        return null
    }
  }

  // Formateo de precios en CLP
  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
  }

  // Estado de stock
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="stock-status out-of-stock l1">Sin stock</span>
    } else if (stock < 10) {
      return <span className="stock-status low-stock l1">Stock bajo ({stock})</span>
    }
    return <span className="stock-status in-stock l1">{stock} disponibles</span>
  }

  // Mejor precio por volumen
  const getDiscountPrice = () => {
    if (product.priceBreaks && product.priceBreaks.length > 0) {
      const sorted = [...product.priceBreaks].sort((a, b) => a.price - b.price)
      return sorted[0].price
    }
    return null
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        {/* Imagen del producto */}
        <div className="product-image">
          {product.image && product.image.length > 0 ? (
            <img src={product.image[0]} alt={product.name} />
          ) : (
            <div className="image-placeholder">
              <span className="material-icons">image</span>
            </div>
          )}
          <div className="product-status">{getStatusBadge(product.status)}</div>
        </div>

        {/* Información del producto */}
        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name p1-medium">{product.name}</h3>
            <p className="product-sku l1">{product.sku}</p>
          </div>

          <div className="product-details">
            <div className="product-category">
              <span className="material-icons">category</span>
              <span className="l1">{product.category}</span>
            </div>
            {getStockStatus(product.stock)}
          </div>

          {product.features && product.features.length > 0 && (
            <div className="product-features">
              {product.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="feature-tag l1">{feature}</span>
              ))}
              {product.features.length > 3 && (
                <span className="more-features l1">+{product.features.length - 3}</span>
              )}
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              <span className="colors-label l1">{product.colors.length} colores:</span>
              <div className="colors-preview">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div key={index} className="color-dot" title={color} style={{ backgroundColor: color }}></div>
                ))}
                {product.colors.length > 3 && (
                  <span className="more-colors l1">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Footer con precio y acciones */}
      <div className="product-footer">
        <div className="price-section">
          <div className="current-price p1-medium">{formatPrice(product.basePrice)}</div>
          {getDiscountPrice() && getDiscountPrice() !== product.basePrice && (
            <div className="discount-info">
              <span className="discount-price l1">{formatPrice(getDiscountPrice()!)}</span>
              <span className="discount-label l1">mejor precio por volumen</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <button
            className="btn btn-secondary l1"
            onClick={(e) => {
              e.preventDefault()
              setShowCalculator(true)
            }}
          >
            <span className="material-icons">calculate</span>
            Cotizar
          </button>
        </div>
      </div>

      {/* Modal Pricing Calculator */}
      {showCalculator && (
        <div className="modal-overlay" onClick={() => setShowCalculator(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <PricingCalculator product={product} />
            <button
              className="btn btn-secondary cta1"
              onClick={() => setShowCalculator(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCard
