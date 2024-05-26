import axios from 'axios';

const axiosOptions = {
    validateStatus: status => true,
    withCredentials: true,
}

class authService {
 
    signin(credentials, callback){
        // Axios - post credentials to API endpoint, callback result
        axios.post(`${import.meta.env.VITE_API_URL}/users/login`, credentials, axiosOptions)
            .then(response => {

                switch(response.status){
                    case 200: {
                        sessionStorage.setItem('loggedIn', credentials.email)
                        callback(true, response.data)
                        break;
                    }
                    case 400:
                    case 401:
                    case 500: {
                        callback(false, response.data)
                        break;
                    }  
                    default: {
                        callback(false, "Server error.")
                    }
                }
            })
            .catch(error => {
                callback(false, "Error logging in.")
            })
    }

    register(credentials, callback){
        console.log(credentials)
        // Axios - post user credentials to API endpoint
        axios.post(`${import.meta.env.VITE_API_URL}/users/register`, credentials)
                .then(response => {
                    this.signin({email: credentials.email, password: credentials.password}, (isSuccessful, reason) => {
                        !isSuccessful ?? console.log(reason);
                        switch(response.status){
                            case 201: {
                                callback(true, response.data)
                                break;
                            }
                            case 409:
                            case 500: {
                                callback(false, response.data)
                                break;
                            }  
                            default: {
                                callback(false, "Server error.")
                            }
                        }

                    })
                })
                .catch(error => {
                    callback(false, "Error registering user.")
                })
    }

    isSignedIn(){
        return sessionStorage.getItem('loggedIn')?.length > 0;
    }

    signedInEmail(){
        return sessionStorage.getItem('loggedIn');
    }

    logout(callback){
        // Axios - post credentials to API endpoint, callback result
        axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, axiosOptions)
            .then(response => {
                switch(response.status){
                    case 204:{
                        sessionStorage.removeItem('loggedIn');
                        callback(true, response.message);
                    }
                    default: {
                        callback(false, "Server error, unable to log out/");
                    }
                }
            })
            .catch(error =>{
                callback(false, "Error logging out user.")
            })
    }
}

export default new authService()