@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public boolean productExists(String name) {
        return productRepository.existsByName(name);
    }

    public Product createProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setType(productDTO.getType());
        product.setImages(productDTO.getImages());
        product.setRating(productDTO.getRating());
        product.setPrice(productDTO.getPrice());

        return productRepository.save(product);
    }
}