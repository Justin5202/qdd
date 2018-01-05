import api from '../../api/index'
// import store from '../vuex/store'
import router from '../../router'

//doLogin
export const doLogin = (that, data) => {
	api.login(data)
	.then(res => {
		console.log(res)
	})
}