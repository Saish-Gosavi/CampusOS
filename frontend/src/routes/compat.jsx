import React from "react";
import {
  Link as RouterLink,
  useNavigate as useRouterNavigate,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
  Outlet as RouterOutlet,
  Navigate as RouterNavigate,
  useLocation
} from "react-router-dom";

// Re-exports
export const Outlet = RouterOutlet;
export const Navigate = RouterNavigate;
export { useRouterParams as useParams };

// useRouterState helper
export function useRouterState(options) {
  const location = useLocation();
  if (options && typeof options.select === "function") {
    return options.select({ location });
  }
  return { location };
}

// notFound helper
export function notFound() {
  return new Error("Not Found");
}

// Mocks for TanStack Router structures
export function createFileRoute(path) {
  return (config) => {
    return {
      useParams: () => {
        const params = useRouterParams();
        return params;
      },
      useSearch: () => {
        const [searchParams] = useRouterSearchParams();
        return Object.fromEntries(searchParams.entries());
      },
      component: config.component,
    };
  };
}

export function useRouter() {
  const navigate = useRouterNavigate();
  return {
    invalidate: () => {},
    navigate: (options) => {
      if (typeof options === "object" && options.to) {
        let path = options.to;
        if (options.params) {
          Object.entries(options.params).forEach(([k, v]) => {
            path = path.replace(`$${k}`, v);
          });
        }
        if (options.search) {
          const searchParams = new URLSearchParams(options.search).toString();
          if (searchParams) path += `?${searchParams}`;
        }
        navigate(path);
      } else {
        navigate(options);
      }
    }
  };
}

export function useNavigate() {
  const navigate = useRouterNavigate();
  return (options) => {
    if (typeof options === "object" && options.to) {
      let path = options.to;
      if (options.params) {
        Object.entries(options.params).forEach(([k, v]) => {
          path = path.replace(`$${k}`, v);
        });
      }
      if (options.search) {
        const search = typeof options.search === "function" ? options.search({}) : options.search;
        const searchParams = new URLSearchParams(search).toString();
        if (searchParams) path += `?${searchParams}`;
      }
      navigate(path);
    } else {
      navigate(options);
    }
  };
}

export const Link = React.forwardRef(({ to, params, search, ...props }, ref) => {
  let finalTo = to;
  if (params && typeof to === "string") {
    Object.entries(params).forEach(([key, val]) => {
      finalTo = finalTo.replace(`$${key}`, val);
    });
  }
  if (search && typeof to === "string") {
    const searchParams = new URLSearchParams(search).toString();
    if (searchParams) {
      finalTo += `?${searchParams}`;
    }
  }
  return <RouterLink ref={ref} to={finalTo} {...props} />;
});
Link.displayName = "Link";
