import { LoginInputs } from "../lib/schemas"

export type LoginArgs = LoginInputs & {
  captcha?: string
}