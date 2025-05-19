import { Button } from "@mui/material"
import styles from "./PageNotFound.module.css"
import { Link } from "react-router"
import { Path } from "@/common/routing/Routing"

export const PageNotFound = () => (
  <>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <Button component={Link} to={Path.Main} variant="contained">Вернуться на главную</Button>
  </>
)
