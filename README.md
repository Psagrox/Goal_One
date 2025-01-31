# GoAlone - Plataforma de Reserva de Canchas

## 📋 Descripción
GoAlone es una aplicación web full-stack desarrollada como proyecto final para el curso de Professional Developer de Digital House. La plataforma permite a los usuarios buscar y reservar canchas deportivas de manera fácil y eficiente.

## 🛠 Tecnologías Utilizadas

### Frontend
- React.js
- CSS para estilos personalizados
- Fetch API para comunicación con el backend

### Backend
- Java Spring Boot
- JPA/Hibernate para persistencia de datos
- Validación de datos con JWT Token
- Base de datos relacional (JPA Repository)

## 🚀 Características Principales
- Búsqueda de canchas disponibles
- Visualización de canchas destacadas
- Sistema de categorías
- Sistema de recomendaciones
- Visualización de imágenes de las instalaciones
- Información detallada de cada cancha (tipo, precio, calificación)
- Sistema de calificación con estrellas

## 💻 Estructura del Proyecto

### Frontend
```
src/
├── components/
│   ├── Main.jsx              # Componente principal
│   ├── SearchSection.jsx     # Sección de búsqueda
│   ├── CategoriesSection.jsx # Sección de categorías
│   ├── ProductsGrid.jsx      # Grid de productos (canchas)
│   └── RecommendationsSection.jsx
```

### Backend
```
src/
├── model/
│   ├── Product.java          # Entidad principal
│   └── ProductDTO.java       # Objeto de transferencia de datos
├── repository/
│   └── ProductRepository.java # Repositorio JPA
```

## 🚦 API Endpoints
- `GET /api/products`: Obtiene todas las canchas disponibles
- `POST /api/upload`: Carga canchas a la base de datos

## 📦 Requisitos
- Node.js y npm para el frontend
- Java 17+ para el backend
- Maven o Gradle (sistema de construcción)
- Base de datos compatible con JPA

## 🔧 Instalación y Ejecución

### Backend
```bash
# Clonar el repositorio
git clone [[URL_DEL_REPOSITORIO](https://github.com/Psagrox/Goal_One)]

# Navegar al directorio del backend
cd backend

# Instalar dependencias y compilar
./mvnw clean install

# Ejecutar la aplicación
./mvnw spring-boot:run
```

### Frontend
```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar la aplicación en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` y el backend en `http://localhost:8080`

## 🤝 Contribución
Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios
4. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
5. Push a la rama (`git push origin feature/nueva-caracteristica`)
6. Abre un Pull Request

## 📝 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👤 Autor
[Javier Galván]
Proyecto Final - Digital House Professional Developer
