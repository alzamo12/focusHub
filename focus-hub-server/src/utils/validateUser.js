export const validateUser = (user) => {
    const errors = {};

    if (!user || typeof user !== "object") {
        return {
            valid: false,
            errors: {
                user: "User data is required.",
            },
        };
    }

    // Email
    if (!user.email || typeof user.email !== "string") {
        errors.email = "Email is required.";
    } else {
        const email = user.email.trim().toLowerCase();

        if (email.length > 254) {
            errors.email = "Invalid email address.";
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.email = "Invalid email address.";
        }
    }

    // Display name
    if (user.name !== undefined) {
        if (typeof user.name !== "string") {
            errors.name = "Name must be a string.";
        } else if (user.name.trim().length > 100) {
            errors.name =
                "Name must be less than 100 characters.";
        }
    }

    // Photo URL
    if (user.photo !== undefined && user.photo !== null) {
        if (typeof user.photo !== "string") {
            errors.photo = "Photo URL must be a string.";
        } else if (user.photo.length > 2048) {
            errors.photo = "Invalid photo URL.";
        }
    }


    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

