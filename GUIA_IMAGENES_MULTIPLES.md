# 📸 Guía: Sistema de Múltiples Imágenes por Color

## ✨ ¿Qué cambió?

Ahora puedes subir **múltiples imágenes para cada color** de tu producto. Esto permite que los clientes vean diferentes ángulos del producto en cada color disponible.

## 🎯 Cómo funciona

### 1. **En el Panel de Administración**

Cuando creas o editas un producto:

1. **Crea tus variantes** primero (Color + Tallas + Stock)
2. **Sube imágenes por cada color**:
   - Puedes subir de 1 a 6 imágenes por color
   - Las imágenes se muestran en el orden que las subas
   - Puedes eliminar imágenes individuales haciendo hover

#### Ejemplo:
Si tienes un pantalón en 3 colores (Negro, Rojo, Amarillo):
- **Negro**: Sube 4 fotos (frontal, lateral, posterior, detalle)
- **Rojo**: Sube 4 fotos del pantalón rojo
- **Amarillo**: Sube 4 fotos del pantalón amarillo

### 2. **En la Tienda (Modal de Producto)**

Cuando un cliente abre el producto:

1. **Ve la primera imagen** del color seleccionado por defecto
2. **Abajo aparecen miniaturas** de todas las imágenes de ese color
3. **Hace clic en una miniatura** → La imagen grande cambia
4. **Cambia de color** → Las miniaturas se actualizan mostrando las fotos de ese nuevo color

## 🔧 Cambios Técnicos Implementados

### Base de Datos
- ✅ Campo `color` en `ProductImage` - vincula cada imagen a un color específico
- ✅ Campo `order` en `ProductImage` - controla el orden de visualización

### Backend
- ✅ Endpoints actualizados para recibir múltiples archivos
- ✅ Compresión automática de imágenes a WebP
- ✅ Asociación de cada imagen con su color correspondiente

### Frontend
- ✅ **CreateProduct**: UI para subir múltiples imágenes por color
- ✅ **ProductDetailModal**: Galería dinámica que filtra por color
- ✅ **Miniaturas clickeables** con número de orden
- ✅ **Transición suave** al cambiar de color

## 📝 Notas Importantes

1. **Compatibilidad**: Los productos antiguos con una sola imagen siguen funcionando
2. **Máximo**: 6 imágenes por color (puedes cambiar esto en el código)
3. **Orden**: Las imágenes se muestran en el orden que las subiste
4. **Formatos**: JPG, PNG, WEBP (se optimizan automáticamente)
5. **Tamaño**: Máximo 10MB por archivo

## 🚀 Próximos Pasos (Opcional)

- [ ] Agregar drag & drop para reordenar imágenes
- [ ] Permitir editar imágenes sin tener que subirlas todas de nuevo
- [ ] Agregar zoom en la imagen principal
- [ ] Agregar vista 360° para productos premium

## 🐛 ¿Problemas?

Si encuentras algún error:
1. Verifica que las variantes tengan colores asignados
2. Asegúrate de subir al menos 1 imagen por color
3. Revisa la consola del navegador para errores
