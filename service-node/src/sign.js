
const SignError = {
    code: "error"
}

const SignSuccess = {
    code: "success"
}

// 返回标识
class Sign{
    constructor(){
        this.error = JSON.stringify(SignError)
        this.success = JSON.stringify(SignSuccess)
    }
}

module.exports = new Sign()