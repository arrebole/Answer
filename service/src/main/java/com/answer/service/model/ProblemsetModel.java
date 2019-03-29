package com.answer.service.model;


public class ProblemsetModel {

    public ProblemsetModel() {

    }

    public ProblemsetModel(long id, int level, String topic, String solution, String a, String b, String c, String d) {
        this.id = id;
        this.topic = topic;
        this.level = level;
        this.solution = solution;
        this.optionA = a;
        this.optionB = b;
        this.optionC = c;
        this.optionD = d;

    }

    public long id;
    // 难度
    public int level;
    // 题目
    public String topic;
    // 答案
    public String solution;
    // 选项
    public String optionA;
    public String optionB;
    public String optionC;
    public String optionD;

}
