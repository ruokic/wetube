import passport from "passport";
import GithubStrategy from "passport-github";
import { githubLoginCallback } from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(new GithubStrategy({
    clientID: process.env.GH_ID,
    clientSecret: process.env.GH_SECRET,
    callbackURL: `https://desolate-forest-59343.herokuapp.com${routes.githubCallback}`
},
    githubLoginCallback
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
