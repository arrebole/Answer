package com.answer.service.controller;


import com.answer.service.model.AccountModel;
import com.answer.service.model.SignalModel;
import com.answer.service.model.requestBody.ModifyScoreModel;
import com.answer.service.util.AccountFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class AccountController {


    //通过uid获取用户分数
    @GetMapping(value = "/info/{uid}")
    public AccountModel getInfo(@PathVariable("uid") long uid) {

        return AccountFactory.getUserInfo(uid);
    }

    // 通过uid修改分数
    @PostMapping(value = "/info/{uid}",produces = "application/json;charset=UTF-8")
    public SignalModel setInfo(@PathVariable("uid") long uid, @RequestBody ModifyScoreModel model) {
        // 获取改动的数据
        int modify = model.modify;

        return new SignalModel("success");
    }

}
