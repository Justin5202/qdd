import Axios from 'axios'
import API from './resource'
import CryptoJS from 'crypto-js'

var crypto = require('crypto')

export default {
    login (data) {
        return Axios.post(API.login, data)
    },
    wxLogin (data) {
        return Axios.post(API.wxLogin, data)
    },
    register (data) {
        return Axios.post(API.register, data)
    },
    getCode (data) {
        return Axios.post(API.getCode, data)
    },
    resetPsw (data) {
        return Axios.post(API.resetPsw, data)
    },
    getRoomList (data) {
        return Axios.post(API.getRoomList, data)
    },
    getIndex (data) {
        return Axios.post(API.getIndex, data)
    },
    getChildrenRoomList (data) {
        return Axios.post(API.getChildrenRoomList, data)
    },
    getShopList (data) {
        return Axios.post(API.getShopList, data)
    },
    getChatRoom (data) {
        return Axios.post(API.getChatRoom, data)
    },
    getFriend (data) {
        return Axios.post(API.getFriend, data)
    },
    getFriendInfo (data) {
        return Axios.post(API.getFriendInfo, data)
    },
    getUserInfo (data) {
        return Axios.post(API.getUserInfo, data)
    },
    getRank (data) {
        return Axios.post(API.getRank, data)
    },
    getTask (data) {
        return Axios.post(API.getTask, data)
    },
    getReward (data) {
        return Axios.post(API.getReward, data)
    },
    getNews (data) {
        return Axios.post(API.getNews, data)
    },
    getNewsDetail (data) {
        return Axios.post(API.getNewsDetail, data)
    },
    getService (data) {
        return Axios.post(API.getService, data)
    },
    buy (data) {
        return Axios.post(API.buy, data)
    },
    modifyName (data) {
        return Axios.post(API.modifyName, data)
    },
    modifyPsw (data) {
        return Axios.post(API.modifyPsw, data)
    },
    modifyPayPsw (data) {
        return Axios.post(API.modifyPayPsw, data)
    },
    referrals (data) {
        return Axios.post(API.referrals, data)
    },
    addPraise (data) {
        return Axios.post(API.addPraise, data)
    },
    addFriend (data) {
        return Axios.post(API.addFriend, data)
    },
    deleteFriend (data) {
        return Axios.post(API.deleteFriend, data)
    },
    handleFriend (data) {
        return Axios.post(API.handleFriend, data)
    },
    gift (data) {
        return Axios.post(API.gift, data)
    },
    give (data) {
        return Axios.post(API.give, data)
    },
    enterRoom (data) {
        return Axios.post(API.enterRoom, data)
    },
    leaveRoom (data) {
        return Axios.post(API.leaveRoom, data)
    },
    createRoom (data) {
        return Axios.post(API.createRoom, data)
    },
    roomSpeak (data) {
        return Axios.post(API.roomSpeak, data)
    },
    getBanner (data) {
        return Axios.post(API.getBanner, data)
    },
    sendRedBag (data) {
        return Axios.post(API.sendRedBag, data)
    },
    hbInfo (data) {
        return Axios.post(API.hbInfo, data)
    },
    openRedBag (data) {
        return Axios.post(API.openRedBag, data)
    },
    getRedBagReco (data) {
        return Axios.post(API.getRedBagReco, data)
    },
    getLastRedBag (data) {
        return Axios.post(API.getLastRedBag, data)
    },
    inOutReco (data) {
        return Axios.post(API.inOutReco, data)
    },
    getSpeaker (data) {
        return Axios.post(API.getSpeaker, data)
    },
    recharge (data) {
        return Axios.post(API.recharge, data)
    },
    reward (data) {
        return Axios.post(API.reward, data)
    },
    exchange (data) {
        return Axios.post(API.exchange, data)
    },
    getTeamMembersInfo (data) {
        return Axios.post(API.getTeamMembersInfo, data)
    },
    getExchange (data) {
        return Axios.post(API.getExchange, data)
    },
    removeTeamMember (data) {
        return Axios.post(API.removeTeamMember, data)
    },
    checkVer (data) {
        return Axios.post(API.checkVer, data)
    },
    getQrCode (data) {
        return Axios.post(API.getQrCode, data)
    },
    remark (data) {
        return Axios.post(API.remark, data)
    },
    numberRange (data) {
        return Axios.post(API.numberRange, data)
    },
    backCheck (data) {
        return Axios.post(API.backCheck, data)
    },
    resetPayPsw (data) {
        return Axios.post(API.resetPayPsw, data)
    },
    md(str) {
        let sha = crypto.createHash('sha1').update(str.toString()).digest("hex")
        let md = crypto.createHash('md5').update(sha.toString()).digest("hex")
        return md
    },
    encrypted (data, time) {
        let psw
        if(time != null) {
            psw = "qdd@@wm2017@@wei" + time
        } else {
            psw = "qdd@@wm2017@@wei" + data;
        }
        if(psw.length > 16) {
            psw = psw.substr(psw.length - 16)
        }
        var key = CryptoJS.enc.Utf8.parse(psw);
        var iv = CryptoJS.enc.Utf8.parse("5efd3f6060e20330");
        var plaintText = CryptoJS.enc.Utf8.parse(data);// 明文  
        var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
            iv:iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7  
        });  
        encryptedData = encryptedData.ciphertext.toString();  
        return CryptoJS.enc.Hex.parse(encryptedData).toString();  
        // var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    }
}