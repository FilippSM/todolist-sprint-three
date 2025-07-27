import { Main } from "@/app/Main"
import { Login } from "@/features/auth/ui/Login/Login"
import { Route, Routes } from "react-router"
import { PageNotFound } from "../components"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { useAppSelector } from "../hooks"
import { selectIsLoggedIn } from "@/app/app-slice"

export const Path = {
  Main: "/todolist-sprint-three/",
  Login: "/todolist-sprint-three/login",
  Faq: "/todolist-sprint-three/Faq",
  NotFound: "*",
} as const

/* if (isLoggetIn) {
    return <Navigate to={Path.Main} />
  } */

export const Routing = () => {
  const isLoggetIn = useAppSelector(selectIsLoggedIn)

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={isLoggetIn} />}>
        <Route path={Path.Main} element={<Main />} />
        <Route path={Path.Faq} element={<h2>FAQ</h2>} />
      </Route>

      {/*   <Route
        path={Path.Main}
        element={
          <ProtectedRoute isAllowed={isLoggetIn}>
            <Main />
          </ProtectedRoute>
        }
      />
      <Route
        path={Path.Faq}
        element={
          <ProtectedRoute isAllowed={isLoggetIn}>
            <h2>Faq</h2>
          </ProtectedRoute>
        }
      /> */}
      <Route element={<ProtectedRoute isAllowed={!isLoggetIn} redirectPath={Path.Main}/>}>
        <Route path={Path.Login} element={<Login />} />
      </Route>

      <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
  )
}
