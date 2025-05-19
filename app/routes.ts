import { type RouteConfig, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  route("/", "./home.tsx"),
  route("/about", "./about.tsx"),

  ...(await flatRoutes()),
] satisfies RouteConfig;
