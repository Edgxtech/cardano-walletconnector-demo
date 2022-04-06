package au.com.ausstaker.cardano_dappconn_test.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author ausstaker (https://github.com/Ausstaker)
 * @since Nov 2021
 */
@Controller
public class HomeController {

    @RequestMapping("/")
    public String viewHome() {
        return "index";
    }
}
