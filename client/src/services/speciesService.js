import axios from 'axios';

const axiosOptions = {
    validateStatus: status => true,
    withCredentials: true,
}

class speciesService {
 
    getSpecies(callback){
        axios.get(`${import.meta.env.VITE_API_URL}/species`, axiosOptions)
            .then(response => {
                switch(response.status){
                    case 200: {
                        callback(true, response.data)
                        break;
                    }
                    case 404:
                    case 422:
                    case 500: {
                        callback(false, response.data)
                        break;
                    }
                    default: {
                        callback(false, "Server error.")
                    }
            }})
            .catch(error => {
                callback(false, "Error updating species list.")
            })
    }

    getSpeciesById(speciesId, callback){

        axios.get(`${import.meta.env.VITE_API_URL}/species/${speciesId}`, axiosOptions)
            .then(response => {
                switch(response.status){
                    case 200: {
                        callback(true, response.data)
                        break;
                    }
                    case 404:
                    case 422:
                    case 500: {
                        callback(false, response.data)
                        break;
                    }
                    default: {
                        callback(false, "Server error.")
                    }
            }})
            .catch(error => {
                callback(false, "Error updating species.")
            })
    }

    createSpecies(newSpecies, callback){
        axios.post(`${import.meta.env.VITE_API_URL}/species`, newSpecies, axiosOptions)
            .then(response => {
                switch(response.status){
                    case 201: {
                        callback(true, response.data)
                        break;
                    }
                    case 422:
                    case 500: {
                        callback(false, response.data)
                        break;
                    }
                    default: {
                        callback(false, "Server error.")
                    }
            }})
            .catch(error => {
                callback(false, "Error updating species.")
            })
    }

    updateSpecies(updatedSpecies, callback){
        axios.put(`${import.meta.env.VITE_API_URL}/species/${updatedSpecies.id}`, updatedSpecies, axiosOptions)
            .then(response => {
                switch(response.status){
                    case 204: {
                        callback(true, response.data)
                        break;
                    }
                    case 404:
                    case 422:
                    case 500: {
                        callback(false, response.data)
                        break;
                    }
                    default: {
                        callback(false, "Server error.")
                    }
            }})
            .catch(error => {
                callback(false, "Error updating species.")
            })    
    }

    deleteSpecies(speciesId, callback){
            axios.delete(`${import.meta.env.VITE_API_URL}/species/${speciesId}`, axiosOptions)
                .then(response => {
                    switch(response.status){
                        case 204: {
                            callback(true, response.data)
                            break;
                        }
                        case 400:
                        case 404:
                        case 500: {
                            callback(false, response.data)
                            break;
                        }
                        default: {
                            callback(false, "Server error.")
                        }
                }})
                .catch(error => {
                    callback(false, "Error updating species.")
                })
        }
}

export default new speciesService()