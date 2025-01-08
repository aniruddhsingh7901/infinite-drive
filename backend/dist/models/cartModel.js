"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const userModel_1 = __importDefault(require("./userModel"));
const Book_1 = __importDefault(require("./Book"));
class Cart extends sequelize_1.Model {
}
Cart.init({
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
}, {
    sequelize: database_1.default,
    modelName: 'Cart',
});
Cart.belongsTo(userModel_1.default, { foreignKey: 'userId' });
Cart.belongsToMany(Book_1.default, { through: 'CartItems', foreignKey: 'cartId' });
exports.default = Cart;
