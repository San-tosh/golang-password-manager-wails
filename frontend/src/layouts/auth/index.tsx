import { Routes, Route, Navigate } from "react-router-dom";
import routes from "../../routes";
import FixedPlugin from "../../components/fixedPlugin/FixedPlugin";
import { ReactNotifications} from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import 'animate.css';
export default function Auth() {
    const getRoutes = (routes: RoutesType[]): any => {
      return routes.map((prop, key) => {
        if (prop.layout === "/auth") {
          return (
            <Route path={`/${prop.path}`} element={prop.component} key={key} />
          );
        } else {
          return null;
        }
      });
    };
    return (
      <div>
        <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
          <FixedPlugin />
          <main className={`mx-auto min-h-screen`}>
            <div className="relative flex">
              <div className="mx-auto flex min-h-full w-full flex-col justify-center pt-12 md:max-w-[75%] lg:h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px]">
                <div className="mb-auto flex flex-col pl-5 pr-5 lg:pl-60 lg:pr-60 xl:max-w-full items-center justify-center">
                  <Routes>
                    {getRoutes(routes)}
                    <Route
                      path="/"
                      element={<Navigate to="/auth/sign-in" replace />}
                    />
                      <Route
                      path="/sign-up"
                      element={<Navigate to="/auth/sign-up" replace />}
                    />
                  </Routes>
                </div>
                {/*<Footer />*/}
              </div>
            </div>
          </main>
        </div>
        <ReactNotifications/>
      </div>
    );
  }