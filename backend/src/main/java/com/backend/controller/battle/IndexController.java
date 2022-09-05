package com.backend.controller.battle;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
//@RequestMapping("/battle/")
public class IndexController {
    @RequestMapping("/")
    public String index(){
        return "battle/index.html";
    }
}
