import express from "express";
import passport from "passport";
import { home, search } from "../controllers/videoController";
import { 
    getJoin, 
    postJoin, 
    getLogin, 
    postLogin, 
    logout, 
    githubLogin,
    postGithubLogin,
    getMe
} from "../controllers/userController";
import routes from "../routes";
import { onlyPrivate, onlyPublic } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.me, getMe);

globalRouter.get(routes.github, githubLogin);
globalRouter.get(routes.githubCallback, 
    passport.authenticate('github', { 
        failureRedirect: "/login"
    }), 
    postGithubLogin
);

export default globalRouter;