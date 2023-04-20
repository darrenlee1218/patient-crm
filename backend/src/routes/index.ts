import { Router } from "express";
import { UserRoute } from "./user.route";
import { PatientRoute } from "./patient.route";

const router = Router();

const publicRoutes = [
  {
    path: "/user",
    route: UserRoute.router,
  },
  {
    path: "/patient",
    route: PatientRoute.router,
  },
];

publicRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export const RouterMap = router;
