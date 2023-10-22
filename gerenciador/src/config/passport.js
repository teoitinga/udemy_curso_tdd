const passport = require('passport');
const passportjwt = require('passport-jwt');

const { Strategy, ExtractJwt } = passportjwt;

// TODO Resolver esta duplicação de variável. Colocar em aqrquivo.env. Atualmente está em? routes/auth.js
const SECRET = 'sdasjhdjew43987ddhskdjs';

module.exports = (app) => {

    const params = {
        secretOrKey: SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }
    
    const strategy = new Strategy(params, (payload, done) => {
        app.services.user.findOne({ id: payload.id }).then((user) => {

            if (user) {
                done(null, { ...payload })
            } else {
                done(null, false)
            }

        }).catch(err => {
            
            done(err, false);

        });
    })
    
    passport.use(strategy);

    return {
        authenticate: () => passport.authenticate('jwt', {session: false})
    }
}