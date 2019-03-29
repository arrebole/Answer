package com.answer.service.util;


import com.answer.service.model.ProblemsetModel;

import java.util.LinkedList;
import java.util.List;

// 问题生成工厂
public class ProblemsetFactory {

    // 从数据库读取生成问题列表
    public static List<ProblemsetModel> getFromSql(final int Level, final int limit) {

        List<ProblemsetModel> local = new LinkedList<ProblemsetModel>();
        for (long i = 0; i <= limit; i++) {
            local.add(new ProblemsetModel(i,Level,"topic","solution","a","b","c","d"));
        }
        return local;
    }


}
