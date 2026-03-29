function formatPropertyResponse(propertyRow, landlordUser, isBookmarked) {
  let landlord = null;
  if (landlordUser) {
    landlord = {
      id: landlordUser.id,
      username: landlordUser.username ?? landlordUser.email ?? landlordUser.id,
      firstName: landlordUser.firstName,
      lastName: landlordUser.lastName,
      profileImage: landlordUser.profileImageUrl,
      phone: landlordUser.phone,
      isVerified: landlordUser.isVerified === "true",
    };
  } else if (propertyRow.listingContactName || propertyRow.listingContactPhone) {
    landlord = {
      id: "listing-contact",
      username: propertyRow.listingContactName || "Property contact",
      firstName: null,
      lastName: null,
      profileImage: null,
      phone: propertyRow.listingContactPhone ?? null,
      isVerified: false,
    };
  }
  return {
    id: propertyRow.id,
    landlordId: propertyRow.landlordId ?? null,
    listingContactName: propertyRow.listingContactName ?? null,
    listingContactPhone: propertyRow.listingContactPhone ?? null,
    title: propertyRow.title,
    description: propertyRow.description,
    type: propertyRow.type,
    status: propertyRow.status,
    price: Number(propertyRow.price),
    city: propertyRow.city,
    address: propertyRow.address,
    bedrooms: propertyRow.bedrooms,
    bathrooms: propertyRow.bathrooms,
    area: propertyRow.area ? Number(propertyRow.area) : null,
    images: propertyRow.images ?? [],
    isVerified: propertyRow.isVerified,
    hasLandDocuments: propertyRow.hasLandDocuments,
    landlord,
    isBookmarked,
    createdAt:
      propertyRow.createdAt?.toISOString?.() ??
      new Date().toISOString(),
  };
}

export { formatPropertyResponse };
