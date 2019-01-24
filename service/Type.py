# -*- coding: UTF-8 -*-
import random
import sql

QuestionsTotal = 10

def NewError()->dict:
    return {"code":"Error"}

def NewOk()->dict:
    return {"code":"Ok"}

# 根据难度和个数 创建一个问题列表
def NewQuestions(difficult: int, limit: int):
    url = "./data/questions/lv{}.json".format(difficult)
    questionsId = list()
    # 添加limit个问题成员
    for _ in range(limit):
        # 创建问题的id (随机生成id 然后从数据库查询)
        id = random.randint(1, QuestionsTotal)
        questionsId.append(id)
    return sql.SQLQuestions(url,questionsId)
