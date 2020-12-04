import { SelectQueryBuilder } from "typeorm";
import { Filter, OrderDirection } from "./filter";

export function addDefaultFilter<T>(
    builder: SelectQueryBuilder<T>,
    filter?: Filter
): SelectQueryBuilder<T> {
    if (filter?.skip && filter?.take)
        builder.skip((escape(filter.skip.toString()) as unknown) as number);
    if (filter?.take)
        builder.take((escape(filter.take.toString()) as unknown) as number);

    if (filter) addOrderFilter(builder, filter);

    return builder;
}

function addOrderFilter<T>(
    builder: SelectQueryBuilder<T>,
    filter: Filter
): SelectQueryBuilder<T> {
    if (filter.order) {
        const orders = filter.order.split(",");
        const directions = filter.orderDirection?.split(",");

        for (let i = 0; i < orders.length; i++) {
            let order = orders[i];
            const direction = directions
                ? (directions[i] as OrderDirection)
                : OrderDirection.ASC;

            const splitted = order.split(".");

            if (splitted.length == 1) order = `${builder.alias}.${order}`;

            builder.orderBy(escape(order), escape(direction) as OrderDirection);
        }
    }

    return builder;
}
