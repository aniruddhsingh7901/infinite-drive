// import { Model, DataTypes } from 'sequelize';
// import sequelize from '../config/database';

// interface CartAttributes {
//     id: string;
//     user_id: string;
//     book_id: string;
//     quantity: number;
//     created_at?: Date;
//     updated_at?: Date;
// }

// class Cart extends Model<CartAttributes> {
//     public id!: string;
//     public user_id!: string;
//     public book_id!: string;
//     public quantity!: number;
//     public readonly created_at!: Date;
//     public readonly updated_at!: Date;
// }

// Cart.init({
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true
//     },
//     user_id: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         references: {
//             model: 'users',
//             key: 'id'
//         }
//     },
//     book_id: {
//         type: DataTypes.UUID,
//         allowNull: false,
//         references: {
//             model: 'books',
//             key: 'id'
//         }
//     },
//     quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         defaultValue: 1
//     }
// }, {
//     sequelize,
//     tableName: 'cart',
//     timestamps: true,
//     underscored: true
// });

// export default Cart;

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Book from './Book';

interface CartAttributes {
    id: string;
    user_id: string;
    book_id: string;
    quantity: number;
}

class Cart extends Model<CartAttributes> {
    declare id: string;
    declare user_id: string;
    declare book_id: string;
    declare quantity: number;
}

Cart.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    book_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    sequelize,
    tableName: 'cart',
    timestamps: true
});

Cart.belongsTo(Book, { foreignKey: 'book.id' });

export default Cart;