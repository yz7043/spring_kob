package com.andyzhu.backend.controller.battle;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("/battle/")
public class BotInfoController {
    @RequestMapping("getBotInfo/")
    public List<String> getBotInfo(){
        List<String> list = new LinkedList<>();
        list.add("Haha");
        list.add("hehe");
        list.add("lala");
        return list;
    }
}
