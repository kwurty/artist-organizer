
const getAccessTokenRefresh = async (refreshToken) => {
    const { data: { access_token } } = await Axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });

    return access_token
}

export default getAccessTokenRefresh;