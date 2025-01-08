

// import { Sequelize, DataTypes, Model, Op } from 'sequelize';
// import sequelize from '../config/database';

// interface OrderAttributes {
//     id: string;
//     userId: string;
//     bookId: string;
//     format: string;
//     downloadLink: string | null;
//     status: 'pending' | 'completed' | 'failed' | 'awaiting_payment';
//     email: string;
//     amount: number;
//     payment_currency: string;
//     payment_address: string;
//     tx_hash?: string;
//     paid_amount?: number;
//     completed_at?: Date;
//     created_at: Date;
//     updated_at: Date;
// }

// class Order extends Model<OrderAttributes> {
//     declare id: string;
//     declare userId: string;
//     declare bookId: string;
//     declare format: string;
//     declare downloadLink: string | null;
//     declare status: 'pending' | 'completed' | 'failed' | 'awaiting_payment';
//     declare email: string;
//     declare amount: number;
//     declare payment_currency: string;
//     declare payment_address: string;
//     declare tx_hash?: string;
//     declare paid_amount?: number;
//     declare completed_at?: Date;
//     declare created_at: Date;
//     declare updated_at: Date;

//     static async findByUserId(userId: string): Promise<Order[]> {
//         return this.findAll({ where: { userId } });
//     }

//     static async findPendingPayments(): Promise<Order[]> {
//         return this.findAll({
//             where: {
//                 status: {
//                     [Op.in]: ['pending', 'awaiting_payment']
//                 }
//             }
//         });
//     }

//     static async updateOrderStatus(orderId: string, update: {
//         status: 'pending' | 'completed' | 'failed' | 'awaiting_payment';
//         tx_hash?: string;
//         paid_amount?: number;
//         payment_address?: string;
//         payment_currency?: string;
//     }) {
//         const updateData: any = {
//             status: update.status,
//             updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
//         };

//         if (update.tx_hash !== undefined) {
//             updateData.tx_hash = update.tx_hash;
//         }

//         if (update.paid_amount !== undefined) {
//             updateData.paid_amount = update.paid_amount;
//         }

//         if (update.payment_address !== undefined) {
//             updateData.payment_address = update.payment_address;
//         }

//         if (update.payment_currency !== undefined) {
//             updateData.payment_currency = update.payment_currency;
//         }

//         if (update.status === 'completed') {
//             updateData.completed_at = new Date();
//         }

//         return await this.update(
//             updateData,
//             {
//                 where: { id: orderId },
//                 returning: true
//             }
//         );
//     }

//     static async createOrder(data: {
//         userId: string;
//         bookId: string;
//         email: string;
//         amount: number;
//         format: string;
//         payment_currency: string;
//         payment_address: string;
//     }) {
//         const { v4: uuidv4 } = require('uuid');
//         return await this.create({
//             ...data,
//             id: uuidv4(),
//             status: 'pending',
//             downloadLink: null,
//             created_at: new Date(),
//             updated_at: new Date()
//         });
//     }
// }

// Order.init(
//     {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: DataTypes.UUIDV4,
//             primaryKey: true
//         },
//         userId: {
//             type: DataTypes.UUID,
//             allowNull: false,
//         },
//         bookId: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         format: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         downloadLink: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         status: {
//             type: DataTypes.ENUM('pending', 'completed', 'failed', 'awaiting_payment'),
//             defaultValue: 'pending',
//             allowNull: false
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 isEmail: true
//             }
//         },
//         amount: {
//             type: DataTypes.DECIMAL(20, 8),
//             allowNull: false
//         },
//         payment_currency: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         payment_address: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         tx_hash: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         paid_amount: {
//             type: DataTypes.DECIMAL(20, 8),
//             allowNull: true
//         },
//         completed_at: {
//             type: DataTypes.DATE,
//             allowNull: true
//         },
//         created_at: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//         },
//         updated_at: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//         }
//     },
//     {
//         sequelize,
//         modelName: 'Order',
//         tableName: 'orders',
//         timestamps: false,
//         indexes: [
//             {
//                 fields: ['userId']
//             },
//             {
//                 fields: ['bookId']
//             },
//             {
//                 fields: ['status']
//             },
//             {
//                 fields: ['email']
//             }
//         ]
//     }
// );

// export default Order;

// src/models/orderModel.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Order extends Model {
    declare id: string;
    declare userId: string;
    declare bookId: string;
    declare format: string;
    declare status: string;
    declare email: string;
    declare amount: number;
    declare payment_currency: string;
    declare payment_address: string;
    declare downloadLink: string | null;
    declare downloadToken: string | null;
    declare downloadExpiresAt: Date | null;

    static async updateOrderStatus(orderId: string, update: any) {
        return await this.update(
            update,
            {
                where: { id: orderId },
                returning: true
            }
        );
    }
}

Order.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        bookId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        format: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending',
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        amount: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false
        },
        payment_currency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payment_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        downloadLink: {
            type: DataTypes.STRING,
            allowNull: true
        },
        downloadToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        downloadExpiresAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true
    }
);

export default Order;