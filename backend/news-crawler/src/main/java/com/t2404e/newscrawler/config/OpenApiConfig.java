// backend/src/main/java/.../config/OpenApiConfig.java
package com.t2404e.newscrawler.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "News Crawler API",
                version = "1.0",
                description = "Spring Boot backend cho hệ thống tin tức + crawler"
        )
)
public class OpenApiConfig {
}
