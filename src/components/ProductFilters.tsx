import { useState, useEffect } from "react";
import { products } from "../data/products";
import "./ProductFilters.css";

interface ProductFiltersProps {
  selectedCategory: string;
  selectedSupplier: string;
  priceRange: { min: number; max: number };
  searchQuery: string;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onSupplierChange: (supplier: string) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

// Generar categorías y proveedores dinámicamente
const getCategories = () => {
  const categoryMap: Record<string, { name: string; icon: string; count: number }> = {};
  products.forEach((p) => {
    if (!categoryMap[p.category]) categoryMap[p.category] = { name: p.category, icon: "category", count: 0 };
    categoryMap[p.category].count++;
  });
  return Object.entries(categoryMap).map(([id, data]) => ({ id, ...data }));
};

const getSuppliers = () => {
  const supplierMap: Record<string, { name: string; count: number }> = {};
  products.forEach((p) => {
    if (!supplierMap[p.supplier]) supplierMap[p.supplier] = { name: p.supplier, count: 0 };
    supplierMap[p.supplier].count++;
  });
  return Object.entries(supplierMap).map(([id, data]) => ({ id, ...data }));
};

const ProductFilters = ({
  selectedCategory,
  selectedSupplier,
  priceRange,
  searchQuery,
  sortBy,
  onCategoryChange,
  onSupplierChange,
  onPriceRangeChange,
  onSearchChange,
  onSortChange,
  onClearFilters,
}: ProductFiltersProps) => {
  const categories = getCategories();
  const suppliers = getSuppliers();

  // Encontrar el min y max de precios para los sliders
  const prices = products.map((p) => p.basePrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const [localMin, setLocalMin] = useState(priceRange.min || minPrice);
  const [localMax, setLocalMax] = useState(priceRange.max || maxPrice);

  useEffect(() => {
    setLocalMin(priceRange.min);
    setLocalMax(priceRange.max);
  }, [priceRange]);

  const handlePriceChange = () => {
    onPriceRangeChange({ min: localMin, max: localMax });
  };

  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar productos, SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input p1"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")}>Limpiar</button>
          )}
        </div>

        {/* Categorías */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Proveedores */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <div className="supplier-filters">
            {suppliers.map((sup) => (
              <button
                key={sup.id}
                className={`supplier-btn ${selectedSupplier === sup.id ? "active" : ""}`}
                onClick={() => onSupplierChange(sup.id)}
              >
                {sup.name} ({sup.count})
              </button>
            ))}
          </div>
        </div>

        {/* Rango de precios */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Rango de Precios</h3>
          <div className="price-range">
            <input
              type="number"
              value={localMin}
              min={minPrice}
              max={localMax}
              onChange={(e) => setLocalMin(Number(e.target.value))}
            />
            -
            <input
              type="number"
              value={localMax}
              min={localMin}
              max={maxPrice}
              onChange={(e) => setLocalMax(Number(e.target.value))}
            />
            <button onClick={handlePriceChange}>Aplicar</button>
          </div>
        </div>

        {/* Ordenar */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="name">Nombre A-Z</option>
            <option value="price">Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Limpiar filtros */}
        <div className="filter-section">
          <button className="btn btn-secondary cta1" onClick={onClearFilters}>
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
