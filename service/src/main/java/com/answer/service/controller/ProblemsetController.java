package com.answer.service.controller;


import com.answer.service.model.ProblemsetModel;
import com.answer.service.util.ProblemsetFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


// 获取题目入口
@RestController
@RequestMapping("/problemset")
public class ProblemsetController {


    //通过题目数量和难度获取题目
    //只能使用get方法
    @GetMapping("/get")
    public List<ProblemsetModel> get(@RequestParam(value = "level", defaultValue = "1") int level, @RequestParam(value = "limit", defaultValue = "8") int limit) {
        return ProblemsetFactory.getFromSql(8,limit);
    }
}
