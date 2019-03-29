package com.answer.service.util;

import com.answer.service.model.AccountModel;


// 用户信息工厂
public class AccountFactory {

    public static AccountModel getUserInfo(long uid){
        return new AccountModel(uid, "xxx", 0);
    }
}
