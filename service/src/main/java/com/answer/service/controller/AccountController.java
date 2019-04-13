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
    @GetMapping(value = "/{userName}")
    public Map<String,Object> getInfo(@PathVariable("userName") String userName) {
        // 从数据库读取数据
        String getSql = String.format("select * from account WHERE userName = '%1$s'",userName);
        List<Map<String,Object>> dataList = jdbcTemplate.queryForList(getSql);

        // 如果不存在账户则新建账户
        if(dataList.isEmpty()){
            String setSql = "INSERT INTO account (userName,score) VALUES (?,?)";
            int r = jdbcTemplate.update(setSql,userName,0);
            if(r !=1 ){
                return SignalFactory.createSignal("error");
            }
            dataList = jdbcTemplate.queryForList(getSql);

            return dataList.get(0);

        }
        return dataList.get(0);
    }

    // 通过uid修改分数
    @PostMapping(value = "/{uid}",produces = "application/json;charset=UTF-8")
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
