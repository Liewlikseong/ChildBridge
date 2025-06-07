import { useSupabaseUser } from '#imports';

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  // List of protected routes that require authentication
  const protectedRoutes = ['/profile', '/profile-edit'];

  // Check if the route is protected and user is not authenticated
  if (protectedRoutes.includes(to.path) && !user.value) {
    // Redirect to login page with return URL
    return navigateTo({
      path: '/auth/login',
      query: {
        redirect: to.fullPath
      }
    });
  }
}); 