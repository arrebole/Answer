package com.answer.service.controller;


import com.answer.service.model.ProblemsetModel;
import com.answer.service.util.ProblemsetFactory;
import com.answer.service.util.SignalFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


// 获取题目入口
@RestController
@RequestMapping("/problemset")
public class ProblemsetController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    //通过题目数量和难度获取题目
    //只能使用get方法
    @GetMapping("/get")
    public List<Map<String,Object>> get(@RequestParam(value = "level", defaultValue = "1") int level, @RequestParam(value = "limit", defaultValue = "8") int limit) {
        if(level<=0){
            List<Map<String,Object>> sig = new ArrayList<Map<String,Object>>();
            sig.add(SignalFactory.createSignal("error"));
            return sig;
        }

        String sql = String.format("select * from problemset WHERE BINARY level=%1$s",level);
        List<Map<String,Object>> dataList = jdbcTemplate.queryForList(sql);

        return ProblemsetFactory.createProblemset(dataList,level);
    }
}
