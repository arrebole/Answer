package com.answer.service.controller;


import com.answer.service.model.ProblemsetModel;
import com.answer.service.model.requestBody.ModifyScoreModel;
import com.answer.service.util.ProblemsetFactory;
import com.answer.service.util.SignalFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

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
    public List<Map<String,Object>> get(@RequestParam(value = "level", defaultValue = "1") int level, @RequestParam(value = "limit", defaultValue = "0") int limit) {
        if(level<=0){
            List<Map<String,Object>> sig = new ArrayList<Map<String,Object>>();
            sig.add(SignalFactory.createSignal("error"));
            return sig;
        }

        String sql = String.format("select * from problemset WHERE BINARY level=%1$s",level);
        List<Map<String,Object>> dataList = jdbcTemplate.queryForList(sql);


        if(dataList.size()<=limit){
            return dataList;
        }

        return ProblemsetFactory.createProblemset(dataList,limit);
    }

    // 从数据库添加问题
    @PostMapping("/add")
    public Map<String,Object> addProblemset(@RequestBody ProblemsetModel post){

        String sql = "INSERT INTO problemset (level,topic,solution,optionA,optionB,optionC,optionD) VALUES (?,?,?,?,?,?,?)";
        int r = jdbcTemplate.update(sql, post.level,post.topic,post.solution,post.optionA,post.optionB,post.optionC,post.optionD);
        if(r !=1 ){
            return SignalFactory.createSignal("error");
        }
        return SignalFactory.createSignal("success");
    }
}
