@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @PostMapping
    public ResponseEntity<?> handleFileUpload(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> fileUrls = new ArrayList<>();
            
            for (MultipartFile file : files) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path path = Paths.get("uploads/" + fileName);
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                fileUrls.add("/uploads/" + fileName);
            }
            
            return ResponseEntity.ok(fileUrls);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}