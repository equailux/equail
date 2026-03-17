import type { NavigationGuard, Router } from "vue-router"

//

const redirect404 = (router: Router): NavigationGuard => (to, from, next) => {
    if (!to.query.path) return

    const redirectPath = to.query.path as string
    const resolved = router.resolve(redirectPath)

    if (resolved.matched.length > 0 && resolved.name !== '404') {
        const { path, ...remainingQuery } = to.query
        return { path: redirectPath, query: remainingQuery, replace: true }
    }
}

//

export { redirect404 }
