const { validateToken, generateToken } = require('../../utils');

// Cookie exists?
if (req.cookies.user) {
    // let's verify the cookie is legit
    let verifiedUser = await validateToken(req.cookies.user);
    if (verifiedUser) {
        // let's see if the user is in the database
        let userInDatabase = await getUserInfo(verifiedUser.id);
        if (userInDatabase) {
            // user is in the database, send the info to the front end
            return res.send(setFrontEndUser(userInDatabase));
        } else {
            // user isn't in the database but they have a cookie - let's get rid of that cookie and start fresh
            res.clearCookie('user');
        }
    }
}
// No cookies! Move on to spotify auth
const state = generateString(16);
res.cookie(STATEKEY, state);
return res.redirect(
    `https://accounts.spotify.com/authorize?${queryString.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scopes.join(' '),
        redirect_uri: CALLBACK_URL,
        state: state,
        show_dialog: true
    })}`,
);