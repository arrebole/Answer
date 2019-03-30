package com.answer.service.controller;


import com.answer.service.model.AccountModel;
import com.answer.service.model.requestBody.ModifyScoreModel;
import com.answer.service.util.SignalFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    //通过uid获取用户分数
    @GetMapping(value = "/getinfo/{uid}")
    public Map<String,Object> getInfo(@PathVariable("uid") long uid) {
        // 从数据库读取数据
        String sql = String.format("select * from account WHERE BINARY uid=%1$s",uid);

        List<Map<String,Object>> dataList = jdbcTemplate.queryForList(sql);

        //如果不存在则返回错误
        if(dataList.size() <= 0){
            return SignalFactory.createSignal("notfound");
        }
        return dataList.get(0);
    }


    // 通过uid修改分数
    @PostMapping(value = "/setinfo/{uid}",produces = "application/json;charset=UTF-8")
    public Map<String,Object> setInfo(@PathVariable("uid") long uid, @RequestBody ModifyScoreModel post) {
        // 获取改动的数据
        int modify = post.modify;
        // 从数据库取旧数据
        String getSQL = String.format("select score from account WHERE BINARY uid=%1$s",uid);
        Map<String,Object> data = jdbcTemplate.queryForMap(getSQL);
        if(data.isEmpty()){
            return SignalFactory.createSignal("notfound");
        }

        // 修改数据库数据
        int oldScore = (int)data.get("score");
        int newScore = oldScore + modify;
        String updateSQL = String.format("update account SET score =%1$d WHERE uid=%2$s",newScore,uid);
        jdbcTemplate.update(updateSQL);


        return SignalFactory.createSignal("success");
    }

}
