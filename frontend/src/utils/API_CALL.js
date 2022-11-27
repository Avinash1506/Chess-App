const api_call = async (url, method, data) => {
    const obj = { 
        method: method,
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }, 
    }

    if(method === 'POST' || method === 'PUT') {
        obj['body'] = JSON.stringify(data);
    }

    console.log("obj: ", obj);

    console.log(url);
    
    const response = await fetch(url, obj);

    const res = await response.json();

    return res;
}

export default api_call;