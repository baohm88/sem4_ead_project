//package com.t2404e.newscrawler.config;
//
//import io.swagger.v3.oas.models.OpenAPI;
//import io.swagger.v3.oas.models.info.Info;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class SwaggerConfig {
//
//    @Bean
//    public OpenAPI customOpenAPI() {
//        return new OpenAPI()
//                .info(new Info()
//                        .title("API Documentation")
//                        .version("1.0.0")
//                        .description("Demo Swagger của bạn"));
//    }
//}
//

package com.t2404e.newscrawler.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "News Crawler API",
                version = "1.0",
                description = "API dùng cho Next.js Admin + Crawler Bots"
        )
)
public class SwaggerConfig implements WebMvcConfigurer {

    @Bean
    public org.springdoc.core.customizers.GlobalOpenApiCustomizer openApiCustomizer(){
        return openApi -> {
            // Auto enable Try It Out (no need to click)
            openApi.getPaths().forEach((key, pathItem) -> {
                pathItem.readOperations().forEach(op -> op.addExtension("x-internal-id", "allow"));
            });
        };
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Allow static assets (if needed)
        registry.addResourceHandler("swagger-ui.html**")
                .addResourceLocations("classpath:/META-INF/resources/");

        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
