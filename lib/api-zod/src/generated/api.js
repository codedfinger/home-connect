import * as zod from "zod";
const HealthCheckResponse = zod.object({
  status: zod.string()
});
const GetCurrentAuthUserResponse = zod.object({
  user: zod.object({
    id: zod.string(),
    username: zod.string(),
    firstName: zod.string().nullish(),
    lastName: zod.string().nullish(),
    profileImage: zod.string().nullish()
  }).nullable()
});
const LoginQueryParams = zod.object({
  returnTo: zod.coerce.string().optional()
});
const GetUserProfileResponse = zod.object({
  id: zod.string(),
  username: zod.string(),
  firstName: zod.string().nullish(),
  lastName: zod.string().nullish(),
  profileImage: zod.string().nullish(),
  role: zod.enum(["landlord", "tenant"]).nullish(),
  phone: zod.string().nullish(),
  isVerified: zod.boolean(),
  bio: zod.string().nullish()
});
const UpdateUserProfileBody = zod.object({
  role: zod.enum(["landlord", "tenant"]),
  phone: zod.string().nullish(),
  bio: zod.string().nullish()
});
const UpdateUserProfileResponse = zod.object({
  id: zod.string(),
  username: zod.string(),
  firstName: zod.string().nullish(),
  lastName: zod.string().nullish(),
  profileImage: zod.string().nullish(),
  role: zod.enum(["landlord", "tenant"]).nullish(),
  phone: zod.string().nullish(),
  isVerified: zod.boolean(),
  bio: zod.string().nullish()
});
const ListPropertiesQueryParams = zod.object({
  type: zod.enum(["rent", "sale"]).optional(),
  city: zod.coerce.string().optional(),
  minPrice: zod.coerce.number().optional(),
  maxPrice: zod.coerce.number().optional(),
  bedrooms: zod.coerce.number().optional(),
  verified: zod.coerce.boolean().optional()
});
const ListPropertiesResponse = zod.object({
  properties: zod.array(
    zod.object({
      id: zod.number(),
      landlordId: zod.string(),
      title: zod.string(),
      description: zod.string(),
      type: zod.enum(["rent", "sale"]),
      status: zod.enum(["available", "rented", "sold"]),
      price: zod.number(),
      city: zod.string(),
      address: zod.string(),
      bedrooms: zod.number(),
      bathrooms: zod.number(),
      area: zod.number().nullish(),
      images: zod.array(zod.string()),
      isVerified: zod.boolean(),
      hasLandDocuments: zod.boolean(),
      landlord: zod.object({
        id: zod.string(),
        username: zod.string(),
        firstName: zod.string().nullish(),
        lastName: zod.string().nullish(),
        profileImage: zod.string().nullish(),
        phone: zod.string().nullish(),
        isVerified: zod.boolean()
      }).nullish(),
      isBookmarked: zod.boolean(),
      createdAt: zod.coerce.date()
    })
  ),
  total: zod.number()
});
const CreatePropertyBody = zod.object({
  title: zod.string(),
  description: zod.string(),
  type: zod.enum(["rent", "sale"]),
  price: zod.number(),
  city: zod.string(),
  address: zod.string(),
  bedrooms: zod.number(),
  bathrooms: zod.number(),
  area: zod.number().nullish(),
  images: zod.array(zod.string()),
  hasLandDocuments: zod.boolean()
});
const GetPropertyParams = zod.object({
  id: zod.coerce.number()
});
const GetPropertyResponse = zod.object({
  id: zod.number(),
  landlordId: zod.string(),
  title: zod.string(),
  description: zod.string(),
  type: zod.enum(["rent", "sale"]),
  status: zod.enum(["available", "rented", "sold"]),
  price: zod.number(),
  city: zod.string(),
  address: zod.string(),
  bedrooms: zod.number(),
  bathrooms: zod.number(),
  area: zod.number().nullish(),
  images: zod.array(zod.string()),
  isVerified: zod.boolean(),
  hasLandDocuments: zod.boolean(),
  landlord: zod.object({
    id: zod.string(),
    username: zod.string(),
    firstName: zod.string().nullish(),
    lastName: zod.string().nullish(),
    profileImage: zod.string().nullish(),
    phone: zod.string().nullish(),
    isVerified: zod.boolean()
  }).nullish(),
  isBookmarked: zod.boolean(),
  createdAt: zod.coerce.date()
});
const UpdatePropertyParams = zod.object({
  id: zod.coerce.number()
});
const UpdatePropertyBody = zod.object({
  title: zod.string().optional(),
  description: zod.string().optional(),
  type: zod.enum(["rent", "sale"]).optional(),
  status: zod.enum(["available", "rented", "sold"]).optional(),
  price: zod.number().optional(),
  city: zod.string().optional(),
  address: zod.string().optional(),
  bedrooms: zod.number().optional(),
  bathrooms: zod.number().optional(),
  area: zod.number().nullish(),
  images: zod.array(zod.string()).optional(),
  hasLandDocuments: zod.boolean().optional()
});
const UpdatePropertyResponse = zod.object({
  id: zod.number(),
  landlordId: zod.string(),
  title: zod.string(),
  description: zod.string(),
  type: zod.enum(["rent", "sale"]),
  status: zod.enum(["available", "rented", "sold"]),
  price: zod.number(),
  city: zod.string(),
  address: zod.string(),
  bedrooms: zod.number(),
  bathrooms: zod.number(),
  area: zod.number().nullish(),
  images: zod.array(zod.string()),
  isVerified: zod.boolean(),
  hasLandDocuments: zod.boolean(),
  landlord: zod.object({
    id: zod.string(),
    username: zod.string(),
    firstName: zod.string().nullish(),
    lastName: zod.string().nullish(),
    profileImage: zod.string().nullish(),
    phone: zod.string().nullish(),
    isVerified: zod.boolean()
  }).nullish(),
  isBookmarked: zod.boolean(),
  createdAt: zod.coerce.date()
});
const DeletePropertyParams = zod.object({
  id: zod.coerce.number()
});
const DeletePropertyResponse = zod.object({
  success: zod.boolean(),
  message: zod.string().nullish()
});
const GetMyPropertiesResponse = zod.object({
  properties: zod.array(
    zod.object({
      id: zod.number(),
      landlordId: zod.string(),
      title: zod.string(),
      description: zod.string(),
      type: zod.enum(["rent", "sale"]),
      status: zod.enum(["available", "rented", "sold"]),
      price: zod.number(),
      city: zod.string(),
      address: zod.string(),
      bedrooms: zod.number(),
      bathrooms: zod.number(),
      area: zod.number().nullish(),
      images: zod.array(zod.string()),
      isVerified: zod.boolean(),
      hasLandDocuments: zod.boolean(),
      landlord: zod.object({
        id: zod.string(),
        username: zod.string(),
        firstName: zod.string().nullish(),
        lastName: zod.string().nullish(),
        profileImage: zod.string().nullish(),
        phone: zod.string().nullish(),
        isVerified: zod.boolean()
      }).nullish(),
      isBookmarked: zod.boolean(),
      createdAt: zod.coerce.date()
    })
  ),
  total: zod.number()
});
const CreateEnquiryBody = zod.object({
  propertyId: zod.number(),
  message: zod.string(),
  phone: zod.string().nullish()
});
const GetReceivedEnquiriesResponse = zod.object({
  enquiries: zod.array(
    zod.object({
      id: zod.number(),
      propertyId: zod.number(),
      tenantId: zod.string(),
      message: zod.string(),
      phone: zod.string().nullish(),
      status: zod.enum(["pending", "read"]),
      property: zod.object({
        id: zod.number(),
        landlordId: zod.string(),
        title: zod.string(),
        description: zod.string(),
        type: zod.enum(["rent", "sale"]),
        status: zod.enum(["available", "rented", "sold"]),
        price: zod.number(),
        city: zod.string(),
        address: zod.string(),
        bedrooms: zod.number(),
        bathrooms: zod.number(),
        area: zod.number().nullish(),
        images: zod.array(zod.string()),
        isVerified: zod.boolean(),
        hasLandDocuments: zod.boolean(),
        landlord: zod.object({
          id: zod.string(),
          username: zod.string(),
          firstName: zod.string().nullish(),
          lastName: zod.string().nullish(),
          profileImage: zod.string().nullish(),
          phone: zod.string().nullish(),
          isVerified: zod.boolean()
        }).nullish(),
        isBookmarked: zod.boolean(),
        createdAt: zod.coerce.date()
      }).nullish(),
      tenant: zod.object({
        id: zod.string(),
        username: zod.string(),
        firstName: zod.string().nullish(),
        lastName: zod.string().nullish(),
        profileImage: zod.string().nullish(),
        phone: zod.string().nullish(),
        isVerified: zod.boolean()
      }).nullish(),
      createdAt: zod.coerce.date()
    })
  ),
  total: zod.number()
});
const GetSentEnquiriesResponse = zod.object({
  enquiries: zod.array(
    zod.object({
      id: zod.number(),
      propertyId: zod.number(),
      tenantId: zod.string(),
      message: zod.string(),
      phone: zod.string().nullish(),
      status: zod.enum(["pending", "read"]),
      property: zod.object({
        id: zod.number(),
        landlordId: zod.string(),
        title: zod.string(),
        description: zod.string(),
        type: zod.enum(["rent", "sale"]),
        status: zod.enum(["available", "rented", "sold"]),
        price: zod.number(),
        city: zod.string(),
        address: zod.string(),
        bedrooms: zod.number(),
        bathrooms: zod.number(),
        area: zod.number().nullish(),
        images: zod.array(zod.string()),
        isVerified: zod.boolean(),
        hasLandDocuments: zod.boolean(),
        landlord: zod.object({
          id: zod.string(),
          username: zod.string(),
          firstName: zod.string().nullish(),
          lastName: zod.string().nullish(),
          profileImage: zod.string().nullish(),
          phone: zod.string().nullish(),
          isVerified: zod.boolean()
        }).nullish(),
        isBookmarked: zod.boolean(),
        createdAt: zod.coerce.date()
      }).nullish(),
      tenant: zod.object({
        id: zod.string(),
        username: zod.string(),
        firstName: zod.string().nullish(),
        lastName: zod.string().nullish(),
        profileImage: zod.string().nullish(),
        phone: zod.string().nullish(),
        isVerified: zod.boolean()
      }).nullish(),
      createdAt: zod.coerce.date()
    })
  ),
  total: zod.number()
});
const GetBookmarksResponse = zod.object({
  properties: zod.array(
    zod.object({
      id: zod.number(),
      landlordId: zod.string(),
      title: zod.string(),
      description: zod.string(),
      type: zod.enum(["rent", "sale"]),
      status: zod.enum(["available", "rented", "sold"]),
      price: zod.number(),
      city: zod.string(),
      address: zod.string(),
      bedrooms: zod.number(),
      bathrooms: zod.number(),
      area: zod.number().nullish(),
      images: zod.array(zod.string()),
      isVerified: zod.boolean(),
      hasLandDocuments: zod.boolean(),
      landlord: zod.object({
        id: zod.string(),
        username: zod.string(),
        firstName: zod.string().nullish(),
        lastName: zod.string().nullish(),
        profileImage: zod.string().nullish(),
        phone: zod.string().nullish(),
        isVerified: zod.boolean()
      }).nullish(),
      isBookmarked: zod.boolean(),
      createdAt: zod.coerce.date()
    })
  ),
  total: zod.number()
});
const AddBookmarkBody = zod.object({
  propertyId: zod.number()
});
const RemoveBookmarkParams = zod.object({
  propertyId: zod.coerce.number()
});
const RemoveBookmarkResponse = zod.object({
  success: zod.boolean(),
  message: zod.string().nullish()
});
export {
  AddBookmarkBody,
  CreateEnquiryBody,
  CreatePropertyBody,
  DeletePropertyParams,
  DeletePropertyResponse,
  GetBookmarksResponse,
  GetCurrentAuthUserResponse,
  GetMyPropertiesResponse,
  GetPropertyParams,
  GetPropertyResponse,
  GetReceivedEnquiriesResponse,
  GetSentEnquiriesResponse,
  GetUserProfileResponse,
  HealthCheckResponse,
  ListPropertiesQueryParams,
  ListPropertiesResponse,
  LoginQueryParams,
  RemoveBookmarkParams,
  RemoveBookmarkResponse,
  UpdatePropertyBody,
  UpdatePropertyParams,
  UpdatePropertyResponse,
  UpdateUserProfileBody,
  UpdateUserProfileResponse
};
