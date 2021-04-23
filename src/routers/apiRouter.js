import express from "express";
import { deleteComment, postAddComment, postRegisterView } from "../controllers/videoController";
import routes from "../routes";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.deleteComment, deleteComment);

export default apiRouter;