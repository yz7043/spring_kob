package com.andyzhu.backend.controller.battle;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/battle/")
public class IndexController {
    @RequestMapping("index/")
    public String index(){
        return "battle/index.html";
    }
}
