exports.generateString = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

exports.axiosRequest = (params) => axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });