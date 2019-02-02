# -*- coding: UTF-8 -*-

from flask import Flask, request, jsonify, json
import Type
import sql

# 创建服务器
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# 获取题目


@app.route('/api/questions', methods=["GET"])
def questions():

    # 1、获取路由参数 difficult ->难度 ；limit ->返回个数
    difficult = request.args.get("difficult")
    limit = request.args.get("limit")

    #   处理参数为空
    if difficult == None:
        difficult = "1"
    if limit == None:
        limit = "8"

    # 返回问题数据
    return jsonify(Type.NewQuestions(int(difficult), int(limit)))

# 获取用户信息


@app.route('/api/user/info/<int:userId>', methods=["GET"])
def userInfo(userId):
    # 从数据库读取用户信息
    data: dict = sql.SQLQuery("./data/user.json", "uid", userId)

    # 返回用户分数
    return jsonify({
        "uid": data["uid"],
        "userName": data["userName"],
        "score": data["score"]
    })

# 提交用户分数


@app.route('/api/user/submit', methods=["POST"])
def submitScore():
    # 获取提交的 内容
    post_Data = request.get_json()

    # 处理内容为空
    if "uid" not in post_Data or "score" not in post_Data:
        return jsonify(Type.NewError())

    uid = post_Data["uid"]
    score = post_Data["score"]
    # 修改成绩 返回状态码
    code = sql.SQLUpdateUser("./data/user.json", uid, score)
    if code:
        return jsonify(Type.NewOk())
    return jsonify(Type.NewError())


# 启动服务器
if __name__ == "__main__":
    app.run(debug=True, port=443,ssl_context='adhoc')
