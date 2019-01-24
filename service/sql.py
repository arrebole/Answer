import json

# 数据库查询


def SQLQuery(url: str, key: str, value)-> dict:
    # 从数据库读取用户信息
    f = open(url, encoding="utf-8")
    date: list = json.loads(f.read())
    res = None
    # 找到用户
    for item in date:
        if item[key] == value:
            res = item
            break
    # 如果找不到用户
    if res == None:
        res = {"uid": 404, "userName": "404", "score": 0}
    # 返回数据
    f.close()
    return res


#  User分数更新
def SQLUpdateUser(url: str, uid, score)-> bool:

    # 从数据库读取用户信息
    f1 = open(url, "r", encoding="utf-8")
    # 数据转换
    data: list = json.loads(f1.read())
    f1.close()
    # 查询对象
    user = -1
    for (index, item) in enumerate(data):
        if item["uid"] == uid:
            user = index
            break

    # 修改数据
    # 如果没有这个属性则返回错误
    if user == -1:
        return False

    # 更新数据
    old = data[user]["score"]
    data[user]["score"] = old + score

    # 将数据写入文件
    with open(url, 'w', encoding="utf-8") as f2:
        json.dump(data, f2)

    return True


def SQLQuestions(url:str, idList:list)->list:
    res = list()
    with open(url, encoding="utf-8") as f:
        date: list = json.loads(f.read())
        for i in idList:
            for item in date:
                if item["id"] == i:
                    res.append(item)
                    break
    return res