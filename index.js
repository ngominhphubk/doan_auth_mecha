// create instance axios config
const ins = axios.create({
    baseURL : 'http://localhost:3000/api',
    timeout: 3 * 1000, // unit is ms
    headers: {
        'Content-Type' : 'application/json'
    }
})
// xy ly data truoc khi request den server
ins.interceptors.request.use( async (config) => {
    if(config.url.indexOf('/login') >= 0  ) {
        return config;
    }
    if(config.url.indexOf('/refreshToken') >= 0){
    const refreshToken = await ins.getLocalRefreshToken()
    config.headers['rf-token'] = refreshToken
    return config
    }
    const token = await ins.getLocalAccessToken()
    config.headers['x-token'] = token
    console.log('truoc khi gui request den server :'+ token)
    // const {token, timeExpired} = await ins.getLocalAccessToken();
    // console.log({token, timeExpired})
    // const now = new Date().getTime();
    // if(timeExpired < now) {
    //     try {
    //         console.log('expired time ')
    //          const {status, element : {token, timeExpired}} = await refreshToken();
    //     if(status === 'success') {
    //         // set token & timeExpired vao localStorage
    //         await ins.setLocalAccessToken({token, timeExpired})
    //         return config;
    //     }
    //     } catch (error){
    //         return Promise.reject(error)
    //     }

    // }
    return config;
},
err => {
    return Promise.reject(err)
})

//xu ly data sau khi nhan response tu server
ins.interceptors.response.use(async (response) => {
    console.log('sau khi nhan dc respone tu server:')
    const config = response.config;
     if(config.url.indexOf('/login') >= 0 ||
    config.url.indexOf('/refreshToken') >= 0 ) {
        return response;
    }
    const {code, msg}  = response.data;
    console.log(response.data)
    //response.data tồn tại trước khi kết quả trả về client
    if(code && code === 401) {
        if( msg && msg === 'jwt expired' )
        console.log('truong hop token het han')
            const result = await refreshToken();
            //neu refresh token thanh cong
            if(result.status === 'success'){
                const status = result.status;
                const accessToken = result.element.accessToken;
                console.log('status', status)
                if(accessToken) {
                    config.headers['x-token'] = accessToken
                    await ins.setLocalAccessToken(accessToken)
                    return ins(config)
                }
                //refesh token that bai
            } else {
                console.log('dang xuat khoi trai dat')
            localStorage.clear();
        }
    }
    return response;
},
err => {
    return Promise.reject(err)
})

//function 
const btn_login = document.querySelector('#login')
if(btn_login) {
    btn_login.addEventListener('click', async ()=> {
        const {status, element : {accessToken, refreshToken}} = await login();
        if(status === 'success') {
            // set token & timeExpired vao localStorage
            await ins.setLocalAccessToken(accessToken)
            await ins.setLocalRefreshToken(refreshToken)
        }
    })
}
async function login() {
    return (await ins.get('/login')).data
}
ins.setLocalAccessToken = async (token) => {
    window.localStorage.setItem('accessToken', token)
}

ins.getLocalAccessToken = async () => {
    return window.localStorage.getItem('accessToken') ?
    window.localStorage.getItem('accessToken') : null
   
}
ins.setLocalRefreshToken = async (token) => {
    window.localStorage.setItem('refreshToken', token)
}

ins.getLocalRefreshToken = async () => {
    return window.localStorage.getItem('refreshToken') ?
    window.localStorage.getItem('refreshToken') : null
   
}
//end function
const btn_list = document.querySelector('#getlist')
if(btn_list){
    btn_list.addEventListener('click' , async () => {
        const {status, element} = await getUser();
        console.log({status, element})
    })
}
async function getUser() {
    return ( await ins.get('/user')).data
}

async function refreshToken() {
    return ( await ins.get('/refreshToken')).data
}
