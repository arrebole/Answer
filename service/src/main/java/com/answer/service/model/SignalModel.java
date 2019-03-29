package com.answer.service.model;


// 信息标识

enum Symbol {
    success,
    error,
}


public class SignalModel {
    public Symbol code;

    public SignalModel(String sign) {
        switch (sign) {
            case "success":
                this.code = Symbol.success;
                break;

            case "error":
                this.code = Symbol.error;
                break;
        }
    }
}
