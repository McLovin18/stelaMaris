/**
 * Traducciones estáticas para la UI
 * Textos fijos de la interfaz que no dependen del contenido
 */

export const uiTranslations = {
  es: {
    // Navegación
    "nav.home": "Inicio",
    "nav.products": "Productos",
    "nav.blogs": "Blogs",
    "nav.cart": "Carrito",
    "nav.account": "Cuenta",
    "nav.categories": "Categorías",
    "nav.search": "Buscar",
    "nav.search_placeholder": "Buscar productos...",
    "nav.about_us": "Sobre Nosotros",
    "bottombar.home": "Inicio",
    "bottombar.products": "Productos",
    "bottombar.cart": "Carrito",
    "bottombar.search": "Buscar",
    
    // Página de detalle de producto
    "product.add_to_cart": "Añadir al carrito",
    "product.remove_from_cart": "Quitar del carrito",
    "product.out_of_stock": "Agotado",
    "product.in_stock": "en stock",
    "product.select_options": "Selecciona opciones para ver stock",
    "product.description": "Descripción",
    "product.characteristics": "Características",
    "product.reviews": "Reseñas",
    "product.sku": "SKU",
    "product.price": "Precio",
    "product.quantity": "Cantidad",
    "product.stock": "Disponibilidad",
    "product.added_to_cart": "añadido al carrito",
    "product.write_review": "Escribir reseña",
    "product.related_products": "Productos relacionados",
    "product.product_description": "Descripción del producto",
    
    // Carrito
    "cart.title": "Tu carrito",
    "cart.empty": "Tu carrito está vacío",
    "cart.checkout": "Proceder al pago",
    "cart.remove": "Eliminar",
    "cart.total": "Total",
    "cart.subtotal": "Subtotal",
    
    // General
    "general.loading": "Cargando...",
    "general.error": "Error",
    "general.save": "Guardar",
    "general.cancel": "Cancelar",
    "general.edit": "Editar",
    "general.delete": "Eliminar",
    "general.search": "Buscar",
    "general.filter": "Filtrar",
    "general.searching": "Buscando...",
    "general.no_results": "No se encontraron resultados",
    
    // Botones
    "button.buy_now": "Comprar ahora",
    "button.add_to_favorites": "Añadir a favoritos",
    "button.remove_from_favorites": "Eliminar de favoritos",
    "button.view_product": "Ver producto",
    
    // Footer
    "footer.about": "Sobre nosotros",
    "footer.contact": "Contacto",
    "footer.terms": "Términos y condiciones",
    "footer.privacy": "Política de privacidad",
    "footer.brand_content": "Cosas de la marca",
    "footer.history": "Historia",
    "footer.philosophy": "Filosofía",
    "footer.visibility": "Visibilidad",
    "footer.community": "comunidad",
    "footer.developer": "Desarrollado por",
    "footer.description": "Stella Maris 🌟 Una marca 100% Ecuatoriana 🇪🇨 hecha con Propósito, Estilo y Elegancia.",
    "footer.location": "Ecuador 🇪🇨",
    "footer.made_in": "Hecho en Ecuador",
    "footer.copyright": "Todos los derechos reservados.",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.blogs": "Blogs",
    "nav.cart": "Cart",
    "nav.account": "Account",
    "nav.categories": "Categories",
    "nav.search": "Search",
    "nav.search_placeholder": "Search products...",
    "nav.about_us": "About Us",
    "bottombar.home": "Home",
    "bottombar.products": "Products",
    "bottombar.cart": "Cart",
    "bottombar.search": "Search",
    
    // Product detail page
    "product.add_to_cart": "Add to cart",
    "product.remove_from_cart": "Remove from cart",
    "product.out_of_stock": "Out of stock",
    "product.in_stock": "in stock",
    "product.select_options": "Select options to see stock",
    "product.description": "Description",
    "product.characteristics": "Characteristics",
    "product.reviews": "Reviews",
    "product.sku": "SKU",
    "product.price": "Price",
    "product.quantity": "Quantity",
    "product.stock": "Availability",
    "product.added_to_cart": "added to cart",
    "product.write_review": "Write review",
    "product.related_products": "Related products",
    "product.product_description": "Product description",
    
    // Cart
    "cart.title": "Your cart",
    "cart.empty": "Your cart is empty",
    "cart.checkout": "Proceed to checkout",
    "cart.remove": "Remove",
    "cart.total": "Total",
    "cart.subtotal": "Subtotal",
    
    // General
    "general.loading": "Loading...",
    "general.error": "Error",
    "general.save": "Save",
    "general.cancel": "Cancel",
    "general.edit": "Edit",
    "general.delete": "Delete",
    "general.search": "Search",
    "general.filter": "Filter",
    "general.searching": "Searching...",
    "general.no_results": "No results found",
    
    // Buttons
    "button.buy_now": "Buy now",
    "button.add_to_favorites": "Add to favorites",
    "button.remove_from_favorites": "Remove from favorites",
    "button.view_product": "View product",
    
    // Footer
    "footer.about": "About us",
    "footer.contact": "Contact",
    "footer.terms": "Terms and conditions",
    "footer.privacy": "Privacy policy",
    "footer.brand_content": "Brand content",
    "footer.history": "History",
    "footer.philosophy": "Philosophy",
    "footer.visibility": "Visibility",
    "footer.community": "community",
    "footer.developer": "Developed by",
    "footer.description": "Stella Maris 🌟 A 100% Ecuadorian brand 🇪🇨 made with Purpose, Style, and Elegance.",
    "footer.location": "Ecuador 🇪🇨",
    "footer.made_in": "Made in Ecuador",
    "footer.copyright": "All rights reserved.",
  }
};

/**
 * Obtiene una traducción de la UI según el idioma
 */
export function getUITranslation(key: string, languageCode: string = "es"): string {
  const translations = uiTranslations[languageCode as keyof typeof uiTranslations] || uiTranslations.es;
  return translations[key as keyof typeof translations] || key;
}