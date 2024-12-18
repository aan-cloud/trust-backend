type SortOrder = "asc" | "desc";

const parseSorts = (sort?: string | null): Array<Record<string, SortOrder>> => {
    if (!sort || typeof sort !== "string") return [];

    try {
        const sortParams = JSON.parse(sort);

        if (typeof sortParams !== "object" || sortParams === null) {
            throw new Error("Invalid sort format. Please provide valid JSON.");
        }

        const sortOptions: Array<Record<string, any>> = [];

        Object.keys(sortParams).forEach((key) => {
            const value = sortParams[key];

            const keys = key.split(".");

            if (
                typeof value !== "string" ||
                !["asc", "desc"].includes(value.toLowerCase())
            ) {
                throw new Error("Invalid sort type. Must be 'asc' or 'desc'.");
            }

            const sortDirection = value.toLowerCase() as SortOrder;

            const currentOption: Record<string, any> = {};
            let currentRef = currentOption;

            keys.forEach((k, index) => {
                if (index === keys.length - 1) {
                    currentRef[k] = sortDirection;
                } else {
                    currentRef[k] = currentRef[k] || {};
                    currentRef = currentRef[k];
                }
            });

            sortOptions.push(currentOption);
        });

        return sortOptions;
    } catch (error: Error | any) {
        throw new Error(error.message);
    }
};

export default parseSorts;
