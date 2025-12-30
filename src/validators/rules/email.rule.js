const normalizeEmail = (email) => {
    if (typeof email !== "string") return null;

    const normalized = email.toLowerCase().trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(normalized) ? normalized : null;
};

export default normalizeEmail