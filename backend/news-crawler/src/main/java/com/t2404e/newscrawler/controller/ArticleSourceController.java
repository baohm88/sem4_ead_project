package com.t2404e.newscrawler.controller;

import com.t2404e.newscrawler.entity.ArticleSource;
import com.t2404e.newscrawler.repository.ArticleSourceRepository;
import com.t2404e.newscrawler.service.ArticleSourceService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/sources")
public class ArticleSourceController {

    private final ArticleSourceRepository sourceRepo;
    private final ArticleSourceService service;

    public ArticleSourceController(ArticleSourceRepository sourceRepo, ArticleSourceService service) {
        this.sourceRepo = sourceRepo;
        this.service = service;
    }

    @PostMapping
    public ArticleSource create(@RequestBody ArticleSource src) {
        return sourceRepo.save(src);
    }

    @GetMapping
    public List<ArticleSource> getAll() {
        return sourceRepo.findAll();
    }

    @GetMapping("/crawl-links")
    public String crawlLinks() throws IOException {
        int count = service.crawlLinks();
        return "Crawled " + count + " links.";
    }

    @GetMapping("/crawl-details")
    public String crawlDetails() throws IOException {
        int count = service.crawlArticleDetails();
        return "Crawled " + count + " articles.";
    }
    @GetMapping("/get-links")
    public ResponseEntity<List<String>> getLinksFromParams(
            @RequestParam String domain,
            @RequestParam String path,
            @RequestParam String linkSelector,
            @RequestParam(required = false) String articleCategory,
            @RequestParam(required = false) Integer status) {

        List<String> links = new ArrayList<>();
        String url = domain + path;

        try {
            Document doc = Jsoup.connect(url).get();
            Elements elements = doc.select(linkSelector);

            for (Element e : elements) {
                String link = e.absUrl("href");
                if (!link.isEmpty()) links.add(link);
            }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }

        return ResponseEntity.ok(links);
    }
    @PostMapping("/preview-links")
    public ResponseEntity<List<String>> previewLinks(@RequestBody Map<String, String> request) {
        String domain = request.get("domain");
        String path = request.get("path");
        String linkSelector = request.get("linkSelector");

        // 1. Xử lý logic để tạo URL hợp lệ
        // Loại bỏ dấu '/' thừa ở cuối domain
        if (domain != null) {
            domain = domain.trim().replaceAll("/+$", "");
        }
        // Loại bỏ dấu '/' thừa ở đầu path
        if (path != null) {
            path = path.trim().replaceAll("^/+", "");
        }

        // Tạo URL hoàn chỉnh
        String url = String.format("%s/%s", domain, path);

        List<String> links = new ArrayList<>();

        try {
            // 2. Kết nối và lấy HTML
            Document doc = Jsoup.connect(url)
                    .timeout(10000) // Thêm timeout để tránh bị treo
                    .get();

            // 3. Chọn các phần tử
            Elements elements = doc.select(linkSelector);

            // 4. Trích xuất link tuyệt đối (absolute URL)
            for (Element e : elements) {
                String link = e.absUrl("href");
                if (!link.isEmpty()) links.add(link);
            }

        } catch (IOException e) {
            // Log lỗi để dễ debug hơn
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonList("Error connecting to URL: " + url));
        }

        return ResponseEntity.ok(links);
    }

}
