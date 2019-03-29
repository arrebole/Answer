package com.answer.service.model;

public class AccountModel {

    public long uid;
    public String nickname;
    public int score;

    public AccountModel(long uid,String nickname,int score){
        this.uid = uid;
        this.nickname = nickname;
        this.score = score;
    }
}
