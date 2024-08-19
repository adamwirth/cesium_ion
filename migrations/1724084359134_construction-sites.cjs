/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('construction_sites', {
        id: 'id',
        name: { type: 'string', allowNull: true },
        volume: { type: 'integer', allowNull: false },
        cost: { type: 'float', allowNull: false },
        color: { type: 'string', comment: 'hex code' },
        deliveryDate: {
            type: 'timestamp',
            allowNull: true,
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => { };
