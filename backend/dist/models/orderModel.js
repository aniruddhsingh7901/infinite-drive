"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const userModel_1 = __importDefault(require("./userModel"));
const Book_1 = __importDefault(require("./Book"));
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: userModel_1.default,
            key: 'id',
        },
    },
    items: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
    totalAmount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Order',
});
Order.belongsTo(userModel_1.default, { foreignKey: 'userId' });
Order.belongsToMany(Book_1.default, { through: 'OrderItems', foreignKey: 'orderId' });
exports.default = Order;
