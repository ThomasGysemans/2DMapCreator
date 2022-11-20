export default function isLoggedIn(context:AuthContextValue) {
  return !context.loading && context.user != null;
}