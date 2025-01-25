@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") 
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO productDTO) {
        try {
            if (productService.productExists(productDTO.getName())) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("error", "El nombre ya existe"));
            }
            
            Product createdProduct = productService.createProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}