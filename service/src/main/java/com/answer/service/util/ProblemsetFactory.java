package com.answer.service.util;


import com.answer.service.model.ProblemsetModel;

import java.util.*;

// 问题生成工厂
public class ProblemsetFactory {

    // 随机删选题目
    public static List<Map<String,Object>> createProblemset(List<Map<String,Object>> list,int limit){
        List<Map<String,Object>> problemset = new ArrayList<Map<String,Object>>();
        Set<Integer> index = new HashSet<Integer>();

        // 生成随机数索引
        while (index.size()<limit){
            index.add((int)(Math.random()*(list.size()-1)));
        }

        // 删选题目
        for(int i:index){
            problemset.add(list.get(i));
        }
        return  problemset;
    }


}
