package com.answer.service.util;

import java.util.HashMap;
import java.util.Map;

// 信息标识
enum Symbol {
    success,
    notfound,
    error,
}


public class SignalFactory {

    public static Map<String,Object> createSignal(String sign) {
        Map<String,Object> sigal = new HashMap<String, Object>();

        switch (sign) {
            case "success":
                sigal.put("code", Symbol.success);
                break;

            case "notfound":
                sigal.put("code",Symbol.notfound);
                break;

            case "error":
                sigal.put("code", Symbol.error);
                break;

        }
        return  sigal;
    }
}