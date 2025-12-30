const normalizeUsername = (username) => {
    if (typeof username !== "string") return null;

    const normalized = username.toLowerCase().trim();
    const regex = /^[a-z0-9_]+$/;

    return regex.test(normalized) ? normalized : null;
};

export default normalizeUsername