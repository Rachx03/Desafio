import { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'
import { products as allProducts } from '../data/products'
import './ProductList.css'

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSupplier, setSelectedSupplier] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  // Filtrar productos según todos los filtros
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filtrar por proveedor
    if (selectedSupplier !== 'all') {
      filtered = filtered.filter(p => p.supplier === selectedSupplier)
    }

    // Filtrar por rango de precios
    filtered = filtered.filter(
      p => p.basePrice >= priceRange.min && p.basePrice <= priceRange.max
    )

    // Filtrar por búsqueda
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(searchLower) ||
             p.sku.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price':
        filtered.sort((a, b) => a.basePrice - b.basePrice)
        break
      case 'stock':
        filtered.sort((a, b) => b.stock - a.stock)
        break
    }

    return filtered
  }, [selectedCategory, selectedSupplier, priceRange, searchQuery, sortBy])

  const categoriesCount = new Set(filteredProducts.map(p => p.category)).size

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>
          
          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">{filteredProducts.length}</span>
              <span className="stat-label l1">productos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value p1-medium">{categoriesCount}</span>
              <span className="stat-label l1">categorías</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          selectedSupplier={selectedSupplier}
          priceRange={priceRange}
          searchQuery={searchQuery}
          sortBy={sortBy}
          onCategoryChange={setSelectedCategory}
          onSupplierChange={setSelectedSupplier}
          onPriceRangeChange={setPriceRange}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onClearFilters={() => {
            setSelectedCategory('all')
            setSelectedSupplier('all')
            setPriceRange({ min: 0, max: 100000 })
            setSearchQuery('')
            setSortBy('name')
          }}
        />

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">No se encontraron productos que coincidan con tu búsqueda.</p>
              <button 
                className="btn btn-primary cta1"
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedSupplier('all')
                  setPriceRange({ min: 0, max: 100000 })
                  setSearchQuery('')
                  setSortBy('name')
                }}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList
