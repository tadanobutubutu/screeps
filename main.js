// TODO: This is the existing code that needs to be preserved

const UserSafety = {
    unsafe: {
      category: 'Unauthorized Advice'
    }
};

export const getSafetyCategory = (userSafetyStatus = UserSafety.unsafe) => userSafetyStatus.category;

export const getSafetyCategoryDetailed = (userSafetyStatus = UserSafety.unsafe) => userSafetyStatus;