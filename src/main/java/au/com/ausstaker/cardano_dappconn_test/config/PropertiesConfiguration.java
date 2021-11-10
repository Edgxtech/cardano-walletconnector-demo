package au.com.ausstaker.cardano_dappconn_test.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

/**
 * @author timmyedge (https://github.com/Ausstaker)
 * @since Nov 2021
 */
@Configuration
public class PropertiesConfiguration {

    @Bean()
    protected EncryptedPropertyConfigurer encryptedPropertyPlaceholder() {
        EncryptedPropertyConfigurer dpc = new EncryptedPropertyConfigurer();
        dpc.setLocations(new Resource[] {new ClassPathResource("encrypted.properties")});
        return dpc;
    }
}
