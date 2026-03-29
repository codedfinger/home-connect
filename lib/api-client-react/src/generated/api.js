import { useMutation, useQuery } from "@tanstack/react-query";
import { customFetch } from "../custom-fetch";
const getHealthCheckUrl = () => {
  return `/api/healthz`;
};
const healthCheck = async (options) => {
  return customFetch(getHealthCheckUrl(), {
    ...options,
    method: "GET"
  });
};
const getHealthCheckQueryKey = () => {
  return [`/api/healthz`];
};
const getHealthCheckQueryOptions = (options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getHealthCheckQueryKey();
  const queryFn = ({
    signal
  }) => healthCheck({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useHealthCheck(options) {
  const queryOptions = getHealthCheckQueryOptions(options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getGetCurrentAuthUserUrl = () => {
  return `/api/auth/user`;
};
const getCurrentAuthUser = async (options) => {
  return customFetch(getGetCurrentAuthUserUrl(), {
    ...options,
    method: "GET"
  });
};
const getGetCurrentAuthUserQueryKey = () => {
  return [`/api/auth/user`];
};
const getGetCurrentAuthUserQueryOptions = (options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetCurrentAuthUserQueryKey();
  const queryFn = ({ signal }) => getCurrentAuthUser({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useGetCurrentAuthUser(options) {
  const queryOptions = getGetCurrentAuthUserQueryOptions(options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getLoginUrl = (params) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== void 0) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `/api/login?${stringifiedParams}` : `/api/login`;
};
const login = async (params, options) => {
  return customFetch(getLoginUrl(params), {
    ...options,
    method: "GET"
  });
};
const getLoginQueryKey = (params) => {
  return [`/api/login`, ...params ? [params] : []];
};
const getLoginQueryOptions = (params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getLoginQueryKey(params);
  const queryFn = ({
    signal
  }) => login(params, { signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useLogin(params, options) {
  const queryOptions = getLoginQueryOptions(params, options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getLogoutUrl = () => {
  return `/api/logout`;
};
const logout = async (options) => {
  return customFetch(getLogoutUrl(), {
    ...options,
    method: "GET"
  });
};
const getLogoutQueryKey = () => {
  return [`/api/logout`];
};
const getLogoutQueryOptions = (options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getLogoutQueryKey();
  const queryFn = ({
    signal
  }) => logout({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useLogout(options) {
  const queryOptions = getLogoutQueryOptions(options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getGetUserProfileUrl = () => {
  return `/api/users/profile`;
};
const getUserProfile = async (options) => {
  return customFetch(getGetUserProfileUrl(), {
    ...options,
    method: "GET"
  });
};
const getGetUserProfileQueryKey = () => {
  return [`/api/users/profile`];
};
const getGetUserProfileQueryOptions = (options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetUserProfileQueryKey();
  const queryFn = ({
    signal
  }) => getUserProfile({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useGetUserProfile(options) {
  const queryOptions = getGetUserProfileQueryOptions(options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getUpdateUserProfileUrl = () => {
  return `/api/users/profile`;
};
const updateUserProfile = async (updateUserProfileBody, options) => {
  return customFetch(getUpdateUserProfileUrl(), {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(updateUserProfileBody)
  });
};
const getUpdateUserProfileMutationOptions = (options) => {
  const mutationKey = ["updateUserProfile"];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { data } = props ?? {};
    return updateUserProfile(data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};
const useUpdateUserProfile = (options) => {
  return useMutation(getUpdateUserProfileMutationOptions(options));
};
const getListPropertiesUrl = (params) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== void 0) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0 ? `/api/properties?${stringifiedParams}` : `/api/properties`;
};
const listProperties = async (params, options) => {
  return customFetch(getListPropertiesUrl(params), {
    ...options,
    method: "GET"
  });
};
const getListPropertiesQueryKey = (params) => {
  return [`/api/properties`, ...params ? [params] : []];
};
const getListPropertiesQueryOptions = (params, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getListPropertiesQueryKey(params);
  const queryFn = ({
    signal
  }) => listProperties(params, { signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useListProperties(params, options) {
  const queryOptions = getListPropertiesQueryOptions(params, options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getCreatePropertyUrl = () => {
  return `/api/properties`;
};
const createProperty = async (createPropertyBody, options) => {
  return customFetch(getCreatePropertyUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createPropertyBody)
  });
};
const getCreatePropertyMutationOptions = (options) => {
  const mutationKey = ["createProperty"];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { data } = props ?? {};
    return createProperty(data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};
const useCreateProperty = (options) => {
  return useMutation(getCreatePropertyMutationOptions(options));
};
const getGetPropertyUrl = (id) => {
  return `/api/properties/${id}`;
};
const getProperty = async (id, options) => {
  return customFetch(getGetPropertyUrl(id), {
    ...options,
    method: "GET"
  });
};
const getGetPropertyQueryKey = (id) => {
  return [`/api/properties/${id}`];
};
const getGetPropertyQueryOptions = (id, options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetPropertyQueryKey(id);
  const queryFn = ({
    signal
  }) => getProperty(id, { signal, ...requestOptions });
  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions
  };
};
function useGetProperty(id, options) {
  const queryOptions = getGetPropertyQueryOptions(id, options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getUpdatePropertyUrl = (id) => {
  return `/api/properties/${id}`;
};
const updateProperty = async (id, updatePropertyBody, options) => {
  return customFetch(getUpdatePropertyUrl(id), {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(updatePropertyBody)
  });
};
const getUpdatePropertyMutationOptions = (options) => {
  const mutationKey = ["updateProperty"];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { id, data } = props ?? {};
    return updateProperty(id, data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};
const useUpdateProperty = (options) => {
  return useMutation(getUpdatePropertyMutationOptions(options));
};
const getDeletePropertyUrl = (id) => {
  return `/api/properties/${id}`;
};
const deleteProperty = async (id, options) => {
  return customFetch(getDeletePropertyUrl(id), {
    ...options,
    method: "DELETE"
  });
};
const getDeletePropertyMutationOptions = (options) => {
  const mutationKey = ["deleteProperty"];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { id } = props ?? {};
    return deleteProperty(id, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};
const useDeleteProperty = (options) => {
  return useMutation(getDeletePropertyMutationOptions(options));
};
const getGetMyPropertiesUrl = () => {
  return `/api/properties/my`;
};
const getMyProperties = async (options) => {
  return customFetch(getGetMyPropertiesUrl(), {
    ...options,
    method: "GET"
  });
};
const getGetMyPropertiesQueryKey = () => {
  return [`/api/properties/my`];
};
const getGetMyPropertiesQueryOptions = (options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetMyPropertiesQueryKey();
  const queryFn = ({
    signal
  }) => getMyProperties({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useGetMyProperties(options) {
  const queryOptions = getGetMyPropertiesQueryOptions(options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getCreateEnquiryUrl = () => {
  return `/api/enquiries`;
};
const createEnquiry = async (createEnquiryBody, options) => {
  return customFetch(getCreateEnquiryUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(createEnquiryBody)
  });
};
const getCreateEnquiryMutationOptions = (options) => {
  const mutationKey = ["createEnquiry"];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { data } = props ?? {};
    return createEnquiry(data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};
const useCreateEnquiry = (options) => {
  return useMutation(getCreateEnquiryMutationOptions(options));
};
const getGetReceivedEnquiriesUrl = () => {
  return `/api/enquiries/received`;
};
const getReceivedEnquiries = async (options) => {
  return customFetch(getGetReceivedEnquiriesUrl(), {
    ...options,
    method: "GET"
  });
};
const getGetReceivedEnquiriesQueryKey = () => {
  return [`/api/enquiries/received`];
};
const getGetReceivedEnquiriesQueryOptions = (options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetReceivedEnquiriesQueryKey();
  const queryFn = ({ signal }) => getReceivedEnquiries({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useGetReceivedEnquiries(options) {
  const queryOptions = getGetReceivedEnquiriesQueryOptions(options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getGetSentEnquiriesUrl = () => {
  return `/api/enquiries/sent`;
};
const getSentEnquiries = async (options) => {
  return customFetch(getGetSentEnquiriesUrl(), {
    ...options,
    method: "GET"
  });
};
const getGetSentEnquiriesQueryKey = () => {
  return [`/api/enquiries/sent`];
};
const getGetSentEnquiriesQueryOptions = (options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetSentEnquiriesQueryKey();
  const queryFn = ({ signal }) => getSentEnquiries({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useGetSentEnquiries(options) {
  const queryOptions = getGetSentEnquiriesQueryOptions(options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getGetBookmarksUrl = () => {
  return `/api/bookmarks`;
};
const getBookmarks = async (options) => {
  return customFetch(getGetBookmarksUrl(), {
    ...options,
    method: "GET"
  });
};
const getGetBookmarksQueryKey = () => {
  return [`/api/bookmarks`];
};
const getGetBookmarksQueryOptions = (options) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey = queryOptions?.queryKey ?? getGetBookmarksQueryKey();
  const queryFn = ({
    signal
  }) => getBookmarks({ signal, ...requestOptions });
  return { queryKey, queryFn, ...queryOptions };
};
function useGetBookmarks(options) {
  const queryOptions = getGetBookmarksQueryOptions(options);
  const query = useQuery(queryOptions);
  return { ...query, queryKey: queryOptions.queryKey };
}
const getAddBookmarkUrl = () => {
  return `/api/bookmarks`;
};
const addBookmark = async (bookmarkBody, options) => {
  return customFetch(getAddBookmarkUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(bookmarkBody)
  });
};
const getAddBookmarkMutationOptions = (options) => {
  const mutationKey = ["addBookmark"];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { data } = props ?? {};
    return addBookmark(data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};
const useAddBookmark = (options) => {
  return useMutation(getAddBookmarkMutationOptions(options));
};
const getRemoveBookmarkUrl = (propertyId) => {
  return `/api/bookmarks/${propertyId}`;
};
const removeBookmark = async (propertyId, options) => {
  return customFetch(getRemoveBookmarkUrl(propertyId), {
    ...options,
    method: "DELETE"
  });
};
const getRemoveBookmarkMutationOptions = (options) => {
  const mutationKey = ["removeBookmark"];
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { propertyId } = props ?? {};
    return removeBookmark(propertyId, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};
const useRemoveBookmark = (options) => {
  return useMutation(getRemoveBookmarkMutationOptions(options));
};
export {
  addBookmark,
  createEnquiry,
  createProperty,
  deleteProperty,
  getAddBookmarkMutationOptions,
  getAddBookmarkUrl,
  getBookmarks,
  getCreateEnquiryMutationOptions,
  getCreateEnquiryUrl,
  getCreatePropertyMutationOptions,
  getCreatePropertyUrl,
  getCurrentAuthUser,
  getDeletePropertyMutationOptions,
  getDeletePropertyUrl,
  getGetBookmarksQueryKey,
  getGetBookmarksQueryOptions,
  getGetBookmarksUrl,
  getGetCurrentAuthUserQueryKey,
  getGetCurrentAuthUserQueryOptions,
  getGetCurrentAuthUserUrl,
  getGetMyPropertiesQueryKey,
  getGetMyPropertiesQueryOptions,
  getGetMyPropertiesUrl,
  getGetPropertyQueryKey,
  getGetPropertyQueryOptions,
  getGetPropertyUrl,
  getGetReceivedEnquiriesQueryKey,
  getGetReceivedEnquiriesQueryOptions,
  getGetReceivedEnquiriesUrl,
  getGetSentEnquiriesQueryKey,
  getGetSentEnquiriesQueryOptions,
  getGetSentEnquiriesUrl,
  getGetUserProfileQueryKey,
  getGetUserProfileQueryOptions,
  getGetUserProfileUrl,
  getHealthCheckQueryKey,
  getHealthCheckQueryOptions,
  getHealthCheckUrl,
  getListPropertiesQueryKey,
  getListPropertiesQueryOptions,
  getListPropertiesUrl,
  getLoginQueryKey,
  getLoginQueryOptions,
  getLoginUrl,
  getLogoutQueryKey,
  getLogoutQueryOptions,
  getLogoutUrl,
  getMyProperties,
  getProperty,
  getReceivedEnquiries,
  getRemoveBookmarkMutationOptions,
  getRemoveBookmarkUrl,
  getSentEnquiries,
  getUpdatePropertyMutationOptions,
  getUpdatePropertyUrl,
  getUpdateUserProfileMutationOptions,
  getUpdateUserProfileUrl,
  getUserProfile,
  healthCheck,
  listProperties,
  login,
  logout,
  removeBookmark,
  updateProperty,
  updateUserProfile,
  useAddBookmark,
  useCreateEnquiry,
  useCreateProperty,
  useDeleteProperty,
  useGetBookmarks,
  useGetCurrentAuthUser,
  useGetMyProperties,
  useGetProperty,
  useGetReceivedEnquiries,
  useGetSentEnquiries,
  useGetUserProfile,
  useHealthCheck,
  useListProperties,
  useLogin,
  useLogout,
  useRemoveBookmark,
  useUpdateProperty,
  useUpdateUserProfile
};
