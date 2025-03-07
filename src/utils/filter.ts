const parseFilters = (filters: string | undefined): Record<string, any> => {
    if (!filters || typeof filters !== "string") return {};

    try {
        const parsedFilters = JSON.parse(filters);

        if (typeof parsedFilters !== "object" || parsedFilters === null) {
            throw new Error(
                "Invalid filter format. Please provide valid JSON."
            );
        }

        return Object.keys(parsedFilters).reduce(
            (conditions: Record<string, any>, key) => {
                const value = parsedFilters[key];
                const keys = key.split(".");
                const lastKey = keys.pop();

                if (lastKey === undefined) {
                    throw new Error(`Invalid filter key: ${key}`);
                }

                let currentCondition = conditions;

                keys.forEach((k) => {
                    if (!currentCondition[k]) {
                        currentCondition[k] = {};
                    }
                    currentCondition = currentCondition[k];
                });

                if (typeof value === "object" && value !== null) {
                    const operators = Object.keys(value);
                    operators.forEach((operator) => {
                        const operatorValue = value[operator];
                        if (
                            typeof operatorValue === "string" ||
                            typeof operatorValue === "number"
                        ) {
                            currentCondition[lastKey] =
                                currentCondition[lastKey] || {};
                            currentCondition[lastKey][operator] = operatorValue;
                        }
                    });
                } else {
                    if (typeof value === "string") {
                        currentCondition[lastKey] = {
                            contains: value,
                            mode: "insensitive",
                        };
                    } else if (
                        typeof value === "number" ||
                        typeof value === "boolean"
                    ) {
                        currentCondition[lastKey] = {
                            equals: value,
                        };
                    }
                }

                return conditions;
            },
            {} as Record<string, any>
        );
    } catch (error: Error | any) {
        throw new Error(error.message);
    }
};

export default parseFilters;
